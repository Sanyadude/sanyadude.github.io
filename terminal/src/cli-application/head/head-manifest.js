import { DEFAULT_LINES_NUMBER, DEFAULT_BYTES_NUMBER } from './config.js'

export const HEAD_MANIFEST = {
    name: 'head',
    version: '0.1.0',
    description: 'Displays the first part of a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'head',
        options: [
            {
                name: '-n, --lines <number>',
                description: 'Display the first <number> lines from the file',
                defaultValue: DEFAULT_LINES_NUMBER,
            },
            {
                name: '-c, --bytes <number>',
                description: 'Display the first <number> bytes of the file',
                defaultValue: DEFAULT_BYTES_NUMBER,
            },
            {
                name: '-q, --quiet',
                description: 'Never display file names',
            },
            {
                name: '-v, --verbose',
                description: 'Always display file names',
            }
        ],
        arguments: [
            {
                name: '<file_path>',
                description: 'The file to display',
            }
        ]
    }]
}

export default HEAD_MANIFEST