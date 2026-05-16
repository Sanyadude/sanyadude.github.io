/**
 * LogTarget - A base class for log targets
 * @abstract
 */
export class LogTarget {
    /**
     * Creates a new LogTarget
     * @param {object} options - The options for the LogTarget
     * @param {string} options.name - The name of the LogTarget
     */
    constructor(options = {}) {
        const defaultOptions = {
            name: ''
        };
        this._options = { ...defaultOptions, ...options };
        this._name = this._options.name;
    }

    /**
     * Handles a log entry
     * @param {object} logEntry - The log entry to handle
     * @returns {LogTarget} The LogTarget
     */
    handle(logEntry) {
        return this;
    }

    /**
     * Disposes the LogTarget
     * @returns {LogTarget} The LogTarget
     */
    dispose() {
        return this;
    }
}

export default LogTarget