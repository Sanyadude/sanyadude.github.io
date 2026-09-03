import { Application } from '../../system/application/application.js'
import { CAT_MANIFEST } from './cat-manifest.js'

/**
 * Cat - Application for displaying the contents of a file
 * @extends {Application}
 */
export class Cat extends Application {
    /**
     * Creates a new Cat instance
     */
    constructor() {
        super('cat', CAT_MANIFEST);
    }

    /**
     * Executes the `cat` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the cat command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        const stdin = commandLine.getStdin();
        if (args.length === 0 && !stdin) return 'Path should be specified';
        if (args.length === 0 && stdin) return this._formatOutput(stdin, options);
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const contents = [];
        for (const path of args) {
            if (path === 'nul') {
                contents.push('');
                continue;
            }
            const fullPath = fsExplorer.getAbsolutePath(path);
            if (!fsManager.fileExists(fullPath)) return `File not found: ${fullPath}`;
            const file = fsManager.getFile(fullPath);
            if (!file) return `File not found: ${path}`;
            contents.push(file.readAsString());
        }
        return this._formatOutput(contents.join('\n'), options);
    }

    /**
     * Formats the output
     * @param {string} output - The output to format
     * @param {object} options - The options of the command
     * @returns {string} - The formatted output
     */
    _formatOutput(output, options = {}) {
        const showNonprinting = options['show-nonprinting'];
        const showTabs = options['show-tabs'];
        const showEnds = options['show-ends'];
        const squeezeBlank = options['squeeze-blank'];
        const showAll = options['show-all'];
        const showNonprintingTabs = options['show-nonprinting-tabs'];
        const showNonprintingEnds = options['show-nonprinting-ends'];
        const number = options['number'];
        const numberNonblank = options['number-nonblank'];
        let result = output;
        if (squeezeBlank) {
            result = this._squeezeBlankFilter(result);
        }
        if (showTabs || showNonprintingTabs || showAll) {
            result = this._showTabsFilter(result);
        }
        if (showEnds || showNonprintingEnds || showAll) {
            result = this._showEndsFilter(result);
        }
        if (showNonprinting || showNonprintingTabs || showNonprintingEnds || showAll) {
            result = this._showNonprintingFilter(result);
        }
        if (numberNonblank) {
            return this._numberNonblankFilter(result);
        }
        if (number) {
            return this._numberFilter(result);
        }
        return result;
    }

    /**
     * Filters the output to show non-printing characters
     * @param {string} output - The output to filter
     * @returns {string} - The filtered output
     */
    _showNonprintingFilter(output) {
        let result = '';
        for (let i = 0; i < output.length; i++) {
            const code = output.charCodeAt(i);
            // Printable ASCII, tab, newline, and carriage return
            if ((code >= 0x20 && code <= 0x7E)
                || code === 0x09
                || code === 0x0A) {
                result += output[i];
            }
            // DEL
            else if (code === 0x7F) {
                result += '^?';
            }
            // Control characters
            else if (code < 0x20) {
                result += '^' + String.fromCharCode(code + 0x40);
            }
            // High-bit characters
            else if (code >= 0x80 && code <= 0xFF) {
                const low = code & 0x7F;
                if (low === 0x7F) {
                    result += 'M-^?';
                } else if (low < 0x20) {
                    result += 'M-^' + String.fromCharCode(low + 0x40);
                } else {
                    result += 'M-' + String.fromCharCode(low);
                }
            }
            else {
                // Unicode characters outside the byte range
                result += output[i];
            }
        }
        return result;
    }

    /**
     * Filters the output to show tabs
     * @param {string} output - The output to filter
     * @returns {string} - The filtered output
     */
    _showTabsFilter(output) {
        const result = output.replace(/\t/g, '^I');
        return result;
    }

    /**
     * Filters the output to show ends
     * @param {string} output - The output to filter
     * @returns {string} - The filtered output
     */
    _showEndsFilter(output) {
        let result = '';
        let line = '';
        for (let i = 0; i < output.length; i++) {
            const char = output[i];
            if (char === '\r' && output[i + 1] === '\n') {
                result += line + '$\r\n';
                line = '';
                i++;
            } else if (char === '\n' || char === '\r') {
                result += line + '$' + char;
                line = '';
            } else {
                line += char;
            }
        }
        return result + (line ? line + '$' : '');
    }

    /**
     * Filters the output to squeeze blank lines
     * @param {string} output - The output to filter
     * @returns {string} - The filtered output
     */
    _squeezeBlankFilter(output) {
        let result = '';
        let blank = false;
        for (let i = 0; i < output.length; i++) {
            const char = output[i];
            if (char === '\r' && output[i + 1] === '\n') {
                if (!blank) {
                    result += '\r\n';
                }
                blank = true;
                i++;
            } else if (char === '\n') {
                if (!blank) {
                    result += '\n';
                }
                blank = true;
            } else {
                result += char;
                blank = false;
            }
        }
        return result;
    }

    /**
     * Filters the output to number non-blank lines
     * @param {string} output - The output to filter
     * @returns {string} - The filtered output
     */
    _numberNonblankFilter(output) {
        const lines = output.split('\n');
        let lineNumber = 1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== '') {
                lines[i] = `${lineNumber} ${lines[i]}`;
                lineNumber++;
            }
        }
        return lines.join('\n');
    }

    /**
     * Filters the output to number all lines
     * @param {string} output - The output to filter
     * @returns {string} - The filtered output
     */
    _numberFilter(output) {
        const lines = output.split('\n');
        let lineNumber = 1;
        for (let i = 0; i < lines.length; i++) {
            lines[i] = `${lineNumber} ${lines[i]}`;
            lineNumber++;
        }
        return lines.join('\n');
    }
}

export default Cat