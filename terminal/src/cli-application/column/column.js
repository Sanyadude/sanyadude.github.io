import { Application } from '../../system/application/application.js'
import { COLUMN_MANIFEST } from './column-manifest.js'
import { DEFAULT_SEPARATOR, DEFAULT_COLUMN_SPACING } from './config.js'

/**
 * Column - Application for formatting the output into multiple columns
 * @extends {Application}
 */
export class Column extends Application {
    /**
     * Creates a new Column instance
     */
    constructor() {
        super('column', COLUMN_MANIFEST);
    }

    /**
     * Executes the `column` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the column command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        const options = commandLine.getOptions();
        let content = stdin;
        const filePath = args[0];
        if (filePath) {
            const file = context.fileSystemManager.getFile(filePath);
            if (!file) return `File not found at path: ${filePath}`;
            content = file.readAsString();
        }
        return this._formatContent(content, options, context);
    }

    /**
     * Formats the content into multiple columns
     * @param {string} content - The content to format
     * @param {object} options - The options for the format
     * @param {object} context - The context of the command execution
     * @returns {string} - The formatted content
     */
    _formatContent(content, options, context) {
        const isTable = options['table'];
        if (isTable) return this._formatTable(content, options);
        return this._formatColumns(content, options, context);
    }

    /**
     * Formats the content into multiple columns
     * @param {string} content - The content to format
     * @param {object} options - The options for the format
     * @returns {string} - The formatted content
     */
    _formatColumns(content, options, context) {
        const separator = options['separator'] || DEFAULT_SEPARATOR;
        const preserveEmptyLines = options['empty-lines'];
        const shouldMerge = !options['no-merge'];
        const width = options['columns'] || context.terminal.getSize().columns;
        const columnFirst = options['column-first'];
        let lines = this._getLines(content, preserveEmptyLines);

        const words = lines.flatMap(line => this._splitLine(line, separator, shouldMerge));
        if (words.length === 0) return '';

        const maxLength = Math.max(...words.map(word => word.length)) + DEFAULT_COLUMN_SPACING;
        const cols = Math.max(1, Math.floor(width / maxLength));
        const rows = Math.ceil(words.length / cols);
        const grid = [];
        if (columnFirst) {
            for (let row = 0; row < rows; row++) {
                grid[row] = [];
                for (let col = 0; col < cols; col++) {
                    const index = col * rows + row;
                    grid[row][col] = words[index] || '';
                }
            }
        } else {
            for (let row = 0; row < rows; row++) {
                grid[row] = [];
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col;
                    grid[row][col] = words[index] || '';
                }
            }
        }

        let formattedContent = '';
        for (const row of grid) {
            const line = row.map(cell => cell.padEnd(maxLength, ' ')).join('').trimEnd();
            formattedContent += line + '\n';
        }
        return formattedContent;
    }

    /**
     * Formats the content into a table
     * @param {string} content - The content to format
     * @param {object} options - The options for the format
     * @returns {string} - The formatted content
     */
    _formatTable(content, options) {
        const separator = options['separator'] || DEFAULT_SEPARATOR;
        const preserveEmptyLines = options['empty-lines'];
        const shouldMerge = !options['no-merge'];
        let lines = this._getLines(content, preserveEmptyLines);

        const grid = lines.map(line => this._splitLine(line, separator, shouldMerge));
        if (grid.length === 0) return '';

        const maxColumns = Math.max(...grid.map(row => row.length));
        const normalizedGrid = grid.map(row => {
            return row.concat(Array(maxColumns - row.length).fill(''));
        });
        const widths = Array(maxColumns).fill(0);
        for (const row of normalizedGrid) {
            row.forEach((cell, index) => {
                widths[index] = Math.max(widths[index], cell.length);
            });
        }

        let formattedContent = '';
        for (const row of normalizedGrid) {
            const line = row.map((cell, index) => cell.padEnd(widths[index] + DEFAULT_COLUMN_SPACING, ' ')).join('').trimEnd();
            formattedContent += line + '\n';
        }
        return formattedContent;
    }

    /**
     * Gets the lines from the content
     * @param {string} content - The content to split
     * @param {boolean} preserveEmptyLines - Whether to preserve empty lines
     * @returns {string[]} - The lines
     */
    _getLines(content, preserveEmptyLines) {
        const lines = content.split(/\r?\n/);
        if (preserveEmptyLines) return lines;
        return lines.filter(line => line.trim() !== '');
    }

    /**
     * Splits a line respecting quotes
     * @param {string} line - The line to split
     * @param {string|RegExp} separator - The separator to split on
     * @param {boolean} shouldMerge - Whether to merge delimiters
     * @returns {string[]} - The array of parts
     */
    _splitLine(line, separator, shouldMerge) {
        if (!line) return [''];
        const tokens = [];
        let current = '';
        let inQuote = null;
        let i = 0;
        while (i < line.length) {
            const character = line[i];
            // Handle quote start/end
            if (character === '"' || character === "'") {
                if (!inQuote) {
                    inQuote = character;
                } else if (inQuote === character) {
                    inQuote = null;
                }
                current += character;
                i++;
                continue;
            }
            // If inside quotes, just accumulate
            if (inQuote) {
                current += character;
                i++;
                continue;
            }
            // Check for separator
            let matchedLength = 0;
            if (typeof separator === 'string') {
                if (line.startsWith(separator, i)) matchedLength = separator.length;
            } else if (separator instanceof RegExp) {
                const match = separator.exec(line.slice(i));
                if (match && match.index === 0) matchedLength = match[0].length;
            }
            if (matchedLength) {
                if (current || !shouldMerge) {
                    tokens.push(current);
                }
                current = '';
                i += matchedLength;
                continue;
            }
            current += character;
            i++;
        }
        if (current) tokens.push(current);
        return tokens;
    }
}

export default Column