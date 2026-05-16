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
                name: '-c, --columns <columns>',
                description: 'Formats output to fit within specified number of columns',
            },
            {
                name: '-s, --separator <separator>',
                description: 'Specify a set of characters to be used to delimit columns',
                defaultValue: ' ',
            },
            {
                name: '-t, --table',
                description: 'Creates a table from the input',
            },
            {
                name: '-e, --empty-lines',
                description: 'Preserve empty lines in the output',
            },
            {
                name: '-x, --column-first',
                description: 'Fill columns first, then rows',
            },
            {
                name: '-n, --no-merge',
                description: 'Do not merge delimiters',
            }
        ],
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file to format',
            },
        ],
    }]
}

export default COLUMN_MANIFEST