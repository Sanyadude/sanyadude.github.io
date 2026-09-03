import { Application } from '../../system/application/application.js'
import { FIND_MANIFEST } from './find-manifest.js'

/**
 * Find - Application for searching file contents and standard input
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
     * @returns {string} - The result of the find command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        const options = commandLine.getOptions();
        if (args.length === 0) return 'Search string should be specified';
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const search = args[0];
        const filePaths = args.slice(1);
        const files = [];
        if (filePaths.length === 0) {
            files.push({ path: '', text: stdin });
        } else {
            for (const filePath of filePaths) {
                const fullPath = fsExplorer.getAbsolutePath(filePath);
                const file = fsManager.getFile(fullPath);
                if (!file) return `File not found: ${filePath}`;
                files.push({ path: filePath, text: file.readAsString() });
            }
        }
        const results = files.map(({ path, text }) => ({ path, lines: this._find(search, text, options) }));
        const formattedLines = this._formatLines(results, options);
        if (formattedLines.length === 0) return `No results for: ${search}`;
        return formattedLines.join('\n');
    }

    /**
     * Formats search results for stdin or files
     * @param {Array<{path: string, lines: string[]}>} results - The lines per source
     * @param {object} options - The command options
     * @returns {string[]}
     */
    _formatLines(results, options) {
        const prefixPaths = results.length > 1;
        const count = Boolean(options['count']);
        const formattedLines = [];
        for (const result of results) {
            if (count) {
                const line = result.path
                    ? `---------- ${result.path}: ${result.lines.length}`
                    : `${result.lines.length}`;
                formattedLines.push(line);
            } else {
                const lines = prefixPaths
                    ? result.lines.map(line => `${result.path}:${line}`)
                    : result.lines;
                formattedLines.push(...lines);
            }
        }
        return formattedLines;
    }

    /**
     * Finds lines that contain the search string
     * @param {string} search - The string to search for
     * @param {string} text - The text to search in
     * @param {object} options - The options for the search
     * @returns {string[]} - The lines containing the search string
     */
    _find(search, text, options) {
        const lines = [];
        const textLines = text.split('\n').map(line => line.replace(/\r$/, ''));
        const ignoreCase = Boolean(options['ignore-case']);
        const invertMatch = Boolean(options['invert-match']);
        const lineNumber = Boolean(options['line-number']);
        const normalizedSearch = ignoreCase ? search.toLowerCase() : search;
        for (let i = 0; i < textLines.length; i++) {
            const line = textLines[i];
            const normalizedLine = ignoreCase ? line.toLowerCase() : line;
            let isMatch = normalizedLine.includes(normalizedSearch);
            if (invertMatch) {
                isMatch = !isMatch;
            }
            if (!isMatch) continue;
            lines.push(lineNumber ? `${i + 1}:${line}` : line);
        }
        return lines;
    }
}

export default Find