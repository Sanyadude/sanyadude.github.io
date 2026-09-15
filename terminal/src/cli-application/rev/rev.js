import { Application } from '../../system/application/application.js'
import { REV_MANIFEST } from './rev-manifest.js'

/**
 * Rev - Application for reversing the order of characters in each line of input
 * @extends {Application}
 */
export class Rev extends Application {
    /**
     * Creates a new Rev instance
     */
    constructor() {
        super('rev', REV_MANIFEST);
    }

    /**
     * Executes the `rev` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the rev command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        const stdin = commandLine.getStdin();
        if (args.length === 0 && !stdin) return 'Path should be specified';
        if (args.length === 0 && stdin) return this._formatText(stdin, options);
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
        return this._formatText(contents.join('\n'), options);
    }

    /**
     * Formats the text of the `rev` command
     * @param {string} text - The text to format
     * @param {object} options - The options of the command
     * @returns {string} - The formatted text
     */
    _formatText(text, options = {}) {
        if (!text) return '';
        const delimiter = this._getLineDelimiter(options);
        const lines = this._splitLines(text, options);
        return lines.map(line => line.split('').reverse().join('')).join(delimiter);
    }

    /**
     * Splits text into lines using the delimiter for the given options
     * @param {string} text - The text to split
     * @param {object} options - The options object
     * @returns {string[]} - The lines
     */
    _splitLines(text, options) {
        if (options['zero']) return text.split('\0');
        return text.split(/\r?\n/);
    }

    /**
     * Returns the line delimiter for the given options
     * @param {object} options - The options object
     * @returns {string} - The line delimiter
     */
    _getLineDelimiter(options) {
        return options['zero'] ? '\0' : '\n';
    }
}

export default Rev