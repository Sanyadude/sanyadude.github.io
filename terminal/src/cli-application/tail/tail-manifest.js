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
                name: 'bytes', short: 'c', long: 'bytes', value: { name: 'number', required: true },
                description: 'Display the last <number> bytes of the file',
                defaultValue: DEFAULT_BYTES_NUMBER,
            },
            {
                name: 'lines', short: 'n', long: 'lines', value: { name: 'number', required: true },
                description: 'Display the last <number> lines from the file',
                defaultValue: DEFAULT_LINES_NUMBER,
            },
            {
                name: 'quiet', short: 'q', long: 'quiet',
                description: 'Never display file names',
            },
            {
                name: 'verbose', short: 'v', long: 'verbose',
                description: 'Always display file names',
            },
            {
                name: 'zero-terminated', short: 'z', long: 'zero-terminated',
                description: 'Line delimiter is NUL (ASCII 0), not newline',
            }
        ],
        arguments: [
            {
                name: 'file_path', required: true, repeatable: true,
                description: 'The path to the file(s)',
            }
        ]
    }]
}

export default TAIL_MANIFEST