import { BufferRow } from './buffer-row.js'

/**
 * LogicalLine class - the cells of one unwrapped line, independent of the column width
 */
export class LogicalLine {
    /**
     * Creates a new LogicalLine instance
     * @param {BufferCell[]} cells The cells of the line
     */
    constructor(cells = []) {
        this.cells = cells;
    }

    /**
     * Joins rows into logical lines. A wrapped row continues the current line and keeps all its
     * cells. An unwrapped row ends the line and keeps its content only, except for the blank
     * cells in front of the cursor, which are kept so the cursor stays on the line.
     * @param {BufferRow[]} rows The rows to join
     * @param {{ row: number, column: number }|null} cursor The cursor row (index in rows) and column
     * @returns {{ lines: LogicalLine[], mark: { line: number, cell: number }|null }} The lines and the cursor cell
     */
    static fromRows(rows, cursor = null) {
        const lines = [];
        let line = new LogicalLine();
        let mark = null;
        rows.forEach((row, index) => {
            let length = row.isWrapped() ? row.getColumns() : row.getContentLength();
            if (cursor && index === cursor.row) {
                const column = Math.min(Math.max(cursor.column, 0), row.getColumns());
                length = Math.max(length, column);
                mark = { line: lines.length, cell: line.getLength() + column };
            }
            line.append(row, length);
            if (!row.isWrapped()) {
                lines.push(line);
                line = new LogicalLine();
            }
        });
        if (line.getLength()) lines.push(line);
        return { lines, mark };
    }

    /**
     * Counts the visual rows of several lines
     * @param {LogicalLine[]} lines The logical lines
     * @param {number} columns The column width
     * @returns {number} The total visual row count
     */
    static countRows(lines, columns) {
        return lines.reduce((sum, line) => sum + line.getRowCount(columns), 0);
    }

    /**
     * Returns the number of cells in the line
     * @returns {number} The cell count
     */
    getLength() {
        return this.cells.length;
    }

    /**
     * Appends copies of the first cells of a row
     * @param {BufferRow} row The row to copy from
     * @param {number} length The number of cells to copy
     * @returns {LogicalLine} The instance of the LogicalLine
     */
    append(row, length) {
        this.cells.push(...row.cells.slice(0, length).map(cell => cell.clone()));
        return this;
    }

    /**
     * Returns how many visual rows the line occupies. An empty line occupies one row
     * @param {number} columns The column width
     * @returns {number} The visual row count
     */
    getRowCount(columns) {
        return Math.max(1, Math.ceil(this.cells.length / columns));
    }

    /**
     * Wraps the line into rows of the given width. Every row but the last is marked wrapped
     * @param {number} columns The column width
     * @returns {BufferRow[]} The visual rows
     */
    toRows(columns) {
        const count = this.getRowCount(columns);
        return Array.from({ length: count }, (_, part) => {
            const row = BufferRow.blank(columns);
            this.cells
                .slice(part * columns, (part + 1) * columns)
                .forEach((cell, x) => row.setCell(x, cell));
            return row.setWrapped(part < count - 1);
        });
    }

    /**
     * Finds where a cell lands once the line is wrapped. A cell just past the end of a full
     * row stays on that row, in the column after its last cell
     * @param {number} cell The cell index within the line
     * @param {number} columns The column width
     * @returns {{ row: number, column: number }} The row within the line and the column
     */
    locate(cell, columns) {
        const pastFullRow = cell > 0 && cell === this.cells.length && cell % columns === 0;
        if (pastFullRow) return { row: cell / columns - 1, column: columns };
        return { row: Math.floor(cell / columns), column: cell % columns };
    }
}

export default LogicalLine