import { LogTarget } from '../log-target.js'
import { LOG_TARGET_TYPE } from '../log-target-type.js'

/**
 * MemoryLogTarget - A log target that stores logs in memory
 * @extends LogTarget
 */
export class MemoryLogTarget extends LogTarget {
    /**
     * Creates a new MemoryLogTarget
     * @param {object} options - The options for the MemoryLogTarget
     * @param {string} options.name - The name of the MemoryLogTarget
     * @param {number} options.maxLogs - The maximum number of logs to store
     */
    constructor(options = {}) {
        const defaultOptions = {
            name: LOG_TARGET_TYPE.MEMORY,
            maxLogs: MemoryLogTarget.DEFAULT_MAX_LOGS
        };
        super({ ...defaultOptions, ...options });
        this._maxLogs = this._options.maxLogs;
        this._logs = [];
    }

    /**
     * Gets the default maximum number of logs to store
     * @returns {number} The default maximum number of logs to store
     */
    static get DEFAULT_MAX_LOGS() {
        return 1000;
    }

    /**
     * Handles a log entry
     * @param {object} logEntry - The log entry to handle
     * @returns {MemoryLogTarget} The MemoryLogTarget
     */
    handle(logEntry) {
        this._logs.push(logEntry);
        if (this._logs.length <= this._maxLogs) return;
        this._logs.shift();
        return this;
    }

    /**
     * Disposes the MemoryLogTarget
     * @returns {MemoryLogTarget} The MemoryLogTarget
     */
    dispose() {
        this._logs.length = 0;
        return this;
    }
}

export default MemoryLogTarget