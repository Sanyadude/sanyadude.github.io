import { Application } from '../../system/application/application.js'
import { FINDSTR_MANIFEST } from './findstr-manifest.js'

/**
 * FindStr - Application for searching file contents and standard input with regular expressions
 * @extends {Application}
 */
export class FindStr extends Application {
    /**
     * Creates a new FindStr instance
     */
    constructor() {
        super('findstr', FINDSTR_MANIFEST);
    }

    /**
     * Executes the `findstr` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the findstr command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        const options = commandLine.getOptions();
        if (args.length === 0) return 'Search string should be specified';
        const search = args[0];
        const filePaths = args.slice(1);
        const regex = this._compileRegex(search, options);
        const files = [];
        if (filePaths.length === 0) {
            files.push({ path: '', text: stdin });
        } else {
            for (const filePath of filePaths) {
                const collected = this._collectFiles(filePath, options, context);
                if (collected === null) return `File not found: ${filePath}`;
                files.push(...collected);
            }
        }
        const results = files.map(({ path, text }) => ({ path, lines: this._find(regex, text, options) }));
        const formattedLines = this._formatLines(results, options);
        if (formattedLines.length === 0) return `No results for: ${search}`;
        return formattedLines.join('\n');
    }

    /**
     * Resolves one file argument, or every file with that name when recursive
     * @param {string} filePath - The file path
     * @param {object} options - The command options
     * @param {object} context - The context of the command execution
     * @returns {Array<{path: string, text: string}>|null}
     */
    _collectFiles(filePath, options, context) {
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const recursive = Boolean(options['recursive']);
        if (!recursive) {
            const fullPath = fsExplorer.getAbsolutePath(filePath);
            const file = fsManager.getFile(fullPath);
            if (!file) return null;
            return [{ path: filePath, text: file.readAsString() }];
        }
        const directory = fsExplorer.getCurrentDirectory();
        if (!directory) return null;
        const files = this._collectFilesRecursive(directory.getEntries(), '', filePath);
        return files.length === 0 ? null : files;
    }

    /**
     * Collects files recursively
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {string} path - The path
     * @param {string} name - The name
     * @returns {Array<{path: string, text: string}>} - The files
     */
    _collectFilesRecursive(entries, path, name) {
        const files = [];
        for (const entry of entries) {
            const childPath = path ? `${path}/${entry.getName()}` : entry.getName();
            if (entry.isFile() && entry.getName() === name) {
                files.push({ path: childPath, text: entry.readAsString() });
                continue;
            }
            if (!entry.isDirectory()) continue;
            files.push(...this._collectFilesRecursive(entry.getEntries(), childPath, name));
        }
        return files;
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
        const filenameOnly = Boolean(options['filename-only']);
        const formattedLines = [];
        for (const result of results) {
            if (filenameOnly) {
                if (result.lines.length > 0) formattedLines.push(result.path || '(standard input)');
                continue;
            }
            if (count) {
                const line = result.path
                    ? `${result.path}:${result.lines.length}`
                    : `${result.lines.length}`;
                formattedLines.push(line);
                continue;
            }
            const lines = prefixPaths
                ? result.lines.map(line => `${result.path}:${line}`)
                : result.lines;
            formattedLines.push(...lines);
        }
        return formattedLines;
    }

    /**
     * Compiles the findstr search pattern
     * @param {string} search - The search string
     * @param {object} options - The options for the search
     * @returns {RegExp} - The compiled regular expression
     */
    _compileRegex(search, options) {
        const useLiteral = Boolean(options['literal']) && !options['regex'];
        let pattern = useLiteral
            ? search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            : search;
        if (options['exact'] || (options['beginning'] && options['end'])) {
            pattern = `^(?:${pattern})$`;
        } else if (options['beginning']) {
            pattern = `^(?:${pattern})`;
        } else if (options['end']) {
            pattern = `(?:${pattern})$`;
        }
        const flags = options['ignore-case'] ? 'i' : '';
        return new RegExp(pattern, flags);
    }

    /**
     * Finds matching lines with a compiled regular expression
     * @param {RegExp} regex - The compiled search pattern
     * @param {string} text - The text to search in
     * @param {object} options - The options for the search
     * @returns {string[]}
     */
    _find(regex, text, options) {
        const lines = [];
        const textLines = text.split('\n').map(line => line.replace(/\r$/, ''));
        const invertMatch = options['invert-match'];
        const lineNumber = options['line-number'];
        const showOffset = options['offset'];
        for (let i = 0; i < textLines.length; i++) {
            const line = textLines[i];
            const match = regex.exec(line);
            let isMatch = match !== null;
            const offset = match ? match.index : -1;
            if (invertMatch) isMatch = !isMatch;
            if (!isMatch) continue;
            const resultLine =
                `${lineNumber ? `${i + 1}:` : ''}` +
                `${showOffset && offset !== -1 ? `${offset}:` : ''}` +
                `${line}`;
            lines.push(resultLine);
        }
        return lines;
    }
}

export default FindStr