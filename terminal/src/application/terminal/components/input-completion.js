/**
 * The InputCompletion class is used to complete the input based on provided options
 */
export class InputCompletion {
    /**
     * Constructs a new InputCompletion instance
     */
    constructor() {
        this._options = [];

        this._active = false;
        this._matches = [];
        this._matchIndex = 0;
        this._replaceIndex = 0;
    }

    /**
     * Sets the options for the input completion
     * @param {string[]} options - The options
     */
    setOptions(options) {
        this._options = options;
    }

    /**
     * Completes the input based on the provided options
     * @param {string} text - The text
     * @param {number} index - The cursor index
     * @param {boolean} reverse - Whether to cycle through matches in reverse
     * @returns {object} - The text and cursor index
     */
    complete(text, index, reverse = false) {
        if (this._active) {
            this._cycleMatchIndex(reverse);
            return this._replace(text, this._matches[this._matchIndex], this._replaceIndex, index);
        }
        const { token, tokenIndex } = this._extractLastToken(text, index);
        this._matches = this._options.filter(name => name.toLowerCase().startsWith(token.toLowerCase()));
        // No matches
        if (this._matches.length === 0) {
            return this._replace(text, '', index, index);
        }
        this._active = true;
        this._replaceIndex = tokenIndex;
        // Single match
        if (this._matches.length === 1) {
            return this._replace(text, this._matches[0], this._replaceIndex, index);
        }
        // Multiple matches - find the longest common prefix
        const longestCommonPrefix = this._longestCommonPrefix(this._matches);
        if (longestCommonPrefix.length > token.length) {
            return this._replace(text, longestCommonPrefix, this._replaceIndex, index);
        }
        return this._replace(text, this._matches[this._matchIndex], this._replaceIndex, index);
    }

    /**
     * Cycles the match index
     * @param {boolean} reverse - Whether to cycle in reverse
     */
    _cycleMatchIndex(reverse) {
        const delta = reverse ? -1 : 1;
        this._matchIndex = (this._matchIndex + delta + this._matches.length) % this._matches.length;
    }

    /**
     * Replaces the text at cursor position and updates cursor index
     * @param {string} text - The text to replace
     * @param {string} replacement - The replacement text
     * @param {number} replaceFrom - The index of the replacement from
     * @param {number} replaceTo - The index of the replacement to
     * @returns {object} - The text and new cursor index
     */
    _replace(text, replacement, replaceFrom, replaceTo) {
        const newText = text.slice(0, replaceFrom) + replacement + text.slice(replaceTo);
        return { text: newText, index: replaceFrom + replacement.length };
    }

    /**
     * Extracts the last (trailing) token from the given text
     * @param {string} text - The text
     * @returns {object} - The token and start index
     */
    _extractLastToken(text, index) {
        const beforeText = text.slice(0, index);
        const match = beforeText.match(/(?:^|\s)(?:"[^"]*"?|[^\s]*)$/);
        const token = match ? match[0].trimStart() : '';
        const tokenIndex = beforeText.length - token.length;
        return { token, tokenIndex };
    }

    /**
     * Finds the longest common prefix of an array of strings
     * @param {string[]} strings - The array of strings
     * @returns {string} - The longest common prefix
     */
    _longestCommonPrefix(strings) {
        if (strings.length === 0) return '';
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (!strings[i].startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
                if (!prefix) break;
            }
        }
        return prefix;
    }

    /**
     * Resets the input completion
     */
    reset() {
        this._active = false;
        this._matches = [];
        this._matchIndex = 0;
        this._replaceIndex = 0;
    }
}

export default InputCompletion