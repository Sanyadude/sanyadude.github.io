import { TextFormat } from './text-format.js'
import { TextNavigator } from './text-navigator.js'

/**
 * InputBuffer class - represents a buffer for the input
 */
export class InputBuffer {
    /**
     * Creates a new InputBuffer instance
     */
    constructor() {
        this._promptTextRaw = '';
        this._promptText = '';
        this._inputTextRaw = '';
        this._inputText = '';
        this._cursorIndex = 0;
    }

    /**
     * Sets the prompt text
     * @param {string} text - The prompt text
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    setPromptText(text = '') {
        this._promptTextRaw = text;
        this._promptText = TextFormat.stripAnsiSgr(text);
        return this;
    }

    /**
     * Sets the input text
     * @param {string} text - The input text
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    setInputText(text = '') {
        this._inputTextRaw = text;
        this._inputText = TextFormat.stripAnsiSgr(text);
        return this;
    }

    /**
     * Returns the raw input buffer text
     * @returns {string} - The input text
     */
    getInputBufferTextRaw() {
        return this._promptTextRaw + this._inputTextRaw;
    }

    /**
     * Returns the input buffer text
     * @returns {string} - The input text
     */
    getInputBufferText() {
        return this._promptText + this._inputText;
    }

    /**
     * Returns the raw prompt text
     * @returns {string} - The input text
     */
    getPromptTextRaw() {
        return this._promptTextRaw;
    }

    /**
     * Returns the prompt text
     * @returns {string} - The input text
     */
    getPromptText() {
        return this._promptText;
    }

    /**
     * Returns the raw input text
     * @returns {string} - The input text
     */
    getInputTextRaw() {
        return this._inputTextRaw;
    }

    /**
     * Returns the input text
     * @returns {string} - The input text
     */
    getInputText() {
        return this._inputText;
    }

    /**
     * Returns the index of the input text start
     * @returns {number} - The index of the input text start
     */
    getInputStartIndex() {
        return this._promptText.length;
    }

    /**
     * Returns the index of the cursor
     * @returns {number} - The index of the cursor
     */
    getCursorIndex() {
        return this._cursorIndex;
    }

    /**
     * Returns the absolute index of the cursor
     * @returns {number} - The absolute index of the cursor
     */
    getCursorAbsoluteIndex() {
        return this._promptText.length + this._cursorIndex;
    }

    /**
     * Inserts text at the cursor position
     * @param {string} text - The text to insert
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    insertAtCursor(text = '') {
        const newText = this._inputText.slice(0, this._cursorIndex) + text + this._inputText.slice(this._cursorIndex);
        this.setInputText(newText);
        return this;
    }

    /**
     * Deletes the character at the cursor position in the given direction
     * @param {number} direction - The direction of deletion (-1 = left, 1 = right, 0 = ignore)
     * @param {number} length - The length of the deletion
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    deleteAtCursor(direction = 0, length = 1) {
        if (direction === 0) return this;
        if (direction === -1 && this._cursorIndex === 0) return this;
        const index = direction === 1 ? this._cursorIndex : this._cursorIndex - length;
        const newIndex = this._getClampedCursorIndex(index);
        const newText = this._inputText.slice(0, newIndex) + this._inputText.slice(newIndex + length);
        this.setInputText(newText);
        return this;
    }

    /**
     * Moves the cursor to the given index
     * @param {number} index - The index of the cursor
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    moveCursorTo(index = 0) {
        this._cursorIndex = this._getClampedCursorIndex(index);
        return this;
    }

    /**
     * Moves the cursor to the left
     * @param {number} columns - The number of columns to move the cursor left
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    moveCursorLeft(columns = 1) {
        this.moveCursorTo(this._cursorIndex - columns);
        return this;
    }

    /**
     * Moves the cursor to the right
     * @param {number} columns - The number of columns to move the cursor right
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    moveCursorRight(columns = 1) {
        this.moveCursorTo(this._cursorIndex + columns);
        return this;
    }

    /**
     * Moves the cursor using the given navigation rules
     * @param {string} rule - The navigation rule ('word_start' or 'word_end')
     * @param {boolean} forward - True if moving forward, false if moving backward
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    moveCursorByNavigationRule(rule = 'word_start', forward = true) {
        const index = TextNavigator.moveCursor(this._inputText, this._cursorIndex, rule, forward);
        this.moveCursorTo(index);
        return this;
    }

    /**
     * Returns the clamped cursor index based on the input text length
     * @param {number} index - The index of the position
     * @returns {number} - The clamped cursor index
     */
    _getClampedCursorIndex(index = 0) {
        return Math.max(0, Math.min(index, this._inputText.length));
    }

    /**
     * Clears the input buffer
     * @returns {InputBuffer} - The instance of the InputBuffer
     */
    clear() {
        this._promptText = '';
        this._inputText = '';
        this._cursorIndex = 0;
        return this;
    }
}

export default InputBuffer