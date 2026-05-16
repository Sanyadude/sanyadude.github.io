import { LayoutProvider } from './layout-provider.js'

/**
 * CursorRenderer class - represents a cursor renderer for the terminal
 */
export class CursorRenderer {
    /**
     * Creates a new CursorRenderer instance
     * @param {HTMLElement} container - The container element for the cursor renderer
     * @param {LayoutProvider} layoutProvider - The layout provider
     */
    constructor(container, layoutProvider) {
        this._container = container;
        this._layoutProvider = layoutProvider;
        this._cursorPosition = { line: 0, column: 0 };
        this._cursorElement = null;
        this._cursorStyle = 'underline';

        this._init();
    }

    /**
     * Initializes the cursor renderer
     */
    _init() {
        if (this._cursorElement) return;
        this._cursorElement = document.createElement('div');
        this._cursorElement.style.display = 'none';
        this._cursorElement.style.position = 'absolute';
        this._cursorElement.style.zIndex = '1';
        if (this._cursorStyle === 'underline') {
            this.setCursorStyleUnderline();
        }
        if (this._cursorStyle === 'caret') {
            this.setCursorStyleCaret();
        }
        this._container.appendChild(this._cursorElement);
    }

    /**
     * Applies the theme for the cursor renderer
     * @param {object} theme - The theme
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    applyTheme(theme) {
        if (theme.cursorColor) {
            this._cursorElement.style.backgroundColor = theme.cursorColor;
        }
        return this;
    }

    /**
     * Sets the style of the cursor to underline
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    setCursorStyleUnderline() {
        const layout = this._layoutProvider.getLayout();
        const width = Math.floor(layout.charWidth);
        const height = Math.ceil(layout.charHeight / 1.2) / 4;
        this._cursorElement.style.width = `${width}px`;
        this._cursorElement.style.height = `${height}px`;
        this._cursorStyle = 'underline';
        this.renderCursor(this._cursorPosition.line, this._cursorPosition.column);
        return this;
    }

    /**
     * Sets the style of the cursor to caret
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    setCursorStyleCaret() {
        const width = 2;
        const height = Math.ceil(this._layoutProvider.getLayout().charHeight);
        this._cursorElement.style.width = `${width}px`;
        this._cursorElement.style.height = `${height}px`;
        this._cursorStyle = 'caret';
        this.renderCursor(this._cursorPosition.line, this._cursorPosition.column);
        return this;
    }

    /**
     * Shows the cursor
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    show() {
        this._cursorElement.style.display = 'inline-block';
        return this;
    }

    /**
     * Hides the cursor
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    hide() {
        this._cursorElement.style.display = 'none';
        return this;
    }

    /**
     * Stops the animation of the cursor
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    stopAnimation() {
        if (!this._cursorElement) return this;
        this._cursorElement.style.animation = 'none';
        window.getComputedStyle(this._cursorElement).animationName;
        return this;
    }

    /**
     * Starts the animation of the cursor
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    startAnimation() {
        if (!this._cursorElement) return this;
        this._cursorElement.style.animation = 'text-format-blink 1s step-end infinite';
        return this;
    }

    /**
     * Resets the animation of the cursor
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    resetAnimation() {
        this.stopAnimation();
        this.startAnimation();
        return this;
    }

    /**
     * Renders the cursor at the given position
     * @param {number} line - The line of the cursor
     * @param {number} column - The column of the cursor
     * @returns {CursorRenderer} - The instance of the CursorRenderer
     */
    renderCursor(line = 0, column = 0) {
        if (!this._container) return this;
        this._cursorPosition.line = line;
        this._cursorPosition.column = column;
        const layout = this._layoutProvider.getLayout();
        let top = layout.offsetTop + (line * layout.charHeight);
        if (this._cursorStyle === 'underline') {
            top += layout.charHeight * 0.75;
        }
        let left = layout.offsetLeft + (column * layout.charWidth);
        this._cursorElement.style.top = `${top}px`;
        this._cursorElement.style.left = `${left}px`;
        return this;
    }

}

export default CursorRenderer