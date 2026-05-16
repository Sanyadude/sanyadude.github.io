import { Application } from '../../system/application/application.js'
import { UNIQ_MANIFEST } from './uniq-manifest.js'

/**
 * Uniq - Application for filtering out duplicate lines from a file
 * @extends {Application}
 */
export class Uniq extends Application {
    /**
     * Creates a new Uniq instance
     */
    constructor() {
        super('uniq', UNIQ_MANIFEST);
    }

    /**
     * Executes the `uniq` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the uniq command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        if (args.length === 0) {
            return this._filterText(stdin, options);
        }
        const filePath = args[0];
        const file = context.fileSystemExplorer.getFile(filePath);
        if (!file) return `File not found: ${filePath}`;
        return this._filterText(file.readAsString(), options);
    }

    /**
     * Filters adjacent duplicate lines from text.
     * @param {string} text - The text to filter
     * @param {object} options - The options object
     * @returns {string} - The filtered text
     */
    _filterText(text = '', options = {}) {
        if (text === '') return '';
        const groups = this._groupLines(text.split(/\r?\n/), options);
        return groups
            .filter(group => this._shouldOutputGroup(group, options))
            .map(group => this._formatGroup(group, options))
            .join('\n');
    }

    /**
     * Groups adjacent equal lines.
     * @param {string[]} lines - The lines to group
     * @param {object} options - The options object
     * @returns {{ line: string, count: number }[]} - The grouped lines
     */
    _groupLines(lines, options = {}) {
        const groups = [];
        let currentLine = lines[0];
        let currentCount = 1;
        for (let index = 1; index < lines.length; index++) {
            if (this._compareLines(lines[index], currentLine, options)) {
                currentCount++;
                continue;
            }
            groups.push({ line: currentLine, count: currentCount });
            currentLine = lines[index];
            currentCount = 1;
        }
        groups.push({ line: currentLine, count: currentCount });
        return groups;
    }

    /**
     * Returns whether a grouped line should be output.
     * @param {{ line: string, count: number }} group - The grouped line
     * @param {object} options - The options object
     * @returns {boolean} - True when the group should be output
     */
    _shouldOutputGroup(group, options = {}) {
        if (options['duplicates']) return group.count > 1;
        if (options['unique']) return group.count === 1;
        return true;
    }

    /**
     * Formats a grouped line for output.
     * @param {{ line: string, count: number }} group - The grouped line
     * @param {object} options - The options object
     * @returns {string} - The formatted line
     */
    _formatGroup(group, options = {}) {
        if (!options['count']) return group.line;
        return `${group.count} ${group.line}`;
    }

    /**
     * Compares two lines for equality.
     * @param {string} line1 - The first line to compare
     * @param {string} line2 - The second line to compare
     * @param {object} options - The options object
     * @returns {boolean} - True if the lines are equal, false otherwise
     */
    _compareLines(line1, line2, options = {}) {
        return this._getComparisonLineKey(line1, options) === this._getComparisonLineKey(line2, options);
    }

    /**
     * Returns the normalized line used for comparison.
     * @param {string} line - The line to normalize
     * @param {object} options - The options object
     * @returns {string} - The comparison key
     */
    _getComparisonLineKey(line, options = {}) {
        const skipFields = options['skip-fields'] ? parseInt(options['skip-fields']) : 0;
        const skipChars = options['skip-chars'] ? parseInt(options['skip-chars']) : 0;
        const checkChars = options['check-chars'] ? parseInt(options['check-chars']) : 0;
        let key = this._skipFields(line, skipFields).slice(skipChars);
        if (checkChars > 0) {
            key = key.slice(0, checkChars);
        }
        return options['ignore-case'] ? key.toLowerCase() : key;
    }

    /**
     * Skips fields from the beginning of a line.
     * @param {string} line - The line to trim
     * @param {number} count - The number of fields to skip
     * @returns {string} - The line after skipped fields
     */
    _skipFields(line, count = 0) {
        let index = 0;
        for (let field = 0; field < count; field++) {
            while (index < line.length && /\s/.test(line[index])) index++;
            while (index < line.length && !/\s/.test(line[index])) index++;
        }
        return line.slice(index);
    }
}

export default Uniq