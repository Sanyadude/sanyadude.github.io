/**
 * Returns the visible cell count of a prompt, ignoring CSI sequences
 * @param {string} text The prompt text
 * @returns {number} The visible length
 */
function visibleLength(text = '') {
    return text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').length;
}

/**
 * ReadPrompt - the prompt string for one application line read
 * Holds the visible width of the text written before the read
 */
export class ReadPrompt {
    /**
     * Creates a new ReadPrompt instance
     */
    constructor() {
        this._text = '';
        this._length = 0;
    }

    /**
     * Sets the prompt text and stores its visible width
     * @param {string} text The prompt text
     * @returns {ReadPrompt} The instance of the ReadPrompt
     */
    setText(text = '') {
        this._text = text || '';
        this._length = visibleLength(this._text);
        return this;
    }

    /**
     * Returns the prompt text
     * @returns {string} The prompt text
     */
    getText() {
        return this._text;
    }

    /**
     * Returns the visible length of the prompt
     * @returns {number} The prompt length in cells
     */
    getLength() {
        return this._length;
    }
}

export default ReadPrompt