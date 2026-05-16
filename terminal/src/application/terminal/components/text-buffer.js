import { LayoutProvider } from './layout-provider.js'
import { TextFormat } from './text-format.js'
import { BufferTextLine } from './buffer-text-line.js'
import { WrappedTextLine } from './wrapped-text-line.js'
import { InputBuffer } from './input-buffer.js'

/**
 * TextBuffer class - represents a buffer for the text
 */
export class TextBuffer {
    /**
     * Creates a new TextBuffer instance
     * @param {LayoutProvider} layoutProvider - The layout provider
     */
    constructor(layoutProvider) {
        this._layoutProvider = layoutProvider;
        this._inputBuffer = new InputBuffer();
        // Text lines
        this._bufferLines = [];
        this._inputLine = BufferTextLine.getBlankLine();
        this._wrappedToBufferLinesMap = [];
        this._wrappedLinesCache = {};
    }

    /**
     * Sets the prompt text
     * @param {string} text - The prompt text
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    setPromptText(text = '') {
        this._inputBuffer.setPromptText(text);
        this._inputLine = this._createInputBufferLine();
        return this;
    }

    /**
     * Sets the input text
     * @param {string} text - The input text
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    setInputText(text = '') {
        this._inputBuffer.setInputText(text);
        this._inputLine = this._createInputBufferLine();
        return this;
    }

    /**
     * Inserts text at the cursor position
     * @param {string} text - The text to insert
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    insertAtCursor(text = '') {
        this._inputBuffer.insertAtCursor(text);
        this._inputLine = this._createInputBufferLine();
        return this;
    }

    /**
     * Deletes the character at the cursor position in the given direction
     * @param {number} direction - The direction of deletion (-1 = left, 1 = right, 0 = ignore)
     * @param {number} length - The length of the deletion
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    deleteAtCursor(direction = 0, length = 1) {
        this._inputBuffer.deleteAtCursor(direction, length);
        this._inputLine = this._createInputBufferLine();
        return this;
    }

    /**
     * Deletes the character at the cursor position to the left (backspace)
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    deleteAtCursorLeft() {
        this.deleteAtCursor(-1);
        return this;
    }

    /**
     * Deletes the character at the cursor position to the right (delete)
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    deleteAtCursorRight() {
        this.deleteAtCursor(1);
        return this;
    }

    /**
     * Moves the cursor to the given index
     * @param {number} index - The index of the cursor
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorTo(index = 0) {
        this._inputBuffer.moveCursorTo(index);
        return this;
    }

    /**
     * Moves the cursor to the left
     * @param {number} columns - The number of columns to move the cursor left
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorLeft(columns = 1) {
        this._inputBuffer.moveCursorLeft(columns);
        return this;
    }

    /**
     * Moves the cursor to the right
     * @param {number} columns - The number of columns to move the cursor right
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorRight(columns = 1) {
        this._inputBuffer.moveCursorRight(columns);
        return this;
    }

    /**
     * Moves the cursor up (equals to moving left by viewport width)
     * @param {number} lines - The number of lines to move the cursor up
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorUp(lines = 1) {
        this._inputBuffer.moveCursorLeft(lines * this._layoutProvider.getLayout().columns);
        return this;
    }

    /**
     * Moves the cursor down (equals to moving right by viewport width)
     * @param {number} lines - The number of lines to move the cursor down
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorDown(lines = 1) {
        this._inputBuffer.moveCursorRight(lines * this._layoutProvider.getLayout().columns);
        return this;
    }

    /**
     * Moves the cursor to the start of the word to the left
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorToWordStartLeft() {
        this._inputBuffer.moveCursorByNavigationRule('word_start', false);
        return this;
    }

    /**
     * Moves the cursor to the start of the word to the right
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorToWordStartRight() {
        this._inputBuffer.moveCursorByNavigationRule('word_start', true);
        return this;
    }

    /**
     * Moves the cursor to the start of the input buffer
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorToStart() {
        this._inputBuffer.moveCursorTo(0);
        return this;
    }

    /**
     * Moves the cursor to the end of the input buffer
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    moveCursorToEnd() {
        this._inputBuffer.moveCursorTo(this._inputBuffer.getInputBufferText().length);
        return this;
    }

    /**
     * Removes a line from the buffer
     * @param {number} index - The index of the line to remove
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    removeLine(index = null) {
        if (index === null) {
            index = this._bufferLines.length - 1;
        }
        if (index < 0 || index >= this._bufferLines.length) return this;
        const bufferLine = this._bufferLines[index];
        this._bufferLines.splice(index, 1);
        this._wrappedToBufferLinesMap.splice(index, bufferLine.layoutHeight);
        this._wrappedLinesCache = {};
        return this;
    }

    /**
     * Adds a text to current buffer line
     * @param {string} text - The text to add to the buffer
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    addToLine(text = '') {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (i === 0 && this._bufferLines.length > 0) {
                const lastBufferLineIndex = this._bufferLines.length - 1;
                const currentBufferLine = this._bufferLines[lastBufferLineIndex];
                currentBufferLine.text += lines[i];
                const bufferLine = this._createBufferLine(currentBufferLine.text);
                this._bufferLines[lastBufferLineIndex] = bufferLine;
                for (let j = currentBufferLine.layoutHeight; j < bufferLine.layoutHeight; j++) {
                    this._wrappedToBufferLinesMap.push(lastBufferLineIndex);
                }
                continue;
            }
            const bufferLine = this._createBufferLine(lines[i]);
            this._bufferLines.push(bufferLine);
            for (let j = 0; j < bufferLine.layoutHeight; j++) {
                this._wrappedToBufferLinesMap.push(this._bufferLines.length - 1);
            }
        }
        this._wrappedLinesCache = {};
        return this;
    }

    /**
     * Adds a new line to the buffer
     * @param {string} text - The text to add to the buffer
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    addNewLine(text = '') {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const bufferLine = this._createBufferLine(lines[i]);
            this._bufferLines.push(bufferLine);
            for (let j = 0; j < bufferLine.layoutHeight; j++) {
                this._wrappedToBufferLinesMap.push(this._bufferLines.length - 1);
            }
        }
        this._wrappedLinesCache = {};
        return this;
    }

    /**
     * Creates a new buffer text line
     * @param {string} text - The text of the line
     * @returns {BufferTextLine} - The buffer text line
     */
    _createBufferLine(text = '') {
        const plainText = TextFormat.stripAnsiSgr(text);
        const characters = TextFormat.charsFromString(text);
        return new BufferTextLine(plainText, text, characters, this._calculateLayoutHeight(plainText));
    }

    /**
     * Creates a new input buffer line
     * @returns {BufferTextLine} - The buffer text line
     */
    _createInputBufferLine() {
        return this._createBufferLine(this._inputBuffer.getInputBufferTextRaw());
    }

    /**
     * Recalculates the height of the text in the layout
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    recalculateBufferLayout() {
        this._wrappedToBufferLinesMap.length = 0;
        this._bufferLines.forEach((line, index) => {
            const layoutHeight = this._calculateLayoutHeight(line.text);
            line.layoutHeight = layoutHeight;
            for (let j = 0; j < layoutHeight; j++) {
                this._wrappedToBufferLinesMap.push(index);
            }
        });
        this._inputLine.layoutHeight = this._calculateLayoutHeight(this._inputLine.text);
        return this;
    }

    /**
     * Calculates the height of the text in the layout
     * @param {string} text - The text to calculate the height of
     * @returns {number} - The height of the text in the layout
     */
    _calculateLayoutHeight(text = '') {
        const width = this._measureTextWidth(text);
        return Math.max(1, Math.ceil(width / this._layoutProvider.getLayout().columns));
    }

    /**
     * Measures the width of the text
     * @param {string} text - The text to measure the width of
     * @returns {number} - The width of the text
     */
    _measureTextWidth(text = '') {
        return text.length;
    }

    /**
     * Gets the count of the lines
     * @returns {number} - The count of the lines
     */
    getBufferLinesCount() {
        return this._bufferLines.length + 1;
    }

    /**
     * Gets the count of the wrapped lines
     * @returns {number} - The count of the wrapped lines
     */
    getWrappedLinesCount() {
        return this._wrappedToBufferLinesMap.length + this._inputLine.layoutHeight;
    }

    /**
     * Gets the lines from the buffer
     * @param {number} startIndex - The start index of the lines
     * @param {number} count - The count of the lines
     * @returns {BufferTextLine[]} - The lines from the buffer
     */
    getBufferLines(startIndex = 0, count = null) {
        const allLines = [...this._bufferLines, this._inputLine];
        if (startIndex <= 0 && count === null) return allLines;
        if (count === null) return allLines.slice(startIndex);
        return allLines.slice(startIndex, startIndex + count);
    }

    /**
     * Gets the wrapped lines by visual
     * @param {number} startIndex - The start index of the lines
     * @param {number} count - The count of the lines
     * @returns {WrappedTextLine[]} - The wrapped lines by visual
     */
    getWrappedLines(startIndex = 0, count = null) {
        const wrapped = [];
        if (count !== null && count <= 0) return this._getWrappedLinesWithDefaults(wrapped, startIndex, count);
        const columns = this._layoutProvider.getLayout().columns;
        const lines = this.getBufferLines();
        let wrappedIndex = 0;
        for (let bufferIndex = 0; bufferIndex < lines.length; bufferIndex++) {
            const line = lines[bufferIndex];
            let textWrapIndex = 0;
            for (let bufferWrapIndex = 0; bufferWrapIndex < line.layoutHeight; bufferWrapIndex++) {
                if (count !== null && wrapped.length >= count) return this._getWrappedLinesWithDefaults(wrapped, startIndex, count);
                if (wrappedIndex < startIndex) {
                    textWrapIndex += columns;
                    wrappedIndex++;
                    continue;
                }
                const sliceStart = textWrapIndex;
                const sliceEnd = textWrapIndex + columns;
                const wrappedText = line.text.slice(sliceStart, sliceEnd);
                let cachedWrappedLine = this._wrappedLinesCache[wrappedIndex];
                if (cachedWrappedLine && cachedWrappedLine.text === wrappedText) {
                    wrapped.push(cachedWrappedLine);
                    textWrapIndex += columns;
                    wrappedIndex++;
                    continue;
                }
                const wrappedCharacters = line.characters.slice(sliceStart, sliceEnd);
                cachedWrappedLine = new WrappedTextLine(wrappedText, wrappedCharacters, bufferIndex, bufferWrapIndex, wrappedIndex);
                this._wrappedLinesCache[wrappedIndex] = cachedWrappedLine;
                wrapped.push(cachedWrappedLine);
                textWrapIndex += columns;
                wrappedIndex++;
            }
        }
        return this._getWrappedLinesWithDefaults(wrapped, startIndex, count);
    }

    /**
     * Gets the wrapped lines with default lines
     * @param {number} startIndex - The start index of the lines
     * @param {number} count - The count of the lines
     * @returns {WrappedTextLine[]} - The wrapped lines with default lines
     */
    _getWrappedLinesWithDefaults(wrapped, startIndex = 0, count = null) {
        let wrappedIndex = startIndex + wrapped.length;
        for (let i = wrapped.length; i < count; i++) {
            wrapped.push(new WrappedTextLine('', [], -1, 0, wrappedIndex));
            wrappedIndex++;
        }
        return wrapped;
    }

    /**
     * Gets the text of the selection
     * @param {object[]} selectionRanges - The selection ranges
     * @returns {string} - The text of the selection
     */
    getSelectionText(selectionRanges) {
        const bufferLines = this.getBufferLines();
        const selectedLines = [];
        const columns = this._layoutProvider.getLayout().columns;
        let wrappedIndex = 0;
        for (let bufferIndex = 0; bufferIndex < bufferLines.length; bufferIndex++) {
            const bufferLine = bufferLines[bufferIndex];
            for (let bufferWrapIndex = 0; bufferWrapIndex < bufferLine.layoutHeight; bufferWrapIndex++) {
                const selectionRange = selectionRanges[wrappedIndex];
                wrappedIndex++;
                if (!selectionRange) continue;
                const sliceStart = bufferWrapIndex * columns + selectionRange.start;
                const sliceEnd = bufferWrapIndex * columns + selectionRange.end;
                selectedLines.push(bufferLine.text.slice(sliceStart, sliceEnd));
            }
        }
        return selectedLines.join('\n');
    }

    /**
     * Returns the prompt text
     * @returns {string} - The prompt text
     */
    getPromptText() {
        return this._inputBuffer.getPromptText();
    }

    /**
     * Returns the input text
     * @returns {string} - The input text
     */
    getInputText() {
        return this._inputBuffer.getInputText();
    }

    /**
     * Returns the index of the cursor
     * @returns {number} - The index of the cursor
     */
    getCursorIndex() {
        return this._inputBuffer.getCursorIndex();
    }

    /**
     * Returns the position of the input text start position
     * @returns {object} - The position of the wrapped lines input text start
     */
    getInputTextStartPosition() {
        return { line: this._wrappedToBufferLinesMap.length, column: this._inputBuffer.getInputStartIndex() };
    }

    /**
     * Returns the position of the cursor inside the viewport
     * @returns {object} - The position of the cursor
     */
    getCursorPosition() {
        const layout = this._layoutProvider.getLayout();
        const index = this._inputBuffer.getCursorAbsoluteIndex();
        const line = Math.floor(index / layout.columns);
        const column = index % layout.columns;
        return { line: this._wrappedToBufferLinesMap.length + line, column: column };
    }

    /**
     * Returns the input buffer
     * @returns {InputBuffer} - The input buffer
     */
    getInputBuffer() {
        return this._inputBuffer;
    }

    /**
     * Gets the text line
     * @param {string} text - The text of the line
     * @param {number} wrapIndex - The index of the wrap line
     * @returns {WrappedTextLine} - The text line
     */
    getTextLine(text, wrapIndex = 0) {
        const plainText = TextFormat.stripAnsiSgr(text);
        const characters = TextFormat.charsFromString(text);
        return new WrappedTextLine(plainText, characters, -1, 0, wrapIndex);
    }

    /**
     * Clears the text buffer data
     * @returns {TextBuffer} - The instance of the TextBuffer
     */
    clear() {
        this._bufferLines.length = 0;
        this._wrappedToBufferLinesMap.length = 0;
        this._wrappedLinesCache = {};
        this._inputBuffer.clear();
        this._inputLine = this._createInputBufferLine();
        return this;
    }
}

export default TextBuffer