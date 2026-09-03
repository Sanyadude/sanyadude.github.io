import { Application } from '../../system/application/application.js'
import { UNIQ_MANIFEST } from './uniq-manifest.js'
import { 
    DEFAULT_GROUP_METHOD, DEFAULT_ALL_REPEATED_METHOD, 
    GROUP_METHODS, ALL_REPEATED_METHODS 
} from './config.js'

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
        const delimiter = this._getLineDelimiter(options);
        const lines = this._splitLines(text, options);
        const groups = this._groupLines(lines, options)
            .filter(group => this._shouldOutputGroup(group, options));
        const formatted = groups.map(group => this._formatGroup(group, options, delimiter));
        return this._joinGroups(formatted, delimiter, options);
    }

    /**
     * Returns the --group method, or null when unused
     * @param {object} options - The options object
     * @returns {string|null}
     */
    _getGroupMethod(options = {}) {
        if (options['group'] === undefined || options['group'] === null) return null;
        const method = options['group'] === true ? DEFAULT_GROUP_METHOD : String(options['group']);
        if (GROUP_METHODS.includes(method)) return method;
        return DEFAULT_GROUP_METHOD;
    }

    /**
     * Returns the --all-repeated method, or null when unused
     * @param {object} options - The options object
     * @returns {string|null}
     */
    _getAllRepeatedMethod(options = {}) {
        if (options['all-repeated'] !== undefined && options['all-repeated'] !== null) {
            const method = options['all-repeated'] === true ? DEFAULT_ALL_REPEATED_METHOD : String(options['all-repeated']);
            if (ALL_REPEATED_METHODS.includes(method)) return method;
            return DEFAULT_ALL_REPEATED_METHOD;
        }
        if (options['all-duplicates']) return DEFAULT_ALL_REPEATED_METHOD;
        return null;
    }

    /**
     * Joins formatted groups using the selected separator method
     * @param {string[]} groups - The formatted groups
     * @param {string} delimiter - The line delimiter
     * @param {object} options - The options object
     * @returns {string}
     */
    _joinGroups(groups, delimiter, options = {}) {
        const groupMethod = this._getGroupMethod(options);
        const allRepeatedMethod = this._getAllRepeatedMethod(options);
        const method = groupMethod || (allRepeatedMethod && allRepeatedMethod !== DEFAULT_ALL_REPEATED_METHOD ? allRepeatedMethod : null);
        if (!method || groups.length === 0) return groups.join(delimiter);
        const between = delimiter + delimiter;
        if (method === 'prepend') return delimiter + groups.join(between);
        if (method === 'append') return groups.join(between) + delimiter;
        if (method === 'both') return delimiter + groups.join(between) + delimiter;
        return groups.join(between);
    }

    /**
     * Returns the line delimiter for the given options
     * @param {object} options - The options object
     * @returns {string} - The line delimiter
     */
    _getLineDelimiter(options) {
        return options['zero-terminated'] ? '\0' : '\n';
    }

    /**
     * Splits text into lines using the delimiter for the given options
     * @param {string} text - The text to split
     * @param {object} options - The options object
     * @returns {string[]} - The lines
     */
    _splitLines(text, options) {
        if (options['zero-terminated']) return text.split('\0');
        return text.split(/\r?\n/);
    }

    /**
     * Groups adjacent equal lines.
     * @param {string[]} lines - The lines to group
     * @param {object} options - The options object
     * @returns {{ line: string, count: number, lines: string[] }[]} - The grouped lines
     */
    _groupLines(lines, options = {}) {
        const groups = [];
        let currentLines = [lines[0]];
        for (let index = 1; index < lines.length; index++) {
            if (this._compareLines(lines[index], currentLines[0], options)) {
                currentLines.push(lines[index]);
                continue;
            }
            groups.push({ line: currentLines[0], count: currentLines.length, lines: currentLines });
            currentLines = [lines[index]];
        }
        groups.push({ line: currentLines[0], count: currentLines.length, lines: currentLines });
        return groups;
    }

    /**
     * Returns whether a grouped line should be output.
     * @param {{ line: string, count: number }} group - The grouped line
     * @param {object} options - The options object
     * @returns {boolean} - True when the group should be output
     */
    _shouldOutputGroup(group, options = {}) {
        if (this._getGroupMethod(options)) return true;
        if (this._getAllRepeatedMethod(options) || options['repeated']) return group.count > 1;
        if (options['unique']) return group.count === 1;
        return true;
    }

    /**
     * Formats a grouped line for output.
     * @param {{ line: string, count: number }} group - The grouped line
     * @param {object} options - The options object
     * @param {string} delimiter - The line delimiter
     * @returns {string} - The formatted line
     */
    _formatGroup(group, options = {}, delimiter = '\n') {
        if (this._getGroupMethod(options) || this._getAllRepeatedMethod(options)) {
            return group.lines.join(delimiter);
        }
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