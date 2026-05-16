/**
 * BufferTextLine class - represents a line in the buffer
 */
export class BufferTextLine {
    /**
     * Creates a new BufferTextLine instance
     * @param {string} text - The text of the line
     * @param {string} rawText - The raw text of the line
     * @param {TextCharacter[]} characters - The characters of the line
     * @param {number} layoutHeight - The layout height of the line
     */
    constructor(text, rawText, characters, layoutHeight) {
        this.text = text;
        this.rawText = rawText;
        this.characters = characters;
        this.layoutHeight = layoutHeight;
        this.timestamp = new Date().getTime();
    }

    /**
     * Creates a new blank line
     * @returns {BufferTextLine} - The blank line
     */
    static getBlankLine() {
        return new BufferTextLine('', '', [], 0);
    }
}

export default BufferTextLine