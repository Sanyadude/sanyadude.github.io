import { TextBuffer } from './text-buffer.js'
import { BufferRow } from './buffer-row.js'

/**
 * AlternateTextBuffer class - an addressable screen with no scrollback
 */
export class AlternateTextBuffer extends TextBuffer {
    /**
     * Creates a new AlternateTextBuffer instance
     * @param {LayoutProvider} layoutProvider The layout provider
     */
    constructor(layoutProvider) {
        super(layoutProvider);
    }

    /**
     * Writes text at the screen cursor, including CSI and SGR sequences.
     * Lines that leave the screen are discarded
     * @param {string} text The text to write
     * @returns {AlternateTextBuffer} The instance of the AlternateTextBuffer
     */
    write(text = '') {
        this._screenBuffer.write(text);
        this._emitBufferChange();
        return this;
    }

    /**
     * Resizes the grid to the current layout. Cells that fit stay in place.
     * Extra cells and rows are dropped. Missing cells and rows are blank
     * @returns {AlternateTextBuffer} The instance of the AlternateTextBuffer
     */
    reflow() {
        const { rows, columns } = this._screenBuffer.getSize();
        if (!rows || !columns) return this;
        const current = this._screenBuffer.getRows();
        const { x, y } = this._screenBuffer.getCursor();
        const fitted = [];
        for (let index = 0; index < rows; index++) {
            const row = current[index] ? current[index] : BufferRow.blank(columns);
            row.setColumns(columns);
            fitted.push(row);
        }
        this._screenBuffer.resize(rows, columns);
        fitted.forEach((row, index) => this._screenBuffer.setRow(index, row));
        this._screenBuffer.moveCursor(x, y);
        this._emitBufferChange();
        return this;
    }

    /**
     * Gets the count of the screen rows
     * @returns {number} The screen row count
     */
    getRowCount() {
        return this._screenBuffer.getSize().rows;
    }

    /**
     * Gets screen rows by index. A requested count is padded with blank rows
     * @param {number} startIndex The index of the first row
     * @param {number} count The count of the rows
     * @returns {BufferRow[]} The screen rows
     */
    getRows(startIndex = 0, count = null) {
        const rows = [];
        if (count !== null && count <= 0) return this._padVisibleRows(rows, count);
        const total = this.getRowCount();
        const maxIndex = count === null ? total : Math.min(total, startIndex + count);
        for (let index = startIndex; index < maxIndex; index++) {
            rows.push(this._screenBuffer.getRow(index) || this._getBlankRow());
        }
        return this._padVisibleRows(rows, count);
    }

    /**
     * Returns the screen cursor
     * @returns {object} The position of the cursor
     */
    getCursorPosition() {
        const cursor = this._screenBuffer.getCursor();
        return { row: cursor.y, column: cursor.x };
    }

    /**
     * Clears the text buffer data
     * @returns {AlternateTextBuffer} The instance of the AlternateTextBuffer
     */
    clear() {
        this._screenBuffer.clear();
        this._emitBufferChange();
        return this;
    }

    /**
     * Pads the visible rows to the requested count
     * @param {BufferRow[]} rows The visible rows
     * @param {number|null} count The requested count
     * @returns {BufferRow[]} The padded rows
     */
    _padVisibleRows(rows, count = null) {
        if (count === null) return rows;
        while (rows.length < count) {
            rows.push(this._getBlankRow());
        }
        return rows;
    }

    /**
     * Returns a blank row used to fill unused viewport slots
     * @returns {BufferRow} The blank row
     */
    _getBlankRow() {
        return BufferRow.blank(this._screenBuffer.getSize().columns);
    }
}

export default AlternateTextBuffer