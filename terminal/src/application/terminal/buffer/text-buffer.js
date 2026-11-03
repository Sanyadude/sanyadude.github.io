import { ScreenBuffer } from './screen-buffer.js'

/**
 * TextBuffer class - the screen the terminal reads and writes
 */
export class TextBuffer {
    /**
     * Creates a new TextBuffer instance
     * @param {LayoutProvider} layoutProvider The layout provider
     */
    constructor(layoutProvider) {
        this._screenBuffer = new ScreenBuffer(layoutProvider);
        this._bufferChangeListeners = new Set();
    }

    /**
     * Adds a listener for buffer change
     * @param {Function} listener The listener to add
     * @returns {Function} A function to remove the listener
     */
    onBufferChange(listener) {
        this._bufferChangeListeners.add(listener);
        return () => this._bufferChangeListeners.delete(listener);
    }

    /**
     * Emits a buffer change event
     */
    _emitBufferChange() {
        this._bufferChangeListeners.forEach(listener => listener());
    }

    /**
     * Returns the screen buffer
     * @returns {ScreenBuffer} The screen buffer
     */
    getScreenBuffer() {
        return this._screenBuffer;
    }

    /**
     * Writes text at the screen cursor
     * @param {string} text The text to write
     * @returns {TextBuffer} The instance of the TextBuffer
     */
    write(text = '') {
        return this;
    }

    /**
     * Drops an unfinished escape sequence and clears the SGR format
     * @returns {TextBuffer} The instance of the TextBuffer
     */
    resetFormat() {
        this._screenBuffer.resetFormat();
        return this;
    }

    /**
     * Recalculates the grid after a layout resize
     * @returns {TextBuffer} The instance of the TextBuffer
     */
    reflow() {
        return this;
    }

    /**
     * Gets the count of the scrollback rows
     * @returns {number} The count of the scrollback rows
     */
    getScrollbackRowCount() {
        return 0;
    }

    /**
     * Gets the count of the rows
     * @returns {number} The count of the visual rows
     */
    getRowCount() {
        return 0;
    }

    /**
     * Gets the visual rows by document index. A requested count is padded with blank rows
     * @param {number} startIndex The document index of the first row
     * @param {number} count The count of the rows
     * @returns {BufferRow[]} The grid rows
     */
    getRows(startIndex = 0, count = null) {
        return [];
    }

    /**
     * Returns the position of the screen cursor in the visual document
     * @returns {object} The position of the cursor
     */
    getCursorPosition() {
        return { row: 0, column: 0 };
    }

    /**
     * Clears the buffer
     * @returns {TextBuffer} The instance of the TextBuffer
     */
    clear() {
        return this;
    }

    /**
     * Gets the text of the selection. Wrapped rows stay on one line unless the selection is rectangular
     * @param {object[]} selectionRanges The selection ranges
     * @param {boolean} block True when the selection is rectangular
     * @returns {string} The text of the selection
     */
    getSelectionText(selectionRanges, block = false) {
        const rows = this.getRows();
        let text = '';
        let hasPiece = false;
        let previousWrapped = false;
        for (let i = 0; i < selectionRanges.length; i++) {
            const selectionRange = selectionRanges[i];
            if (!selectionRange) {
                previousWrapped = false;
                continue;
            }
            const row = rows[i];
            const piece = (row ? row.toText() : '').slice(selectionRange.start, selectionRange.end);
            if (hasPiece && (block || !previousWrapped)) text += '\n';
            text += piece;
            hasPiece = true;
            previousWrapped = !block && row ? row.isWrapped() : false;
        }
        return text;
    }
}

export default TextBuffer