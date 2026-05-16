/**
 * WrappedTextLine class - represents a wrapped line in the text
 */
export class WrappedTextLine {
    /**
     * Creates a new WrappedTextLine instance
     * @param {string} text - The text of the line
     * @param {TextCharacter[]} characters - The characters of the line
     * @param {number} bufferIndex - The index of the buffer line
     * @param {number} bufferWrapIndex - The index of the wrapped line inside buffer line
     * @param {number} wrapIndex - The index of the wrap line
     */
    constructor(text, characters, bufferIndex, bufferWrapIndex, wrapIndex) {
        this.text = text;
        this.characters = characters;
        this.bufferIndex = bufferIndex;
        this.bufferWrapIndex = bufferWrapIndex;
        this.wrapIndex = wrapIndex;
    }

    /**
     * Creates a new blank line
     * @returns {WrappedTextLine} - The blank line
     */
    static getBlankLine() {
        return new WrappedTextLine('', [], -1, 0, -1);
    }
}

export default WrappedTextLine