/**
 * TextBufferProvider class - holds the primary and alternate buffers and which one is shown
 */
export class TextBufferProvider {
    /**
     * Creates a new TextBufferProvider instance
     * @param {TextBuffer} primaryBuffer The primary text buffer
     * @param {TextBuffer} alternateBuffer The alternate text buffer
     */
    constructor(primaryBuffer, alternateBuffer) {
        this._primaryBuffer = primaryBuffer;
        this._alternateBuffer = alternateBuffer;
        this._activeBuffer = primaryBuffer;
        this._bufferChangeListeners = new Set();
    }

    /**
     * Adds a listener for active buffer changes
     * @param {Function} listener The listener to add
     * @returns {Function} A function to remove the listener
     */
    onBufferChange(listener) {
        this._bufferChangeListeners.add(listener);
        return () => this._bufferChangeListeners.delete(listener);
    }

    /**
     * Emits the active buffer change event
     */
    _emitBufferChange() {
        this._bufferChangeListeners.forEach(listener => listener());
    }

    /**
     * Returns the buffer that is currently shown
     * @returns {TextBuffer} The active text buffer
     */
    getTextBuffer() {
        return this._activeBuffer;
    }

    /**
     * Returns the primary text buffer
     * @returns {TextBuffer} The primary text buffer
     */
    getPrimaryBuffer() {
        return this._primaryBuffer;
    }

    /**
     * Returns the alternate text buffer
     * @returns {TextBuffer} The alternate text buffer
     */
    getAlternateBuffer() {
        return this._alternateBuffer;
    }

    /**
     * Shows the alternate buffer
     * @returns {boolean} True when the shown buffer changed
     */
    useAlternateBuffer() {
        if (this._activeBuffer === this._alternateBuffer) return false;
        this._activeBuffer = this._alternateBuffer;
        this._emitBufferChange();
        return true;
    }

    /**
     * Shows the primary buffer
     * @returns {boolean} True when the shown buffer changed
     */
    usePrimaryBuffer() {
        if (this._activeBuffer === this._primaryBuffer) return false;
        this._activeBuffer = this._primaryBuffer;
        this._emitBufferChange();
        return true;
    }

    /**
     * Checks whether the alternate buffer is shown
     * @returns {boolean} True when the alternate buffer is shown
     */
    isAlternateBufferActive() {
        return this._activeBuffer === this._alternateBuffer;
    }

    /**
     * Checks whether the primary buffer is shown
     * @returns {boolean} True when the primary buffer is shown
     */
    isPrimaryBufferActive() {
        return this._activeBuffer === this._primaryBuffer;
    }

    /**
     * Clears the primary and alternate text buffers
     * @returns {TextBufferProvider} The instance of the TextBufferProvider
     */
    clear() {
        this._primaryBuffer.clear();
        this._alternateBuffer.clear();
        return this;
    }

    /**
     * Reflows the primary and alternate text buffers
     * @returns {TextBufferProvider} The instance of the TextBufferProvider
     */
    reflow() {
        this._primaryBuffer.reflow();
        this._alternateBuffer.reflow();
        return this;
    }
}

export default TextBufferProvider