import { TextFormat } from '../ansi/text-format.js'

/**
 * TextRenderer class - paints grid BufferRows into the terminal viewport
 */
export class TextRenderer {
    /**
     * Creates a new TextRenderer instance
     * @param {HTMLElement} container The container element for the text renderer
     * @param {LayoutProvider} layoutProvider The layout provider
     * @param {ThemeProvider} themeProvider The theme provider object
     */
    constructor(container, layoutProvider, themeProvider) {
        this._container = container;
        this._layoutProvider = layoutProvider;
        this._themeProvider = themeProvider;
        this._rowElements = [];
        this._rowContentCache = {};
        this._rowIndexCache = {};
        this._rowSelectionCache = {};

        this._renderPayload = {};
        this._renderScheduled = false;
        this._renderFrameId = null;

        this.populateContainer();
    }

    /**
     * Creates the row elements for the text renderer
     * @returns {TextRenderer} The instance of the TextRenderer
     */
    populateContainer() {
        if (!this._container) return this;
        const layout = this._layoutProvider.getLayout();
        if (!layout) return this;
        const rowCount = Math.max(0, layout.rows);
        while (this._rowElements.length > rowCount) {
            const rowElement = this._rowElements.pop();
            if (!rowElement) continue;
            rowElement.remove();
        }
        for (let i = this._rowElements.length; i < rowCount; i++) {
            const rowElement = document.createElement('div');
            this._rowElements.push(rowElement);
            this._container.appendChild(rowElement);
        }
        for (let i = 0; i < rowCount; i++) {
            this._rowElements[i].style.height = `${layout.charHeight}px`;
        }
        return this;
    }

    /**
     * Renders the row at the given viewport index into the container
     * @param {BufferRow} row The row to render
     * @param {number} viewportIndex The viewport index of the row
     * @param {number} documentIndex The document index of the row
     * @param {object|null} selection The selection to render the row in
     * @returns {TextRenderer} The instance of the TextRenderer
     */
    renderRow(row, viewportIndex = 0, documentIndex = 0, selection = null) {
        const rowElement = this._rowElements[viewportIndex];
        if (!rowElement) return this;
        const isRowInPlace = this._rowIndexCache[viewportIndex] === documentIndex;
        this._rowIndexCache[viewportIndex] = documentIndex;
        const cache = selection ? this._rowSelectionCache : this._rowContentCache;
        let cachedData = cache[documentIndex];
        const cacheKey = `${documentIndex}:${row.getHash()}${selection ? `:${selection.start}:${selection.end}` : ''}`;
        const isCached = cachedData ? cachedData.key === cacheKey : false;
        const shouldSkipRender = isRowInPlace && isCached && (selection || !this._rowSelectionCache[documentIndex]);
        if (!selection) this._rowSelectionCache[documentIndex] = null;
        if (shouldSkipRender) return this;
        if (!isCached) {
            cachedData = { key: cacheKey, fragment: this._createRowFragment(row, selection) };
            cache[documentIndex] = cachedData;
        }
        rowElement.replaceChildren(cachedData.fragment.cloneNode(true));
        return this;
    }

    /**
     * Schedules a render of the visible rows
     * @param {BufferRow[]} rows The rows to render
     * @param {object[]} selectionRanges The selection ranges
     * @param {number} documentOffset The document index of the first visible row
     * @returns {TextRenderer} The instance of the TextRenderer
     */
    scheduleRender(rows = [], selectionRanges = [], documentOffset = 0) {
        this._renderPayload = { rows, selectionRanges, documentOffset };
        if (this._renderScheduled) return this;
        this._renderScheduled = true;
        this._renderFrameId = requestAnimationFrame(() => {
            this._renderFrameId = null;
            try {
                const { rows, selectionRanges, documentOffset } = this._renderPayload;
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row) continue;
                    this.renderRow(row, i, documentOffset + i, selectionRanges[i] || null);
                }
            } finally {
                this._renderScheduled = false;
            }
        });
        return this;
    }

    /**
     * Creates a row fragment
     * @param {BufferRow} row The grid row
     * @param {object|null} selection The selection range {start, end} in column coordinates
     * @returns {DocumentFragment} The row fragment
     */
    _createRowFragment(row, selection = null) {
        const fragment = document.createDocumentFragment();
        const htmlElements = this._rowToHtmlElements(row, selection);
        htmlElements.forEach(element => fragment.appendChild(element));
        return fragment;
    }

    /**
     * Converts a row to HTML elements with selection support
     * @param {BufferRow} row The grid row
     * @param {object|null} selection The selection range {start, end} in column coordinates
     * @returns {HTMLElement[]} The HTML elements
     */
    _rowToHtmlElements(row, selection = null) {
        const htmlElements = [];
        const characters = row.toCharacters();
        const selectionStart = selection ? selection.start : -1;
        const selectionEnd = selection ? selection.end : -1;
        let currentFormat = null;
        let currentText = '';
        let wasInsideSelection = false;
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            const insideSelection = !!selection && i >= selectionStart && i < selectionEnd;
            if (currentText && (character.format !== currentFormat || wasInsideSelection !== insideSelection)) {
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
        if (selection && selectionEnd > characters.length) {
            const plainPad = Math.max(0, selectionStart - characters.length);
            if (plainPad) {
                htmlElements.push(this._createStyledElement(' '.repeat(plainPad)));
            }
            const selectedPad = selectionEnd - Math.max(selectionStart, characters.length);
            if (selectedPad) {
                htmlElements.push(this._createStyledElement(' '.repeat(selectedPad), this._getSelectionStyle()));
            }
        }
        return htmlElements;
    }

    /**
     * Creates a styled element
     * @param {string} text The text content
     * @param {object} style The style object
     * @returns {HTMLElement} The created element
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
     * @returns {object} The selection style
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
     * @param {string} format The format
     * @returns {object} The style from the format
     */
    _getStyleFromFormat(format = '') {
        const sgrState = TextFormat.parseSgr(format);
        return TextFormat.resolveSgrToStyle(sgrState, this._themeProvider.getTheme());
    }

    /**
     * Resets the cache
     * @returns {TextRenderer} The instance of the TextRenderer
     */
    resetCache() {
        this._rowContentCache = {};
        this._rowIndexCache = {};
        this._rowSelectionCache = {};
        this._renderScheduled = false;
        return this;
    }

    /**
     * Cancels a pending render and removes the row elements
     * @returns {TextRenderer} The instance of the TextRenderer
     */
    dispose() {
        if (this._renderFrameId !== null) {
            cancelAnimationFrame(this._renderFrameId);
            this._renderFrameId = null;
        }
        this._renderScheduled = false;
        this._renderPayload = {};
        for (const rowElement of this._rowElements) {
            rowElement.remove();
        }
        this._rowElements = [];
        this._container = null;
        return this;
    }
}

export default TextRenderer