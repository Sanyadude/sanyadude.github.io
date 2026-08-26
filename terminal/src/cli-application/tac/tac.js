import { Application } from '../../system/application/application.js'
import { TAC_MANIFEST } from './tac-manifest.js'

/**
 * Tac - Application for displaying the contents of a file in reverse order
 * @extends {Application}
 */
export class Tac extends Application {
    /**
     * Creates a new Tac instance
     */
    constructor() {
        super('tac', TAC_MANIFEST);
    }

    /**
     * Executes the `tac` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the tac command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        const stdin = commandLine.getStdin();
        const path = args.join(' ');
        if (path == 'nul') return '';
        if (args.length === 0 && !stdin) return 'Path should be specified';
        if (args.length === 0 && stdin) return this._formatOutput(stdin, options);
        const file = context.fileSystemExplorer.getFile(path);
        if (!file) return `File not found: ${path}`;
        const output = file.readAsString();
        return this._formatOutput(output, options);
    }

    /**
     * Formats the output of the `tac` command
     * @param {string} output - The output to format
     * @param {object} options - The options of the command
     * @returns {string} - The formatted output
     */
    _formatOutput(output, options = {}) {
        if (!output) return '';
        const separator = options['separator'] ?? '\n';
        const before = options['before'];
        const regex = options['regex'];
        return this._reverseFilter(output, separator, before, regex);
    }

    /**
     * Reverses the output using options
     * @param {string} output - The output to reverse
     * @param {string} separator - The separator to use for records
     * @param {boolean} before - Whether to attach the separator to the beginning of the record
     * @param {boolean} regex - Whether to interpret the separator as a regular expression
     * @returns {string} - The reversed output
     */
    _reverseFilter(output, separator, before = false, regex = false) {
        if (regex) return this._reverseFilterRegex(output, separator, before);
        return this._reverseFilterString(output, separator, before);
    }
    
    /**
     * Reverses the output using a string separator
     * @param {string} output - The output to reverse
     * @param {string} separator - The separator to use for records
     * @param {boolean} before - Whether to attach the separator to the beginning of the record
     * @returns {string} - The reversed output
     */
    _reverseFilterString(output, separator, before) {
        const parts = output.split(separator);
        if (!before) return parts.reverse().join(separator);
        return parts.map((part, index) => index === 0 ? part : separator + part).reverse().join('');
    }
    
    /**
     * Reverses the output using a regular expression separator
     * @param {string} output - The output to reverse
     * @param {string} separator - The separator to use for records
     * @param {boolean} before - Whether to attach the separator to the beginning of the record
     * @returns {string} - The reversed output
     */
    _reverseFilterRegex(output, separator, before) {
        const parts = output.split(new RegExp(`(${separator})`)).reverse();
        const records = [];
        for (let i = 0; i < parts.length; i += 2) {
            const content = parts[i];
            const separatorPart = parts[i + 1] ?? '';
            const record = before
                ? separatorPart + content
                : content + separatorPart;
            records.push(record);
        }
        return records.join('');
    }
}

export default Tac