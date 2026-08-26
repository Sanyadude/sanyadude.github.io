/**
 * ExecutionRuntime - Per-run execution state shared between the shell, the process and the application.
 */
export class ExecutionRuntime {
    /**
     * Creates a new ExecutionRuntime instance
     * @param {AbortSignal|null} abortSignal - The abort signal of the owning job
     * @param {string} command - The command that started the run
     */
    constructor(abortSignal = null, command = '') {
        this._abortSignal = abortSignal ?? new AbortController().signal;
        this._command = command;
        this._process = null;
        this._session = null;
    }

    /**
     * Creates a runtime for a process, inheriting the abort signal of this runtime
     * @param {Process} process - The process of the run
     * @param {TerminalSession|null} session - The terminal session of the process
     * @returns {ExecutionRuntime} - The runtime of the process
     */
    forProcess(process, session = null) {
        const runtime = new ExecutionRuntime(this._abortSignal, this._command);
        runtime._process = process;
        runtime._session = session;
        return runtime;
    }

    /**
     * Gets the command that started the run
     * @returns {string} - The command
     */
    getCommand() {
        return this._command;
    }

    /**
     * Gets the process of the run
     * @returns {Process|null} - The process
     */
    getProcess() {
        return this._process;
    }

    /**
     * Gets the terminal session of the run
     * @returns {TerminalSession|null} - The session
     */
    getSession() {
        return this._session;
    }

    /**
     * Gets the abort signal of the run
     * @returns {AbortSignal} - The abort signal
     */
    getAbortSignal() {
        return this._abortSignal;
    }

    /**
     * Checks whether the run was aborted
     * @returns {boolean} - True if the run was aborted
     */
    isAborted() {
        return this._abortSignal.aborted;
    }

    /**
     * Subscribes to the abort of the run
     * @param {Function} callback - The callback to call on abort
     * @returns {Function} - A function that removes the subscription
     */
    onAbort(callback) {
        if (this._abortSignal.aborted) {
            callback();
            return () => { };
        }
        this._abortSignal.addEventListener('abort', callback, { once: true });
        return () => this._abortSignal.removeEventListener('abort', callback);
    }

    /**
     * Waits for the run to be aborted
     * @returns {Promise<void>} - A promise that resolves when the run is aborted
     */
    whenAborted() {
        return new Promise((resolve) => this.onAbort(resolve));
    }
}

export default ExecutionRuntime
