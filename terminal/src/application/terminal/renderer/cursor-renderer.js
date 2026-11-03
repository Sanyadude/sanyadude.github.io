import { LayoutProvider } from '../layout/layout-provider.js'
import { TERMINAL_DEFAULT_COLORS, TERMINAL_DEFAULT_CURSOR_STYLE } from '../config/config.js'

const CURSOR_STYLE_CARRET_WIDTH = 2;
const CURSOR_STYLE_UNDERLINE_HEIGHT_FACTOR = 1.2;
const CURSOR_STYLE_UNDERLINE_TOP_OFFSET_FACTOR = 0.75;

/**
 * CursorRenderer class - represents a cursor renderer for the terminal
 */
export class CursorRenderer {
    /**
     * Creates a new CursorRenderer instance
     * @param {HTMLElement} container The container element for the cursor renderer
     * @param {LayoutProvider} layoutProvider The layout provider
     */
    constructor(container, layoutProvider) {
        this._container = container;
        this._layoutProvider = layoutProvider;
        this._cursorPosition = { row: 0, column: 0 };
        this._cursorElement = null;
        this._cursorStyle = TERMINAL_DEFAULT_CURSOR_STYLE;
        this._animationFrameId = null;

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
        this._cursorElement.style.backgroundColor = TERMINAL_DEFAULT_COLORS.ACCENT;
        if (this._cursorStyle === 'underline') {
            this.setCursorStyleUnderline();
        }
        if (this._cursorStyle === 'caret') {
            this.setCursorStyleCaret();
        }
        if (this._cursorStyle === 'block') {
            this.setCursorStyleBlock();
        }
        this._container.appendChild(this._cursorElement);
    }

    /**
     * Applies the theme for the cursor renderer
     * @param {object} theme The theme
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    applyTheme(theme) {
        if (theme.cursorColor) {
            this._cursorElement.style.backgroundColor = theme.cursorColor;
        }
        return this;
    }

    /**
     * Sets the style of the cursor to underline
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    setCursorStyleUnderline() {
        const layout = this._layoutProvider.getLayout();
        const width = Math.floor(layout.charWidth);
        const height = Math.ceil(layout.charHeight / CURSOR_STYLE_UNDERLINE_HEIGHT_FACTOR) / 4;
        this._cursorElement.style.width = `${width}px`;
        this._cursorElement.style.height = `${height}px`;
        this._cursorStyle = 'underline';
        this.renderCursor(this._cursorPosition.row, this._cursorPosition.column);
        return this;
    }

    /**
     * Sets the style of the cursor to a solid character cell
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    setCursorStyleBlock() {
        const layout = this._layoutProvider.getLayout();
        const width = Math.ceil(layout.charWidth);
        const height = Math.ceil(layout.charHeight);
        this._cursorElement.style.width = `${width}px`;
        this._cursorElement.style.height = `${height}px`;
        this._cursorElement.style.mixBlendMode = 'difference';
        this._cursorStyle = 'block';
        this.renderCursor(this._cursorPosition.row, this._cursorPosition.column);
        return this;
    }

    /**
     * Sets the style of the cursor to caret
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    setCursorStyleCaret() {
        const height = Math.ceil(this._layoutProvider.getLayout().charHeight);
        this._cursorElement.style.width = `${CURSOR_STYLE_CARRET_WIDTH}px`;
        this._cursorElement.style.height = `${height}px`;
        this._cursorStyle = 'caret';
        this.renderCursor(this._cursorPosition.row, this._cursorPosition.column);
        return this;
    }

    /**
     * Shows the cursor
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    show() {
        this._cursorElement.style.display = 'inline-block';
        return this;
    }

    /**
     * Hides the cursor
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    hide() {
        this._cursorElement.style.display = 'none';
        return this;
    }

    /**
     * Stops the animation of the cursor
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    stopAnimation() {
        if (!this._cursorElement) return this;
        this._cursorElement.style.animation = 'none';
        return this;
    }

    /**
     * Starts the animation of the cursor
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    startAnimation() {
        if (!this._cursorElement) return this;
        this._cursorElement.style.animation = 'text-format-blink 1s step-end infinite';
        return this;
    }

    /**
     * Resets the animation of the cursor
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    resetAnimation() {
        this.stopAnimation();
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
        }
        this._animationFrameId = requestAnimationFrame(() => {
            this._animationFrameId = null;
            this.startAnimation();
        });
        return this;
    }

    /**
     * Cancels a pending cursor animation and removes the cursor element
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    dispose() {
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }
        this.stopAnimation();
        if (this._cursorElement) {
            this._cursorElement.remove();
            this._cursorElement = null;
        }
        this._container = null;
        return this;
    }

    /**
     * Renders the cursor at the given position
     * @param {number} row The row of the cursor
     * @param {number} column The column of the cursor
     * @returns {CursorRenderer} The instance of the CursorRenderer
     */
    renderCursor(row = 0, column = 0) {
        if (!this._container) return this;
        this._cursorPosition.row = row;
        this._cursorPosition.column = column;
        const layout = this._layoutProvider.getLayout();
        let top = layout.offsetTop + (row * layout.charHeight);
        if (this._cursorStyle === 'underline') {
            top += layout.charHeight * CURSOR_STYLE_UNDERLINE_TOP_OFFSET_FACTOR;
        }
        let left = layout.offsetLeft + (column * layout.charWidth);
        this._cursorElement.style.top = `${top}px`;
        this._cursorElement.style.left = `${left}px`;
        return this;
    }

}

export default CursorRenderer