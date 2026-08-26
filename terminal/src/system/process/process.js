import { PROCESS_STATUS } from './process-status.js'

/**
 * Process - Represents a process
 */
export class Process {
    /**
     * Creates a new Process instance
     * @param {number} id - The id of the process
     * @param {ShellCommandLine} commandLine - The command line of the process
     */
    constructor(id, commandLine) {
        this._id = id;
        this._commandLine = commandLine;
        this._status = PROCESS_STATUS.NEW;

        this._result = null;
        this._exitCode = 0;

        this._startedAt = null;
        this._stoppedAt = null;
        this._terminatedAt = null;
        this._killedAt = null;
    }

    /**
     * Gets the id of the process
     * @returns {number} - The id of the process
     */
    getId() {
        return this._id;
    }
    
    /**
     * Gets the command line of the process
     * @returns {ShellCommandLine} - The command line of the process
     */
    getCommandLine() {
        return this._commandLine;
    }

    /**
     * Gets the status of the process
     * @returns {PROCESS_STATUS} - The status of the process
     */
    getStatus() {
        return this._status;
    }

    /**
     * Gets the result of the process
     * @returns {any} - The result of the process
     */
    getResult() {
        return this._result;
    }

    /**
     * Gets the exit code of the process
     * @returns {number} - The exit code of the process
     */
    getExitCode() {
        return this._exitCode;
    }

    /**
     * Starts the process
     * @returns {boolean} - True if the process was started, false otherwise
     */
    start() {
        if (this._status !== PROCESS_STATUS.NEW && this._status !== PROCESS_STATUS.STOPPED) return false;
        this._status = PROCESS_STATUS.RUNNING;
        this._startedAt = new Date().getTime();
        return true;
    }

    /**
     * Stops the process
     * @returns {boolean} - True if the process was stopped, false otherwise
     */
    stop() {
        if (this._status !== PROCESS_STATUS.RUNNING) return false;
        this._status = PROCESS_STATUS.STOPPED;
        this._stoppedAt = new Date().getTime();
        return true;
    }

    /**
     * Terminates the process
     * @param {any} result - The result of the process
     * @param {number} exitCode - The exit code of the process
     * @returns {boolean} - True if the process was terminated, false otherwise
     */
    terminate(result, exitCode = 0) {
        if (this._status === PROCESS_STATUS.KILLED || this._status === PROCESS_STATUS.TERMINATED) return false;
        this._status = PROCESS_STATUS.TERMINATED;
        this._result = result;
        this._exitCode = exitCode;
        this._terminatedAt = new Date().getTime();
        return true;
    }

    /**
     * Kills the process
     * @returns {boolean} - True if the process was killed, false otherwise
     */
    kill() {
        if (this._status === PROCESS_STATUS.KILLED || this._status === PROCESS_STATUS.TERMINATED) return false;
        this._status = PROCESS_STATUS.KILLED;
        this._killedAt = new Date().getTime();
        return true;
    }
}

export default Process