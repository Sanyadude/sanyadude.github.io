/**
 * The InputHistoryNavigation class is used to navigate through the input history
 */
export class InputHistoryNavigation {
    /**
     * Constructs a new InputHistoryNavigation instance
     */
    constructor() {
        this._active = false;
        this._history = [];
        this._index = 0;
        this._draft = '';
    }

    /**
     * Optional: expose history (read-only)
     */
    getHistory() {
        return this._history.slice();
    }

    /**
     * Returns the draft text
     * @returns {string} - The draft text
     */
    getDraft() {
        return this._draft;
    }

    /**
     * Adds an input to the navigation history
     * @param {string} input - The input text
     * @returns {InputHistoryNavigation} - The instance of the InputHistoryNavigation
     */
    addInput(input = '') {
        this.reset();
        if (!input || !input.trim()) return this;
        const last = this._history[this._history.length - 1];
        if (input === last) return this;
        this._history.push(input);
        return this;
    }

    /**
     * Navigates backward in the history
     * @param {string} currentInput - The current input text
     * @returns {string} - Text from history
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
     * @param {string} currentInput - The current input text
     * @returns {string} - Text from history
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
     * @returns {InputHistoryNavigation} - The instance of the InputHistoryNavigation
     */
    reset() {
        this._active = false;
        this._index = 0;
        this._draft = '';
        return this;
    }

    /**
     * Clears the navigation history
     * @returns {InputHistoryNavigation} - The instance of the InputHistoryNavigation
     */
    clear() {
        this._history = [];
        this.reset();
        return this;
    }

}

export default InputHistoryNavigation