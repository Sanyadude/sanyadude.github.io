import { TextNavigator } from './text-navigator.js'

/**
 * InputBuffer - tracks the current input text and cursor
 */
export class InputBuffer {
    /**
     * Creates a new InputBuffer instance
     */
    constructor() {
        this._text = '';
        this._cursorIndex = 0;
    }

    /**
     * Sets the input text and keeps the cursor inside the new text
     * @param {string} text The input text
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    setText(text = '') {
        this._text = text || '';
        this._cursorIndex = this._getClampedCursorIndex(this._cursorIndex);
        return this;
    }

    /**
     * Returns the input text
     * @returns {string} The input text
     */
    getText() {
        return this._text;
    }

    /**
     * Returns the length of the input text
     * @returns {number} The length of the input text
     */
    getLength() {
        return this._text.length;
    }

    /**
     * Returns the index of the cursor inside the input text
     * @returns {number} The index of the cursor
     */
    getCursorIndex() {
        return this._cursorIndex;
    }

    /**
     * Inserts text at the cursor position
     * @param {string} text The text to insert
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    insertAtCursor(text = '') {
        if (!text) return this;
        const tail = this._text.slice(this._cursorIndex);
        this._text = this._text.slice(0, this._cursorIndex) + text + tail;
        this._cursorIndex += text.length;
        return this;
    }

    /**
     * Deletes text at the cursor position in the given direction
     * @param {number} direction The direction of deletion (-1 = backward, 1 = forward, 0 = ignore)
     * @param {number} length The length of the deletion
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    deleteAtCursor(direction = 0, length = 1) {
        if (direction === 0 || length <= 0) return this;
        if (direction === -1) {
            if (this._cursorIndex === 0) return this;
            const start = Math.max(0, this._cursorIndex - length);
            const tail = this._text.slice(this._cursorIndex);
            this._text = this._text.slice(0, start) + tail;
            this._cursorIndex = start;
            return this;
        }
        const removed = Math.min(length, this._text.length - this._cursorIndex);
        if (removed <= 0) return this;
        const tail = this._text.slice(this._cursorIndex + removed);
        this._text = this._text.slice(0, this._cursorIndex) + tail;
        return this;
    }

    /**
     * Deletes the character backward from the cursor
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    deleteAtCursorBackward() {
        return this.deleteAtCursor(-1);
    }

    /**
     * Deletes backward from the cursor to the word boundary used by word navigation
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    deleteWordBackward() {
        const nextCursor = TextNavigator.moveCursorToWordStartBackward(this._text, this._cursorIndex);
        return this.deleteAtCursor(-1, this._cursorIndex - nextCursor);
    }

    /**
     * Deletes the character forward from the cursor
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    deleteAtCursorForward() {
        return this.deleteAtCursor(1);
    }

    /**
     * Moves the cursor to the given index
     * @param {number} index The index of the cursor
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorTo(index = 0) {
        this._cursorIndex = this._getClampedCursorIndex(index);
        return this;
    }

    /**
     * Moves the cursor backward
     * @param {number} columns The number of characters to move the cursor backward
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorBackward(columns = 1) {
        return this.moveCursorTo(this._cursorIndex - columns);
    }

    /**
     * Moves the cursor forward
     * @param {number} columns The number of characters to move the cursor forward
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorForward(columns = 1) {
        return this.moveCursorTo(this._cursorIndex + columns);
    }

    /**
     * Moves the cursor to the start of the input
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorToStart() {
        return this.moveCursorTo(0);
    }

    /**
     * Moves the cursor to the end of the input
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorToEnd() {
        return this.moveCursorTo(this._text.length);
    }

    /**
     * Moves the cursor to the start of the word backward
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorToWordStartBackward() {
        const index = TextNavigator.moveCursorToWordStartBackward(this._text, this._cursorIndex);
        return this.moveCursorTo(index);
    }

    /**
     * Moves the cursor to the start of the word forward
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    moveCursorToWordStartForward() {
        const index = TextNavigator.moveCursorToWordStartForward(this._text, this._cursorIndex);
        return this.moveCursorTo(index);
    }

    /**
     * Drops the line. The screen is left unchanged.
     * @returns {InputBuffer} The instance of the InputBuffer
     */
    discard() {
        this._text = '';
        this._cursorIndex = 0;
        return this;
    }

    /**
     * Returns the clamped cursor index based on the input length
     * @param {number} index The index of the position
     * @returns {number} The clamped cursor index
     */
    _getClampedCursorIndex(index = 0) {
        return Math.max(0, Math.min(index, this._text.length));
    }
}

export default InputBuffer