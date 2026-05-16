import { DEFAULT_LINES_NUMBER, DEFAULT_BYTES_NUMBER } from './config.js'

export const TAIL_MANIFEST = {
    name: 'tail',
    version: '0.1.0',
    description: 'Displays the last part of a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'tail',
        options: [
            {
                name: '-n, --lines <number>',
                description: 'Display the last <number> lines from the file',
                defaultValue: DEFAULT_LINES_NUMBER,
            },
            {
                name: '-c, --bytes <number>',
                description: 'Display the last <number> bytes of the file',
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

export default TAIL_MANIFEST