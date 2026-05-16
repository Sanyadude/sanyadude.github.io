import { Application } from '../../system/application/application.js'
import { FIND_MANIFEST } from './find-manifest.js'

/**
 * Find - Application for finding files and directories
 * @extends {Application}
 */
export class Find extends Application {
    /**
     * Creates a new Find instance
     */
    constructor() {
        super('find', FIND_MANIFEST);
    }

    /**
     * Executes the `find` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the find/findstr command execution
     */
    main(commandLine, context) {
        const program = commandLine.getProgram();
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        const options = commandLine.getOptions();
        const cwd = context.fileSystemExplorer.getCurrentPath();
        if (args.length === 0) return 'Search string should be specified';
        let findFunction = null;
        if (program === 'find') {
            findFunction = this._find;
        }
        if (program === 'findstr') {
            findFunction = this._findStr;
        }
        if (!findFunction) return '';
        const search = args[0];
        const searchFile = args[1];
        const lines = [];
        if (stdin) {
            findFunction(search, stdin, options).forEach(line => lines.push(line));
            return this._getResult(lines, search);
        }
        if (searchFile) {
            const filePath = cwd + '/' + searchFile;
            const file = context.fileSystemManager.getFile(filePath);
            if (!file) return `File not found: ${searchFile}`;
            const content = file.readAsString();
            findFunction(search, content, options).forEach(line => lines.push(line));
            return this._getResult(lines, search);
        }
        const files = context.fileSystemManager.findFiles('', {}, cwd);
        files.forEach(file => {
            const content = file.readAsString();
            findFunction(search, content, options).forEach(line => lines.push(line));
        });
        return this._getResult(lines, search);
    }

    /**
     * Gets the result of the search
     * @param {string[]} lines - The lines containing the search string
     * @param {string} search - The search string
     * @returns {string} - The result of the search
     */
    _getResult(lines, search) {
        if (lines.length === 0) return `No results for: ${search}`;
        return lines.join('\n');
    }

    /**
     * Finds the string in the string
     * @param {string} search - The string to search for
     * @param {string} string - The string to search in
     * @param {object} options - The options for the search
     * @returns {string[]} - The lines containing the search string
     */
    _find(search, string, options) {
        const lines = [];
        const stringLines = string.split('\n');

        const ignoreCase = options['ignore-case'];
        const invertMatch = options['invert-match'];
        const lineNumber = options['line-number'];
        const count = options['count'];

        const normalizedSearch = ignoreCase ? search.toLowerCase() : search;
        for (let i = 0; i < stringLines.length; i++) {
            const line = stringLines[i];
            const normalizedLine = ignoreCase ? line.toLowerCase() : line;
            let isMatch = normalizedLine.includes(normalizedSearch);
            if (invertMatch) isMatch = !isMatch;
            if (!isMatch) continue;
            lines.push(lineNumber ? `${i + 1}: ${line}` : line);
        }
        return count ? [lines.length.toString()] : lines;
    }

    /**
     * Finds the string in the string
     * @param {string} search - The string to search for
     * @param {string} string - The string to search in
     * @param {object} options - The options for the search
     * @returns {string[]} - The lines containing the search string
     */
    _findStr(search, string, options) {
        const lines = [];
        const stringLines = string.split('\n');
    
        const ignoreCase = options['ignore-case'];
        const invertMatch = options['invert-match'];
        const lineNumber = options['line-number'];
        const count = options['count'];
        const showOffset = options['offset'];
        const beginning = options['beginning'];
        const end = options['end'];
        const exact = options['exact'];
        const literal = options['literal'];
        // Escape regex if literal search
        if (literal) {
            search = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        let pattern = search;
        if (exact) {
            pattern = `^${pattern}$`;
        } else {
            if (beginning) pattern = `^${pattern}`;
            if (end) pattern = `${pattern}$`;
        }
        const flags = ignoreCase ? 'i' : '';
        const regex = new RegExp(pattern, flags);
        for (let i = 0; i < stringLines.length; i++) {
            const line = stringLines[i].replace(/[\r\n]+$/, '');
            const match = regex.exec(line);
            let isMatch = match !== null;
            const offset = match ? match.index : -1;
            if (invertMatch) isMatch = !isMatch;
            if (!isMatch) continue;
            let resultLine =
                `${lineNumber ? `${i + 1}:` : ''}` +
                `${showOffset && offset !== -1 ? `${offset}:` : ''}` +
                `${line}`;
            lines.push(resultLine);
        }
        return count ? [lines.length.toString()] : lines;
    }
}

export default Find