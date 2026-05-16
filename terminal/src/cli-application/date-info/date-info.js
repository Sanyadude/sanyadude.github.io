import { Application } from '../../system/application/application.js'
import { DATE_MANIFEST } from './date-manifest.js'
import { DEFAULT_DATE_FORMAT, DEFAULT_ISO8601_FORMAT } from './config.js'
import { DateParser } from './date-parser.js'
import { DateFormatter } from './date-formatter.js'

/**
 * Date - Application for displaying current date
 * @extends {Application}
 */
export class DateInfo extends Application {
    /**
     * Creates a new Date instance
     */
    constructor() {
        super('date', DATE_MANIFEST);
        this._dateParser = new DateParser();
        this._dateFormatter = new DateFormatter();
    }

    /**
     * Executes the `date` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the date command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const setDate = options['set-date'];
        if (setDate) {
            return this._setDate(setDate, context);
        }
        const format = options['format'] || DEFAULT_DATE_FORMAT;
        const iso8601 = options['iso8601'];
        const rfcEmail = options['rfc-email'];
        const utc = options['utc'];
        const date = options['date'];
        let inputDate = null;
        if (date) {
            inputDate = this._dateParser.parse(date);
            if (isNaN(inputDate.getTime())) return `Invalid date: ${date}`;
        } else {
            inputDate = new Date(context.systemTime.getTime());
        }
        if (iso8601) {
            return this._iso8601(inputDate, iso8601, utc);
        }
        if (rfcEmail) {
            return this._rfcEmail(inputDate, utc);
        }
        return this._dateFormatter.format(inputDate, format, utc);
    }

    /**
     * Sets the system time to the specified date
     * @param {string} date - The date to set
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the date command execution
     */
    _setDate(date, context) {
        const newDate = this._dateParser.parse(date);
        if (isNaN(newDate)) {
            return `Invalid date: ${date}`;
        }
        context.systemTime.setTime(newDate.getTime());
        return `System time set to ${this._dateFormatter.format(newDate, DEFAULT_DATE_FORMAT)}`;
    }

    /**
     * Formats the date according to the ISO 8601 standard
     * @param {Date} date - The date to format
     * @param {string} fmt - The format to use
     * @param {boolean} utc - Whether to use UTC time
     * @returns {string} - The formatted date
     */
    _iso8601(date, format = DEFAULT_ISO8601_FORMAT, utc = false) {
        switch (format) {
            case 'hours':
                return this._dateFormatter.format(date, '%FT%H%z', utc);
            case 'minutes':
                return this._dateFormatter.format(date, '%FT%R%z', utc);
            case 'seconds':
                return this._dateFormatter.format(date, '%FT%T%z', utc);
            case 'days':
            default:
                return this._dateFormatter.format(date, '%F', utc);
        }
    };

    /**
     * Formats the date according to the RFC 5322 standard
     * @param {Date} date - The date to format
     * @param {boolean} utc - Whether to use UTC time
     * @returns {string} - The formatted date
     */
    _rfcEmail(date, utc = false) {
        return this._dateFormatter.format(date, '%a, %d %b %Y %H:%M:%S %z', utc);
    }
}

export default DateInfo