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
     * Adds a listener for the abort of the run
     * @param {Function} listener - The listener to call on abort
     * @returns {Function} - A function to remove the listener
     */
    onAbort(listener) {
        if (this._abortSignal.aborted) {
            listener();
            return () => { };
        }
        this._abortSignal.addEventListener('abort', listener, { once: true });
        return () => this._abortSignal.removeEventListener('abort', listener);
    }

    /**
     * Waits for the run to be aborted
     * @returns {Promise<void>} - A promise that resolves when the run is aborted
     */
    whenAborted() {
        return new Promise((resolve) => this.onAbort(resolve));
    }

    /**
     * Waits for the given number of milliseconds
     * @param {number} ms - The number of milliseconds to wait
     * @returns {Promise<void>} - A promise that resolves when the time has elapsed
     */
    sleep(ms) {
        if (this.isAborted()) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                unsubscribe();
                resolve();
            }, ms);
            const unsubscribe = this.onAbort(() => {
                clearTimeout(timer);
                resolve();
            });
        });
    } 
}

export default ExecutionRuntime