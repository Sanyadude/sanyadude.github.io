/**
 * TextCharacter class - represents a text character
 */
export class TextCharacter {
    /**
     * Creates a new TextCharacter instance
     * @param {string} text - The text of the character
     * @param {string|null} format - The format of the character
     */
    constructor(text, format) {
        this.text = text;
        this.format = format;
    }
}

export default TextCharacter