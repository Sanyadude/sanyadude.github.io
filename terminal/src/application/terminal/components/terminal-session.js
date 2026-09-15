/**
 * TerminalSession - Per-process terminal I/O handle (TTY-like)
 */
export class TerminalSession {
    /**
     * Creates a new TerminalSession instance
     * @param {TerminalApi} terminalApi - The terminal API
     * @param {number} processId - The id of the owning process
     */
    constructor(terminalApi, processId = null) {
        this._terminal = terminalApi;
        this._processId = processId;
        this._open = true;
    }

    /**
     * Gets the owning process
     * @returns {Process|null} - The process
     */
    getProcessId() {
        return this._processId;
    }

    /**
     * Sets the owning process
     * @param {Process} process - The process
     * @returns {TerminalSession} - The session instance
     */
    setProcessId(processId) {
        this._processId = processId;
        return this;
    }

    /**
     * Checks if the session is open
     * @returns {boolean} - True if the session is open
     */
    isOpen() {
        return this._open;
    }

    /**
     * Closes the session (further writes are ignored)
     * @returns {TerminalSession} - The session instance
     */
    close() {
        this._open = false;
        return this;
    }

    /**
     * Gets the terminal size
     * @returns {object} - The terminal size
     */
    getSize() {
        return this._terminal.getSize();
    }

    /**
     * Gets terminal info
     * @returns {object} - The terminal info
     */
    getTerminalInfo() {
        return this._terminal.getInfo();
    }

    /**
     * Writes text to the terminal without updating the prompt
     * @param {string} text - The text to write
     * @returns {TerminalSession} - The session instance
     */
    write(text = '') {
        if (!this._open) return this;
        this._terminal.writeOutput(text);
        return this;
    }

    /**
     * Writes a line to the terminal without updating the prompt
     * @param {string} text - The text to write
     * @returns {TerminalSession} - The session instance
     */
    writeLine(text = '') {
        if (!this._open) return this;
        this._terminal.writeOutputLine(text);
        return this;
    }

    /**
     * Removes a scrollback line without updating the prompt
     * @param {number|null} [index=null] - The line index
     * @returns {TerminalSession} - The session instance
     */
    removeLine(index = null) {
        if (!this._open) return this;
        this._terminal.removeOutputLine(index);
        return this;
    }

    /**
     * Clears scrollback without updating the prompt
     * @returns {TerminalSession} - The session instance
     */
    clear() {
        if (!this._open) return this;
        this._terminal.clearOutput();
        return this;
    }
}

export default TerminalSession