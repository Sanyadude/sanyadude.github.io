import { Application } from '../../system/application/application.js'
import { COLUMN_MANIFEST } from './column-manifest.js'
import { DEFAULT_SEPARATOR, DEFAULT_COLUMN_SPACING, DEFAULT_OUTPUT_SEPARATOR, DEFAULT_OUTPUT_WIDTH } from './config.js'

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
        if (isTable) return this._formatTable(content, options, context);
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
        const keepEmptyLines = Boolean(options['keep-empty-lines']);
        const width = this._getOutputWidth(options, context);
        const spacing = this._getUseSpaces(options);
        const fillRows = Boolean(options['fillrows']);
        let lines = this._getLines(content, keepEmptyLines);

        const words = lines.flatMap(line => this._splitLine(line, separator));
        if (words.length === 0) return '';

        const maxLength = Math.max(...words.map(word => word.length)) + spacing;
        const cols = width === 0 ? words.length : Math.max(1, Math.floor(width / maxLength));
        const rows = Math.ceil(words.length / cols);
        const grid = [];
        if (fillRows) {
            for (let row = 0; row < rows; row++) {
                grid[row] = [];
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col;
                    grid[row][col] = words[index] || '';
                }
            }
        } else {
            for (let row = 0; row < rows; row++) {
                grid[row] = [];
                for (let col = 0; col < cols; col++) {
                    const index = col * rows + row;
                    grid[row][col] = words[index] || '';
                }
            }
        }

        let formattedRows = [];
        for (const row of grid) {
            const line = row.map(cell => cell.padEnd(maxLength, ' ')).join('').trimEnd();
            formattedRows.push(line);
        }
        return formattedRows.join('\n');
    }

    /**
     * Formats the content into a table
     * @param {string} content - The content to format
     * @param {object} options - The options for the format
     * @param {object} context - The command context
     * @returns {string} - The formatted content
     */
    _formatTable(content, options, context) {
        const separator = options['separator'] || DEFAULT_SEPARATOR;
        const outputSeparator = options['output-separator'] ?? DEFAULT_OUTPUT_SEPARATOR;
        const keepEmptyLines = Boolean(options['keep-empty-lines']);
        const columnLimit = this._getColumnLimit(options);
        const namedColumns = options['table-columns'];
        const headerAsColumns = Boolean(options['table-header-as-columns']) && !namedColumns;
        const hideHeader = Boolean(options['table-noheadings']);
        let lines = this._getLines(content, keepEmptyLines);

        let grid = lines.map(line => this._limitColumns(this._splitLine(line, separator), columnLimit, separator));
        if (grid.length === 0) return '';

        let names = [];
        if (namedColumns) {
            names = String(namedColumns).split(',').map(name => name.trim());
        } else if (headerAsColumns) {
            names = [...grid[0]];
        }

        const maxColumns = Math.max(
            ...grid.map(row => row.length),
            names.length
        );
        const normalizedGrid = grid.map(row => row.concat(Array(maxColumns - row.length).fill('')));
        names = names.concat(Array(maxColumns - names.length).fill(''));

        const printRows = [];
        if (namedColumns && !hideHeader) printRows.push(names);
        const dataStart = headerAsColumns && hideHeader ? 1 : 0;
        for (let i = dataStart; i < normalizedGrid.length; i++) {
            printRows.push(normalizedGrid[i]);
        }
        if (printRows.length === 0) return '';

        const outputIndexes = this._getOutputIndexes(maxColumns, names, options);
        const rightAlign = new Set(this._parseColumnList(options['table-right'], maxColumns, names));
        const outputRows = printRows.map(row => outputIndexes.map(index => row[index] ?? ''));
        const widths = Array(outputIndexes.length).fill(0);
        for (const row of outputRows) {
            row.forEach((cell, index) => {
                widths[index] = Math.max(widths[index], cell.length);
            });
        }
        const maxout = Boolean(options['table-maxout']);
        if (maxout) {
            this._expandWidths(widths, outputSeparator, this._getOutputWidth(options, context));
        }

        let formattedRows = [];
        for (const row of outputRows) {
            let line = row.map((cell, index) => {
                const originalIndex = outputIndexes[index];
                const pad = rightAlign.has(originalIndex)
                    ? (text, width) => text.padStart(width, ' ')
                    : (text, width) => text.padEnd(width, ' ');
                if (index === row.length - 1) return pad(cell, widths[index]);
                return pad(cell, widths[index]) + outputSeparator;
            }).join('');
            if (!maxout) {
                line = line.trimEnd();
            }
            formattedRows.push(line);
        }
        return formattedRows.join('\n');
    }

    /**
     * Caps the number of fields on a row, joining the rest into the last column
     * @param {string[]} cells - The split fields
     * @param {number|null} limit - The maximum column count
     * @param {string|RegExp} separator - The input separator, used when joining leftovers
     * @returns {string[]}
     */
    _limitColumns(cells, limit, separator) {
        if (!limit || cells.length <= limit) return cells;
        const glue = typeof separator === 'string' && separator.length > 0 ? separator[0] : ' ';
        return [...cells.slice(0, limit - 1), cells.slice(limit - 1).join(glue)];
    }

    /**
     * Returns the 0-based output column indexes after hide/order
     * @param {number} columnCount - The number of columns
     * @param {string[]} names - Column names
     * @param {object} options - The options object
     * @returns {number[]}
     */
    _getOutputIndexes(columnCount, names, options) {
        const hidden = new Set(this._parseColumnList(options['table-hide'], columnCount, names));
        const visible = [...Array(columnCount).keys()].filter(index => !hidden.has(index));
        const order = this._parseColumnList(options['table-order'], columnCount, names);
        if (order.length === 0) return visible;
        return order.filter(index => visible.includes(index));
    }

    /**
     * Parses a comma-separated list of 1-based indices or column names
     * @param {string|undefined} spec - The list from the command line
     * @param {number} columnCount - The number of columns
     * @param {string[]} names - Column names
     * @returns {number[]}
     */
    _parseColumnList(spec, columnCount, names = []) {
        if (spec === undefined || spec === null || spec === '') return [];
        const indexes = [];
        for (const part of String(spec).split(',')) {
            const token = part.trim();
            if (!token) continue;
            if (token === '0') return [...Array(columnCount).keys()];
            if (token === '-1') {
                if (columnCount > 0) indexes.push(columnCount - 1);
                continue;
            }
            if (/^\d+$/.test(token)) {
                const index = Number(token) - 1;
                if (index >= 0 && index < columnCount) indexes.push(index);
                continue;
            }
            const named = names.indexOf(token);
            if (named >= 0) indexes.push(named);
        }
        return indexes;
    }

    /**
     * Spreads leftover output width across columns
     * @param {number[]} widths - The column widths to expand
     * @param {string} outputSeparator - The delimiter between columns
     * @param {number} outputWidth - Target width, or 0 when unrestricted
     */
    _expandWidths(widths, outputSeparator, outputWidth) {
        if (outputWidth <= 0 || widths.length === 0) return;
        const separators = Math.max(0, widths.length - 1) * outputSeparator.length;
        const used = widths.reduce((sum, width) => sum + width, 0) + separators;
        let leftover = outputWidth - used;
        if (leftover <= 0) return;
        let index = 0;
        while (leftover > 0) {
            widths[index % widths.length] += 1;
            leftover -= 1;
            index += 1;
        }
    }

    /**
     * Returns the table column limit, or null when unlimited
     * @param {object} options - The options object
     * @returns {number|null}
     */
    _getColumnLimit(options) {
        const raw = options['table-columns-limit'];
        if (raw === undefined || raw === null || raw === '') return null;
        const limit = Number(raw);
        return Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : null;
    }

    /**
     * Returns the output width, or 0 when unrestricted
     * @param {object} options - The options object
     * @param {object} context - The command context
     * @returns {number}
     */
    _getOutputWidth(options, context) {
        const outputWidth = options['output-width'];
        if (outputWidth === undefined || outputWidth === null || outputWidth === '') {
            return context.terminal ? context.terminal.getSize().columns : DEFAULT_OUTPUT_WIDTH;
        }
        if (String(outputWidth).toLowerCase() === 'unlimited' || Number(outputWidth) === 0) return 0;
        return Number(outputWidth);
    }

    /**
     * Returns the minimum spaces between columns in non-table mode
     * @param {object} options - The options object
     * @returns {number}
     */
    _getUseSpaces(options) {
        const useSpaces = options['use-spaces'];
        if (useSpaces === undefined || useSpaces === null || useSpaces === '') {
            return DEFAULT_COLUMN_SPACING;
        }
        const spacing = Number(useSpaces);
        return Number.isFinite(spacing) && spacing >= 0 ? spacing : DEFAULT_COLUMN_SPACING;
    }

    /**
     * Gets the lines from the content
     * @param {string} content - The content to split
     * @param {boolean} keepEmptyLines - Whether to keep empty lines
     * @returns {string[]} - The lines
     */
    _getLines(content, keepEmptyLines) {
        const lines = content.split(/\r?\n/);
        if (keepEmptyLines) return lines;
        return lines.filter(line => line.trim() !== '');
    }

    /**
     * Splits a line respecting quotes
     * @param {string} line - The line to split
     * @param {string|RegExp} separator - The separator to split on
     * @returns {string[]} - The array of parts
     */
    _splitLine(line, separator) {
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
                if (separator.includes(character)) matchedLength = 1;
            } else if (separator instanceof RegExp) {
                const match = separator.exec(line.slice(i));
                if (match && match.index === 0) matchedLength = match[0].length;
            }
            if (matchedLength) {
                if (current) {
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