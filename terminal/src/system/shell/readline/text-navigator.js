const WORD_START_REGEX = /(?<=^|[\s\-_/=.,:;!?()[\]{}])\S/g;
const WORD_END_REGEX = /\S(?=$|[\s\-_/=.,:;!?()[\]{}])/g;

/**
 * Moves a cursor by word boundaries inside a line of text
 */
export class TextNavigator {
    /**
     * Moves the cursor to the start of the word backward
     * @param {string} text The full string being navigated
     * @param {number} index Current cursor index
     * @returns {number} The new cursor position
     */
    static moveCursorToWordStartBackward(text, index) {
        const matches = [...text.slice(0, index).matchAll(WORD_START_REGEX)];
        if (matches.length === 0) return 0;
        return matches[matches.length - 1].index;
    }

    /**
     * Moves the cursor to the start of the word forward
     * @param {string} text The full string being navigated
     * @param {number} index Current cursor index
     * @returns {number} The new cursor position
     */
    static moveCursorToWordStartForward(text, index) {
        const matches = [...text.slice(index).matchAll(WORD_START_REGEX)];
        for (let i = 0; i < matches.length; i++) {
            const matchIndex = matches[i].index;
            if (matchIndex > 0) return index + matchIndex;
        }
        return text.length;
    }

    /**
     * Moves the cursor to the end of the word backward
     * @param {string} text The full string being navigated
     * @param {number} index Current cursor index
     * @returns {number} The new cursor position
     */
    static moveCursorToWordEndBackward(text, index) {
        const matches = [...text.slice(0, index).matchAll(WORD_END_REGEX)];
        for (let i = matches.length - 1; i >= 0; i--) {
            const matchIndex = matches[i].index;
            if (matchIndex + 1 < index) return matchIndex + 1;
        }
        return 0;
    }

    /**
     * Moves the cursor to the end of the word forward
     * @param {string} text The full string being navigated
     * @param {number} index Current cursor index
     * @returns {number} The new cursor position
     */
    static moveCursorToWordEndForward(text, index) {
        const matches = [...text.slice(index).matchAll(WORD_END_REGEX)];
        if (matches.length === 0) return text.length;
        return index + matches[0].index + 1;
    }
}

export default TextNavigator