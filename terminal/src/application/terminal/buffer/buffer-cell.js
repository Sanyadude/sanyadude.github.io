/**
 * BufferCell class - a single character cell in the terminal grid
 */
export class BufferCell {
    /**
     * Creates a new BufferCell instance
     * @param {string} text The character displayed in the cell
     * @param {string|null} format The SGR format of the cell
     * @param {number} width The column width of the cell (1 for most characters)
     */
    constructor(text = ' ', format = null, width = 1) {
        this.text = text;
        this.format = format;
        this.width = width;
    }

    /**
     * Checks if the cell is a blank default cell
     * @returns {boolean} True if the cell is blank
     */
    isBlank() {
        return this.text === ' ' && this.format === null;
    }

    /**
     * True when this cell is the unused half of a wide glyph
     * @returns {boolean} True if the cell continues a wide glyph
     */
    isContinuation() {
        return this.width === 0;
    }

    /**
     * Creates a copy of the cell
     * @returns {BufferCell} The cloned cell
     */
    clone() {
        return new BufferCell(this.text, this.format, this.width);
    }

    /**
     * Creates a blank default cell
     * @returns {BufferCell} The blank cell
     */
    static blank() {
        return new BufferCell(' ', null, 1);
    }

    /**
     * Creates the trailing cell of a wide glyph
     * @returns {BufferCell} The continuation cell
     */
    static continuation() {
        return new BufferCell('', null, 0);
    }
}

export default BufferCell