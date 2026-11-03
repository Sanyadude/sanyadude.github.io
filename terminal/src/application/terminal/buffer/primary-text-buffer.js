import { TextBuffer } from './text-buffer.js'
import { ScrollbackBuffer } from './scrollback-buffer.js'
import { BufferRow } from './buffer-row.js'
import { LogicalLine } from './logical-line.js'

/**
 * PrimaryTextBuffer class - the screen grid and scrollback
 */
export class PrimaryTextBuffer extends TextBuffer {
    /**
     * Creates a new PrimaryTextBuffer instance
     * @param {LayoutProvider} layoutProvider The layout provider
     */
    constructor(layoutProvider) {
        super(layoutProvider);
        this._scrollbackBuffer = new ScrollbackBuffer();
        this._screenBuffer.onScrollbackAddRow((event) => {
            this._scrollbackBuffer.push(event.row);
        });
        this._screenBuffer.onScrollbackClear(() => {
            this._scrollbackBuffer.clear();
        });
    }

    /**
     * Writes text at the screen cursor, including CSI and SGR sequences.
     * The cursor ends up right after the last written character.
     * Lines that leave the top are stored in scrollback
     * @param {string} text The text to write
     * @returns {PrimaryTextBuffer} The instance of the PrimaryTextBuffer
     */
    write(text = '') {
        this._screenBuffer.write(text);
        this._emitBufferChange();
        return this;
    }

    /**
     * Recalculates the grid after a layout resize by reflowing wrapped rows.
     * The screen cursor stays on the same character.
     * @returns {PrimaryTextBuffer} The instance of the PrimaryTextBuffer
     */
    reflow() {
        const { rows, columns } = this._screenBuffer.getSize();
        if (!rows || !columns) return this;

        const source = [...this._scrollbackBuffer.getRows(), ...this._screenBuffer.getUsedRows()];
        const { lines, cursor } = this._toLogicalLines(source);
        const visualRows = lines.flatMap(line => line.toRows(columns));

        this._scrollbackBuffer.clear();

        const historyCount = Math.max(0, visualRows.length - rows);
        visualRows.slice(0, historyCount).forEach(row => this._scrollbackBuffer.push(row));

        this._screenBuffer.resize(rows, columns);
        visualRows.slice(historyCount).forEach((row, y) => {
            this._screenBuffer.setRow(y, row);
        });

        this._restoreCursor(cursor, lines, historyCount);
        this._emitBufferChange();
        return this;
    }

    /**
     * Gets the count of the scrollback rows
     * @returns {number} The count of the scrollback rows
     */
    getScrollbackRowCount() {
        return this.getRowCount();
    }

    /**
     * Gets the count of the rows
     * @returns {number} The count of the visual rows
     */
    getRowCount() {
        return this._scrollbackBuffer.getLength() + this._screenBuffer.getUsedRowCount();
    }

    /**
     * Gets the visual rows by document index, scrollback first. A requested count is padded with blank rows
     * @param {number} startIndex The document index of the first row
     * @param {number} count The count of the rows
     * @returns {BufferRow[]} The grid rows
     */
    getRows(startIndex = 0, count = null) {
        const rows = [];
        if (count !== null && count <= 0) return this._padVisibleRows(rows, count);
        const total = this.getRowCount();
        const maxIndex = count === null ? total : Math.min(total, startIndex + count);
        for (let index = startIndex; index < maxIndex; index++) {
            rows.push(this._getRowAt(index) || this._getBlankRow());
        }
        return this._padVisibleRows(rows, count);
    }

    /**
     * Returns the position of the screen cursor in the visual document
     * @returns {object} The position of the cursor
     */
    getCursorPosition() {
        const cursor = this._screenBuffer.getCursor();
        return {
            row: this._scrollbackBuffer.getLength() + cursor.y,
            column: cursor.x,
        };
    }

    /**
     * Clears the text buffer data
     * @returns {PrimaryTextBuffer} The instance of the PrimaryTextBuffer
     */
    clear() {
        this._scrollbackBuffer.clear();
        this._screenBuffer.clear();
        this._emitBufferChange();
        return this;
    }

    /**
     * Joins wrapped rows into logical lines and records the cursor cell.
     * The cursor is null when it sits past the used rows, on the blank line after the content.
     * @param {BufferRow[]} source Scrollback rows followed by used screen rows
     * @returns {{ lines: LogicalLine[], cursor: { line: number, cell: number }|null }} The logical lines and cursor
     */
    _toLogicalLines(source) {
        const usedCount = this._screenBuffer.getUsedRowCount();
        const { x, y } = this._screenBuffer.getCursor();
        const screenCursor = y < usedCount
            ? { row: source.length - usedCount + y, column: x }
            : null;
        const { lines, mark } = LogicalLine.fromRows(source, screenCursor);
        return { lines, cursor: mark };
    }

    /**
     * Moves the screen cursor back onto the same character after reflow.
     * A missing cursor is placed on the blank line after the content.
     * A cursor that landed in scrollback stays at the origin set by resize.
     * @param {{ line: number, cell: number }|null} cursor The cursor in logical coordinates
     * @param {LogicalLine[]} lines The logical lines
     * @param {number} historyCount The number of visual rows placed in scrollback
     * @returns {PrimaryTextBuffer} The instance of the PrimaryTextBuffer
     */
    _restoreCursor(cursor, lines, historyCount) {
        const { rows, columns } = this._screenBuffer.getSize();
        if (!cursor) {
            const used = LogicalLine.countRows(lines, columns) - historyCount;
            if (used >= rows) this._screenBuffer.scrollUp(1);
            this._screenBuffer.moveCursor(0, used);
            return this;
        }
        const { row, column } = lines[cursor.line].locate(cursor.cell, columns);
        const y = LogicalLine.countRows(lines.slice(0, cursor.line), columns) + row;
        if (y >= historyCount) {
            this._screenBuffer.moveCursor(column, y - historyCount);
        }
        return this;
    }

    /**
     * Returns a row at the given document index
     * @param {number} index The document index
     * @returns {BufferRow|null} The row or null
     */
    _getRowAt(index = 0) {
        if (index < 0 || index >= this.getRowCount()) return null;
        const scrollbackLength = this._scrollbackBuffer.getLength();
        if (index < scrollbackLength) {
            return this._scrollbackBuffer.getRow(index);
        }
        return this._screenBuffer.getUsedRow(index - scrollbackLength);
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

export default PrimaryTextBuffer