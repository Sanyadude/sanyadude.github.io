import { DEFAULT_COLUMN_SPACING, DEFAULT_OUTPUT_SEPARATOR } from './config.js'

export const COLUMN_MANIFEST = {
    name: 'column',
    version: '0.1.0',
    description: 'Formats the output into multiple columns',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer', 'terminal'],
    programs: [{
        name: 'column',
        description: 'Formats the output into multiple columns',
        options: [
            {
                name: 'output-width', short: 'c', long: 'output-width', value: { name: 'columns', required: true },
                description: 'Formats output to fit within specified number of columns. Use 0 or unlimited for no limit',
            },
            {
                name: 'table-noheadings', short: 'd', long: 'table-noheadings',
                description: 'Do not print the table header',
            },
            {
                name: 'output-separator', short: 'o', long: 'output-separator', value: { name: 'string', required: true },
                description: 'Column delimiter for table output',
                defaultValue: DEFAULT_OUTPUT_SEPARATOR,
            },
            {
                name: 'separator', short: 's', long: 'separator', value: { name: 'separator', required: true },
                description: 'Specify a set of characters to be used to delimit columns',
                defaultValue: ' ',
            },
            {
                name: 'use-spaces', short: 'S', long: 'use-spaces', value: { name: 'number', required: true },
                description: 'Minimum spaces between columns when not in table mode',
                defaultValue: DEFAULT_COLUMN_SPACING,
            },
            {
                name: 'table', short: 't', long: 'table',
                description: 'Creates a table from the input',
            },
            {
                name: 'table-columns', short: 'N', long: 'table-columns', value: { name: 'names', required: true },
                description: 'Comma-separated column names for the table header',
            },
            {
                name: 'table-columns-limit', short: 'l', long: 'table-columns-limit', value: { name: 'number', required: true },
                description: 'Maximum number of input columns; leftover data goes in the last column',
            },
            {
                name: 'table-right', short: 'R', long: 'table-right', value: { name: 'columns', required: true },
                description: 'Right-align text in the specified columns',
            },
            {
                name: 'table-header-as-columns', short: 'K', long: 'table-header-as-columns',
                description: 'Use the first input line as table header',
            },
            {
                name: 'table-hide', short: 'H', long: 'table-hide', value: { name: 'columns', required: true },
                description: 'Do not print the specified columns (names or 1-based indices)',
            },
            {
                name: 'table-order', short: 'O', long: 'table-order', value: { name: 'columns', required: true },
                description: 'Output column order (names or 1-based indices)',
            },
            {
                name: 'table-maxout', short: 'm', long: 'table-maxout',
                description: 'Fill all available space on output',
            },
            {
                name: 'keep-empty-lines', short: 'L', long: 'keep-empty-lines',
                description: 'Preserve empty lines in the output',
            },
            {
                name: 'fillrows', short: 'x', long: 'fillrows',
                description: 'Fill rows first, then columns',
            }
        ],
        arguments: [
            {
                name: 'file_path', required: true,
                description: 'The path to the file to format',
            },
        ],
    }]
}

export default COLUMN_MANIFEST