import { Application } from '../../system/application/application.js'
import { UPTIME_MANIFEST } from './uptime-manifest.js'

/**
 * Uptime - Application for printing the current uptime of the system
 * @extends {Application}
 */
export class Uptime extends Application {
    /**
     * Creates a new Uptime instance
     */
    constructor() {
        super('uptime', UPTIME_MANIFEST);
    }

    /**
     * Executes the `uptime` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the uptime command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        if (options['since']) {
            return this._formatSince(context.systemTime.getStartDate());
        }
        if (options['pretty']) {
            return this._formatPretty(context.systemTime.getUptime());
        }
        if (options['raw']) {
            return this._formatRaw(context.systemTime.getUptime());
        }
        return this._formatAll(context.systemTime.getStartDate(), context.systemTime.getUptime());
    }

    /**
     * Formats the uptime in all formats
     * @param {number} since - The start date of the system
     * @param {number} uptime - The uptime to format
     * @returns {string} - The formatted uptime
     */
    _formatAll(since, uptime) {
        return `${this._formatSince(since)}, ${this._formatPretty(uptime)}`;
    }

    /**
     * Formats the uptime in raw format
     * @param {number} uptime - The uptime to format
     * @returns {string} - The formatted uptime
     */
    _formatRaw(uptime) {
        return Math.round(uptime / 1000);
    }

    /**
     * Formats the date in the format yyyy-mm-dd HH:MM:SS
     * @param {number} timestamp - The timestamp to format
     * @returns {string} - The formatted date
     */
    _formatSince(timestamp) {
        const pad = (value) => value.toString().padStart(2, '0');
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Formats the uptime in pretty format
     * @param {number} uptime - The uptime to format
     * @returns {string} - The formatted uptime
     */
    _formatPretty(uptime) {
        const weeks = Math.floor(uptime / (7 * 24 * 60 * 60 * 1000));
        const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
        const hours = Math.floor(uptime / (60 * 60 * 1000));
        const minutes = Math.floor(uptime / (60 * 1000));
        const seconds = Math.floor(uptime / 1000);
        return `up ${weeks ? `${weeks} weeks, ` : ''}${days ? `${days} days, ` : ''}${hours ? `${hours} hours, ` : ''}${minutes ? `${minutes} minutes, ` : ''}${seconds} seconds`;
    }
}

export default Uptime