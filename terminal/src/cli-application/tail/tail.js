import { Application } from '../../system/application/application.js'
import { TAIL_MANIFEST } from './tail-manifest.js'
import { DEFAULT_LINES_NUMBER, DEFAULT_BYTES_NUMBER } from './config.js'

/**
 * Tail - Application for displaying the last part of a file
 * @extends {Application}
 */
export class Tail extends Application {
    /**
     * Creates a new Tail instance
     */
    constructor() {
        super('tail', TAIL_MANIFEST);
    }

    /**
     * Executes the `tail` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the tail command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        const stdin = commandLine.getStdin();
        if (args.length === 0) {
            return this._readFromStdin(stdin, options);
        }
        const shouldOutputHeaders = options['verbose'] || (args.length > 1 && !options['quiet']);
        let result = '';
        for (const arg of args) {
            const file = context.fileSystemExplorer.getFile(arg);
            if (!file) continue;
            result += shouldOutputHeaders ? `==> ${file.name} <==\n` : '';
            result += this._readFromFile(file, options) + '\n';
        }
        return result;
    }

    /**
     * Reads the stdin and returns the last part of the stdin
     * @param {string} stdin - The stdin to read
     * @param {object} options - The options object
     * @returns {string} - The last part of the stdin
     */
    _readFromStdin(stdin, options) {
        if (options['bytes']) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(stdin);
            const bytesCount = !isNaN(parseInt(options['bytes'])) 
                ? parseInt(options['bytes']) 
                : DEFAULT_BYTES_NUMBER;
            const bytesToDisplay = bytes.slice(-bytesCount);
            const decoder = new TextDecoder();
            return decoder.decode(bytesToDisplay);
        }
        const linesCount = !isNaN(parseInt(options['lines'])) 
            ? parseInt(options['lines']) 
            : DEFAULT_LINES_NUMBER;
        const lines = stdin.split('\n');
        const linesToDisplay = lines.slice(-linesCount);
        return linesToDisplay.join('\n');
    }

    /**
     * Reads the file and returns the last part of the file
     * @param {FileEntry} file - The file to read
     * @param {object} options - The options object
     * @returns {string} - The last part of the file
     */
    _readFromFile(file, options) {
        if (options['bytes']) {
            const bytesCount = !isNaN(parseInt(options['bytes'])) 
                ? parseInt(options['bytes']) 
                : DEFAULT_BYTES_NUMBER;
            const bytes = file.read();
            const bytesToDisplay = bytes.slice(-bytesCount);
            const decoder = new TextDecoder();
            return decoder.decode(bytesToDisplay);
        }
        const linesCount = !isNaN(parseInt(options['lines'])) 
            ? parseInt(options['lines']) 
            : DEFAULT_LINES_NUMBER;
        const lines = file.readAsLines();
        const linesToDisplay = lines.slice(-linesCount);
        return linesToDisplay.join('\n');
    }
}

export default Tail