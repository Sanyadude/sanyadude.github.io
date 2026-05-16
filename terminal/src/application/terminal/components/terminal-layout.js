/**
 * TerminalLayout class - represents a layout for the terminal
 */
export class TerminalLayout {
    /**
     * Creates a new TerminalLayout instance
     * @param {number} lines - The number of lines
     * @param {number} columns - The number of columns
     * @param {object} charSize - The size of the character
     * @param {object} size - The size of the terminal
     * @param {object} offset - The offset of the terminal
     */
    constructor(lines, columns, charSize, size, offset) {
        this.lines = lines;
        this.columns = columns;
        this.charWidth = charSize.width;
        this.charHeight = charSize.height;
        this.width = size.width;
        this.height = size.height;
        this.offsetLeft = offset.left;
        this.offsetTop = offset.top;
        this.offsetRight = offset.right;
        this.offsetBottom = offset.bottom;
    }
}

export default TerminalLayout