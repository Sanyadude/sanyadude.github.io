/**
 * Clipboard class - stores the terminal clipboard and optionally mirrors the browser clipboard
 */
export class Clipboard {
    /**
     * Creates a new Clipboard instance
     * @param {boolean} useBrowserClipboard Also write to and read from the browser clipboard
     */
    constructor(useBrowserClipboard = true) {
        this._content = null;
        this._useBrowserClipboard = useBrowserClipboard;
    }

    /**
     * Saves text as the current clipboard content
     * @param {string} text The text to copy
     * @param {boolean} useBrowserClipboard Also write the text to the browser clipboard
     * @returns {Promise<Clipboard>} The instance of the Clipboard
     */
    async copy(text = '', useBrowserClipboard = this._useBrowserClipboard) {
        this._content = String(text);
        if (!useBrowserClipboard) return this;
        try {
            await navigator.clipboard.writeText(this._content);
        } catch (error) {
            return this;
        }
        return this;
    }

    /**
     * Returns the current clipboard content
     * @param {boolean} useBrowserClipboard Read the browser clipboard
     * @returns {Promise<string>} The clipboard text
     */
    async paste(useBrowserClipboard = this._useBrowserClipboard) {
        let text = '';
        if (useBrowserClipboard) {
            text = navigator.clipboard.readText();
        }
        if (!text) {
            text = this._content !== null ? this._content : '';
        }
        return text;
    }

    /**
     * Checks whether clipboard content has been saved
     * @returns {boolean} True when content has been saved
     */
    hasContent() {
        return this._content !== null;
    }

    /**
     * Clears the saved clipboard content
     * @returns {Clipboard} The instance of the Clipboard
     */
    clear() {
        this._content = null;
        return this;
    }
}

export default Clipboard