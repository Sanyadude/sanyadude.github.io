import { BufferCell } from './buffer-cell.js'

/**
 * BufferRow class - a single row of character cells at the current column width
 */
export class BufferRow {
    /**
     * Creates a new BufferRow instance
     * @param {number} columns The number of columns in the row
     * @param {BufferCell[]|null} cells Optional existing cells
     * @param {boolean} wrapped True if the next row continues this logical line
     */
    constructor(columns = 0, cells = null, wrapped = false) {
        this.cells = cells
            ? cells.map(cell => cell.clone())
            : BufferRow.createBlankCells(columns);
        this.wrapped = wrapped;
        this.hash = null;
    }

    /**
     * True if the next row continues this logical line
     * @returns {boolean} The wrap flag
     */
    isWrapped() {
        return this.wrapped;
    }

    /**
     * Sets whether the next row continues this logical line
     * @param {boolean} wrapped The wrap flag
     * @returns {BufferRow} The instance of the BufferRow
     */
    setWrapped(wrapped = false) {
        this.wrapped = wrapped;
        this.hash = null;
        return this;
    }

    /**
     * Returns the number of columns in the row
     * @returns {number} The column count
     */
    getColumns() {
        return this.cells.length;
    }

    /**
     * Resizes the row to the given column count
     * @param {number} columns The new column count
     * @returns {BufferRow} The instance of the BufferRow
     */
    setColumns(columns = 0) {
        if (columns > this.cells.length) {
            while (this.cells.length < columns) {
                this.cells.push(BufferCell.blank());
            }
            this.hash = null;
            return this;
        }
        if (columns < this.cells.length) {
            this.cells.length = Math.max(0, columns);
            this.hash = null;
        }
        return this;
    }

    /**
     * Returns the cell at the given column
     * @param {number} column The column index
     * @returns {BufferCell|null} The cell or null
     */
    getCell(column = 0) {
        if (column < 0 || column >= this.cells.length) return null;
        return this.cells[column];
    }

    /**
     * Sets the cell at the given column
     * @param {number} column The column index
     * @param {BufferCell} cell The cell to set
     * @returns {BufferRow} The instance of the BufferRow
     */
    setCell(column, cell) {
        if (column < 0 || column >= this.cells.length) return this;
        this.cells[column] = cell;
        this.hash = null;
        return this;
    }

    /**
     * Checks if the row has no non-blank cells
     * @returns {boolean} True if the row is empty
     */
    isEmpty() {
        for (let i = 0; i < this.cells.length; i++) {
            if (!this.cells[i].isBlank()) return false;
        }
        return true;
    }

    /**
     * Returns the length of the content without trailing blank cells
     * @returns {number} The content length
     */
    getContentLength() {
        let end = this.cells.length;
        while (end > 0 && this.cells[end - 1].isBlank()) {
            end--;
        }
        return end;
    }

    /**
     * Returns the visible text of the row without trailing blanks
     * @returns {string} The row text
     */
    toText() {
        return this.toCharacters().map(cell => cell.text).join('');
    }

    /**
     * Returns the visible characters of the row without trailing blanks
     * @returns {BufferCell[]} The characters
     */
    toCharacters() {
        return this.cells.slice(0, this.getContentLength());
    }

    /**
     * Returns a content hash used by the renderer cache
     * @returns {number} The row hash
     */
    getHash() {
        if (this.hash !== null) return this.hash;
        let hash = this.wrapped ? 1 : 0;
        const length = this.getContentLength();
        for (let i = 0; i < length; i++) {
            const cell = this.cells[i];
            hash = ((hash << 5) - hash + (cell.text ? cell.text.charCodeAt(0) : 0)) | 0;
            const format = cell.format || '';
            for (let j = 0; j < format.length; j++) {
                hash = ((hash << 5) - hash + format.charCodeAt(j)) | 0;
            }
        }
        this.hash = hash;
        return hash;
    }

    /**
     * Creates a copy of the row
     * @returns {BufferRow} The cloned row
     */
    clone() {
        return new BufferRow(this.cells.length, this.cells, this.wrapped);
    }

    /**
     * Creates an array of blank cells
     * @param {number} columns The number of cells
     * @returns {BufferCell[]} The blank cells
     */
    static createBlankCells(columns = 0) {
        const cells = [];
        for (let i = 0; i < columns; i++) {
            cells.push(BufferCell.blank());
        }
        return cells;
    }

    /**
     * Creates a blank row
     * @param {number} columns The number of columns
     * @returns {BufferRow} The blank row
     */
    static blank(columns = 0) {
        return new BufferRow(columns);
    }
}

export default BufferRow