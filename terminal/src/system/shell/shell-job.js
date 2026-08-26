import { ExecutionRuntime } from '../process/execution-runtime.js'

/**
 * ShellJob - A queued shell command with its own cancellation signal
 */
export class ShellJob {
    /**
     * Creates a new ShellJob
     * @param {string} command - The command to run
     */
    constructor(command) {
        this._command = command;
        this._abortController = new AbortController();
        this._runtime = null;
    }

    /**
     * Gets the command for this job
     * @returns {string}
     */
    getCommand() {
        return this._command;
    }

    /**
     * Gets the runtime for this job, shared by every process the job starts
     * @returns {ExecutionRuntime}
     */
    getRuntime() {
        if (this._runtime) return this._runtime;
        this._runtime = new ExecutionRuntime(this._abortController.signal, this._command);
        return this._runtime;
    }

    /**
     * Checks whether this job was aborted
     * @returns {boolean}
     */
    isAborted() {
        return this._abortController.signal.aborted;
    }

    /**
     * Aborts this job
     * @returns {ShellJob}
     */
    abort() {
        this._abortController.abort();
        return this;
    }
}

export default ShellJob