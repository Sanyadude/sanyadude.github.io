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
        this.hash = this._hash();
    }

    /**
     * Hashes the text of the line
     * @returns {number} - The text hash
     */
    _hashText() {
        let hash = 0;
        for (let i = 0; i < this.characters.length; i++) {
            const text = this.characters[i].text;
            for (let j = 0; j < text.length; j++) {
                hash = ((hash << 5) - hash) + text.charCodeAt(j);
                hash |= 0;
            }
        }
        return hash >>> 0;
    }

    /**
     * Hashes the styles/formats of the line
     * @returns {number} - The style hash
     */
    _hashStyles() {
        let hash = 0;
        for (const character of this.characters) {
            const format = character.format;
            if (format === null) {
                hash = ((hash << 5) - hash);
                hash |= 0;
                continue;
            }
            for (let i = 0; i < format.length; i++) {
                hash = ((hash << 5) - hash) + format.charCodeAt(i);
                hash |= 0;
            }
            hash = ((hash << 5) - hash) + 0;
            hash |= 0;
        }
        return hash >>> 0;
    }

    /**
     * Returns a combined hash of text and styles
     * @returns {number} - The combined hash
     */
    _hash() {
        let hash = this._hashText();
        hash = ((hash << 5) - hash) + this._hashStyles();
        hash |= 0;
        return hash >>> 0;
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