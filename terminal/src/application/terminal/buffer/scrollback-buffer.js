import { TERMINAL_DEFAULT_SCROLLBACK_LIMIT } from '../config/config.js'

/**
 * ScrollbackBuffer class - frozen history rows that have left the active screen
 */
export class ScrollbackBuffer {
    /**
     * Creates a new ScrollbackBuffer instance
     * @param {number} limit The maximum number of rows to keep
     */
    constructor(limit = TERMINAL_DEFAULT_SCROLLBACK_LIMIT) {
        this._limit = limit;
        this._rows = [];
    }

    /**
     * Pushes a frozen row into scrollback
     * @param {BufferRow} row The row to store
     * @returns {ScrollbackBuffer} The instance of the ScrollbackBuffer
     */
    push(row) {
        if (!row) return this;
        this._rows.push(row);
        this._trim();
        return this;
    }

    /**
     * Returns the number of stored rows
     * @returns {number} The row count
     */
    getLength() {
        return this._rows.length;
    }

    /**
     * Returns the stored row at the given index
     * @param {number} index The row index
     * @returns {BufferRow|null} The row or null
     */
    getRow(index = 0) {
        if (index < 0 || index >= this._rows.length) return null;
        return this._rows[index];
    }

    /**
     * Returns the stored rows
     * @returns {BufferRow[]} The frozen rows
     */
    getRows() {
        return this._rows.slice();
    }

    /**
     * Sets the maximum number of rows to keep
     * @param {number} limit The maximum number of rows
     * @returns {ScrollbackBuffer} The instance of the ScrollbackBuffer
     */
    setLimit(limit = TERMINAL_DEFAULT_SCROLLBACK_LIMIT) {
        this._limit = Math.max(0, limit);
        this._trim();
        return this;
    }

    /**
     * Returns the maximum number of rows to keep
     * @returns {number} The limit
     */
    getLimit() {
        return this._limit;
    }

    /**
     * Trims stored rows down to the configured limit
     * @returns {ScrollbackBuffer} The instance of the ScrollbackBuffer
     */
    _trim() {
        const overflow = this._rows.length - this._limit;
        if (overflow > 0) {
            this._rows.splice(0, overflow);
        }
        return this;
    }

    /**
     * Clears all frozen rows
     * @returns {ScrollbackBuffer} The instance of the ScrollbackBuffer
     */
    clear() {
        this._rows.length = 0;
        return this;
    }
}

export default ScrollbackBuffer