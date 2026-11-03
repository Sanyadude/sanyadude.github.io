/**
 * BufferPosition class - a cell in the terminal document
 */
export class BufferPosition {
    /**
     * Creates a new BufferPosition instance
     * @param {number} row The document row
     * @param {number} column The document column
     */
    constructor(row = 0, column = 0) {
        this.row = row;
        this.column = column;
    }

    /**
     * Checks whether this position is the same cell
     * @param {BufferPosition|object|null} position The position to compare
     * @returns {boolean} True when the row and column match
     */
    equals(position) {
        if (!position) return false;
        return this.row === position.row && this.column === position.column;
    }
}

export default BufferPosition