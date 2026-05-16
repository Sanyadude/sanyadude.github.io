import { TextFormat } from './text-format.js'
import { LayoutProvider } from './layout-provider.js'
import { ThemeProvider } from './theme-provider.js'
import { WrappedTextLine } from './wrapped-text-line.js'

/**
 * TextRenderer class - represents a text renderer for the terminal
 */
export class TextRenderer {
    /**
     * Creates a new TextRenderer instance
     * @param {HTMLElement} container - The container element for the text renderer
     * @param {LayoutProvider} layoutProvider - The layout provider
     * @param {ThemeProvider} themeProvider - The theme provider object
     */
    constructor(container, layoutProvider, themeProvider) {
        this._container = container;
        this._layoutProvider = layoutProvider;
        this._themeProvider = themeProvider;
        this._lineElements = [];
        this._lineContentCache = {};
        this._lineIndexCache = {};
        this._lineSelectionCache = {};
        this._renderRequested = false;

        this.populateContainer();
    }

    /**
     * Creates the line elements for the text renderer
     * @returns {TextRenderer} - The instance of the TextRenderer
     */
    populateContainer() {
        if (!this._container) return this;
        let startIndex = this._lineElements.length;
        const layout = this._layoutProvider.getLayout();
        for (let i = startIndex; i < layout.lines; i++) {
            const lineElement = document.createElement('div');
            lineElement.style.height = `${layout.charHeight}px`;
            this._lineElements.push(lineElement);
            this._container.appendChild(lineElement);
        }
        return this;
    }

    /**
     * Renders the line at the given index into the container
     * @param {WrappedTextLine} line - The line to render
     * @param {number} index - The index of the line to render
     * @param {object|null} selection - The selection to render the line in
     * @returns {TextRenderer} - The instance of the TextRenderer
     */
    renderLine(line, index = 0, selection = null) {
        const lineElement = this._lineElements[index];
        if (!lineElement) return this;
        const lineWrapIndex = line.wrapIndex;
        const isLineRenderedAtIndex = this._lineIndexCache[index] == lineWrapIndex;
        this._lineIndexCache[index] = lineWrapIndex;
        const cache = selection ? this._lineSelectionCache : this._lineContentCache;
        let cachedData = cache[lineWrapIndex];
        const lineKey = `${lineWrapIndex}:${this._hashText(line.text)}${selection ? `:${selection.start}:${selection.end}` : ''}`;
        const isCached = cachedData ? cachedData.key == lineKey : false;
        const shouldSkipRender = isLineRenderedAtIndex && isCached && (selection || !this._lineSelectionCache[lineWrapIndex]);
        if (!selection) this._lineSelectionCache[lineWrapIndex] = null;
        if (shouldSkipRender) return this;
        if (!isCached) {
            cachedData = { key: lineKey, fragment: this._createLineFragment(line, selection) };
            cache[lineWrapIndex] = cachedData;
        }
        lineElement.replaceChildren(cachedData.fragment.cloneNode(true));
        return this;
    }

    /**
     * Renders the line at the given index into the container without caching
     * @param {WrappedTextLine} line - The line to render
     * @param {number} index - The index of the line to render
     * @param {object|null} selection - The selection to render the line in
     * @returns {TextRenderer} - The instance of the TextRenderer
     */
    renderLineCacheIgnore(line, index = 0, selection = null) {
        const lineElement = this._lineElements[index];
        if (!lineElement) return this;
        const fragment = this._createLineFragment(line, selection);
        lineElement.replaceChildren(fragment.cloneNode(true));
        return this;
    }

    /**
     * Renders the lines at the given start index into the container
     * @param {object[]} lines - The lines to render
     * @param {object[]} selectionRanges - The selection ranges
     * @param {number} startIndex - The start index of the lines to render
     * @param {number} endIndex - The end index of the lines to render
     * @returns {TextRenderer} - The instance of the TextRenderer
     */
    renderLines(lines = [], selectionRanges = [], startIndex = null, endIndex = null) {
        this._renderPayload = { lines, selectionRanges, startIndex, endIndex };
        if (this._renderRequested) return this;
        this._renderRequested = true;
        requestAnimationFrame(() => {
            const { lines, selectionRanges, startIndex, endIndex } = this._renderPayload;
            const minIndex = startIndex !== null ? startIndex : 0;
            const maxIndex = endIndex !== null ? endIndex : this._lineElements.length;
            for (let i = minIndex, j = 0; i < maxIndex; i++, j++) {
                const line = lines[j];
                if (!line) continue;
                const lineSelection = selectionRanges[j] || null;
                this.renderLine(line, i, lineSelection);
            }
            this._renderRequested = false;
        });
        return this;
    }

    /**
     * Creates a line fragment
     * @param {WrappedTextLine} line - The wrapped text line
     * @param {object|null} selection - The selection range {start, end} in column coordinates
     * @returns {DocumentFragment} - The line fragment
     */
    _createLineFragment(line, selection = null) {
        const fragment = document.createDocumentFragment();
        const htmlElements = this._lineToHtmlElements(line, selection);
        htmlElements.forEach(element => fragment.appendChild(element));
        return fragment;
    }

    /**
     * Converts a line to HTML elements with selection support
     * @param {WrappedTextLine} line - The wrapped text line
     * @param {object|null} selection - The selection range {start, end} in column coordinates
     * @returns {HTMLElement[]} - The HTML elements
     */
    _lineToHtmlElements(line, selection = null) {
        const htmlElements = [];
        const characters = line.characters || [];
        const selectionStart = selection ? selection.start : -1;
        const selectionEnd = selection ? selection.end : -1;
        // Handle empty line with selection
        if (characters.length === 0) {
            if (selection && selectionEnd > 0) {
                const plainPad = Math.max(0, selectionStart);
                if (plainPad) {
                    htmlElements.push(this._createStyledElement(' '.repeat(plainPad)));
                }
                const selectedPad = selectionEnd - selectionStart;
                if (selectedPad) {
                    htmlElements.push(this._createStyledElement(' '.repeat(selectedPad), this._getSelectionStyle()));
                }
            }
            return htmlElements;
        }
        let currentFormat = null;
        let currentText = '';
        let wasInsideSelection = false;
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            const insideSelection = !!selection && i >= selectionStart && i < selectionEnd;
            if (currentText && character.format !== currentFormat || (wasInsideSelection !== insideSelection)) {
                const style = wasInsideSelection 
                    ? { ...this._getStyleFromFormat(currentFormat), ...this._getSelectionStyle() } 
                    : this._getStyleFromFormat(currentFormat);
                htmlElements.push(this._createStyledElement(currentText, style));
                currentFormat = character.format;
                currentText = '';
            }
            currentText += character.text;
            currentFormat = character.format;
            wasInsideSelection = insideSelection;
        }
        if (currentText) {
            const style = wasInsideSelection 
                ? { ...this._getStyleFromFormat(currentFormat), ...this._getSelectionStyle() } 
                : this._getStyleFromFormat(currentFormat);
            htmlElements.push(this._createStyledElement(currentText, style));
        }
        // Handle selection extending beyond text
        if (selection && selectionEnd > line.text.length) {
            const plainPad = Math.max(0, selectionStart - line.text.length);
            if (plainPad) {
                htmlElements.push(this._createStyledElement(' '.repeat(plainPad)));
            }
            const selectedPad = selectionEnd - Math.max(selectionStart, line.text.length);
            if (selectedPad) {
                htmlElements.push(this._createStyledElement(' '.repeat(selectedPad), this._getSelectionStyle()));
            }
        }
        return htmlElements;
    }

    /**
     * Creates a styled element (span or text node)
     * @param {string} text - The text content
     * @param {object} style - The style object
     * @returns {HTMLElement|Text} - The created element
     */
    _createStyledElement(text, style) {
        const spanElement = document.createElement('span');
        spanElement.textContent = text;
        if (!style) return spanElement;
        Object.assign(spanElement.style, style);
        return spanElement;
    }

    /**
     * Returns the selection style
     * @returns {object} - The selection style
     */
    _getSelectionStyle() {
        const style = {};
        const theme = this._themeProvider.getTheme();
        if (theme.selectionBackground) {
            style.backgroundColor = theme.selectionBackground;
        }
        if (theme.selectionForeground) {
            style.color = theme.selectionForeground;
        }
        return style;
    }

    /**
     * Returns the style from the format
     * @param {string} format - The format
     * @returns {object} - The style from the format
     */
    _getStyleFromFormat(format = '') {
        const sgrState = TextFormat.parseSgr(format);
        return TextFormat.resolveSgrToStyle(sgrState, this._themeProvider.getTheme());
    }

    /**
     * Hashes the text
     * @param {string} text - The text to hash
     * @returns {number} - The hash of the text
     */
    _hashText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }
        return hash >>> 0;
    }

    /**
     * Resets the cache
     * @returns {TextRenderer} - The instance of the TextRenderer
     */
    resetCache() {
        this._lineContentCache = {};
        this._lineIndexCache = {};
        this._lineSelectionCache = {};
        this._renderRequested = false;
        return this;
    }
}

export default TextRenderer