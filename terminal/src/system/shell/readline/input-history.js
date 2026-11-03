/**
 * InputHistory - stores submitted lines and walks backward and forward through them
 */
export class InputHistory {
    /**
     * Creates a new InputHistory instance
     */
    constructor() {
        this._enabled = true;
        this._active = false;
        this._history = [];
        this._index = 0;
        this._draft = '';
    }

    /**
     * Returns a copy of the submitted lines
     * @returns {string[]} The input history
     */
    getHistory() {
        return this._history.slice();
    }

    /**
     * Returns the draft text saved when history navigation started
     * @returns {string} The draft text
     */
    getDraft() {
        return this._draft;
    }

    /**
     * Sets whether submitted lines are stored
     * @param {boolean} enabled Whether submitted lines are stored
     * @returns {InputHistory} The instance of the InputHistory
     */
    setEnabled(enabled = true) {
        this._enabled = Boolean(enabled);
        return this;
    }

    /**
     * Returns whether submitted lines are stored
     * @returns {boolean} True when submitted lines are stored
     */
    isEnabled() {
        return this._enabled;
    }

    /**
     * Pushes a submitted line into history
     * Skips the line when saving is off, and does not end navigation
     * Skips a blank line and a repeat of the last line, and ends navigation
     * @param {string} input The input text
     * @returns {InputHistory} The instance of the InputHistory
     */
    push(input = '') {
        if (!this._enabled) return this;
        this.reset();
        if (!input || !input.trim()) return this;
        const last = this._history[this._history.length - 1];
        if (input === last) return this;
        this._history.push(input);
        return this;
    }

    /**
     * Returns whether history navigation is in progress
     * @returns {boolean} True while walking through history
     */
    isActive() {
        return this._active;
    }

    /**
     * Navigates backward in the history
     * @param {string} currentInput The current input text
     * @returns {string} Text from history
     */
    navigateBackward(currentInput) {
        if (this._history.length === 0) return currentInput;
        if (!this._active) {
            this._active = true;
            this._draft = currentInput;
            this._index = this._history.length - 1;
        } else {
            this._index = Math.max(0, this._index - 1);
        }
        return this._history[this._index];
    }

    /**
     * Navigates forward in the history
     * @param {string} currentInput The current input text
     * @returns {string} Text from history
     */
    navigateForward(currentInput) {
        if (!this._active) return currentInput;
        this._active = true;
        this._index++;
        if (this._index >= this._history.length) {
            const draft = this._draft;
            this.reset();
            return draft;
        }
        return this._history[this._index];
    }

    /**
     * Resets the navigation
     * @returns {InputHistory} The instance of the InputHistory
     */
    reset() {
        this._active = false;
        this._index = 0;
        this._draft = '';
        return this;
    }

    /**
     * Clears the navigation history
     * @returns {InputHistory} The instance of the InputHistory
     */
    clear() {
        this._history = [];
        this.reset();
        return this;
    }
}

export default InputHistory