import { LogTarget } from '../log-target.js'
import { LOG_TARGET_TYPE } from '../log-target-type.js'

/**
 * ConsoleLogTarget - A log target that logs to the console
 * @extends LogTarget
 */
export class ConsoleLogTarget extends LogTarget {
    /**
     * Creates a new ConsoleLogTarget
     * @param {object} options - The options for the ConsoleLogTarget
     * @param {string} options.name - The name of the ConsoleLogTarget
     * @param {string} options.template - The template to use for the log entry
     * @param {boolean} options.useNativeLog - Whether to use the native log method
     */
    constructor(options = {}) {
        const defaultOptions = {
            name: LOG_TARGET_TYPE.CONSOLE,
            template: ConsoleLogTarget.DEFAULT_TEMPLATE,
            useNativeLog: false
        };
        super({ ...defaultOptions, ...options });
        this._template = this._options.template;
        this._useNativeLog = this._options.useNativeLog;
    }

    /**
     * Gets the default template for the log entry
     * @returns {string} The default template for the log entry
     */
    static get DEFAULT_TEMPLATE() {
        return `{{date}} [{{level}}] {{message}}`;
    }

    /**
     * Formats a log entry
     * @param {object} logEntry - The log entry to format
     * @returns {string} The formatted log entry
     */
    _format(logEntry) {
        const message = typeof logEntry.message === 'object'
            ? JSON.stringify(logEntry.message)
            : logEntry.message;
        return this._template
            .replace('{{date}}', logEntry.date.toISOString())
            .replace('{{level}}', logEntry.level)
            .replace('{{message}}', message);
    }

    /**
     * Handles a log entry
     * @param {object} logEntry - The log entry to handle
     * @returns {ConsoleLogTarget} The ConsoleLogTarget
     */
    handle(logEntry) {
        const message = this._format(logEntry);
        if (this._useNativeLog && console[logEntry.level] !== undefined) {
            console[logEntry.level](message);
            return;
        }
        console.log(message);
        return this;
    }
}

export default ConsoleLogTarget