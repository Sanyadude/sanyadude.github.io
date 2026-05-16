import { LOG_LEVEL } from './log-level.js'
import { LOG_LEVEL_PRIORITY } from './log-level-priority.js'
import { LogTarget } from './log-target.js'

/**
 * Logger - A logger class
 */
export class Logger {
    /**
     * Creates a new Logger
     * @param {object} options - The options for the Logger
     * @param {string} options.level - The level of the Logger
     * @param {Array} options.targets - The targets for the Logger
     */
    constructor(options = {}) {
        const defaultOptions = {
            level: LOG_LEVEL.DEBUG,
            targets: []
        };
        this._options = { ...defaultOptions, ...options };
        this._level = this._options.level;
        this._targets = this._options.targets.map(target => {
            if (target instanceof LogTarget) return target;
            else if (typeof target === 'function') return new target();
            else if (target && typeof target.class === 'function') return new target.class(target.options || {});
            else return null;
        }).filter(target => target !== null);
    }

    /**
     * Logs a message
     * @param {string} level - The level of the message
     * @param {string} message - The message to log
     */
    log(level, message) {
        if (typeof message !== 'string' && typeof message !== 'object') return;

        if (LOG_LEVEL_PRIORITY[level] > LOG_LEVEL_PRIORITY[this._level]) return;

        const logEntry = {
            level: level,
            message: message,
            date: new Date()
        };

        this._targets.forEach(target => {
            try {
                target.handle(logEntry);
            } catch (error) {
                console.error('LogTarget error:', error, target);
            }
        });
    }

    /**
     * Logs a debug message
     * @param {string} message - The message to log
     */
    debug(message) {
        this.log(LOG_LEVEL.DEBUG, message);
    }

    /**
     * Logs an info message
     * @param {string} message - The message to log
     */
    info(message) {
        this.log(LOG_LEVEL.INFO, message);
    }

    /**
     * Logs a warning message
     * @param {string} message - The message to log
     */
    warn(message) {
        this.log(LOG_LEVEL.WARN, message);
    }

    /**
     * Logs an error message
     * @param {string} message - The message to log
     */
    error(message) {
        this.log(LOG_LEVEL.ERROR, message);
    }

    /**
     * Adds a target to the Logger
     * @param {LogTarget} target - The target to add
     * @returns {Logger} The Logger
     */
    addTarget(target) {
        this._targets.push(target);
        return this;
    }

    /**
     * Removes a target from the Logger
     * @param {string} name - The name of the target to remove
     * @returns {Logger} The Logger
     */
    removeTarget(name) {
        const index = this._targets.findIndex(target => target.name === name);
        if (index !== -1) {
            const removed = this._targets.splice(index, 1)[0];
            removed.dispose();
        }
        return this;
    }

    /**
     * Clears the targets from the Logger
     * @returns {Logger} The Logger
     */
    clearTargets() {
        this._targets.forEach(target => target.dispose());
        this._targets.length = 0;
        return this;
    }

    /**
     * Disposes the Logger
     * @returns {Logger} The Logger
     */
    dispose() {
        this.clearTargets();
        return this;
    }
}

export default Logger