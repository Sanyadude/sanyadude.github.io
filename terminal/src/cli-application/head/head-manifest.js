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
                name: 'bytes', short: 'c', long: 'bytes', value: { name: 'number', required: true },
                description: 'Display the first <number> bytes of the file',
                defaultValue: DEFAULT_BYTES_NUMBER,
            },
            {
                name: 'lines', short: 'n', long: 'lines', value: { name: 'number', required: true },
                description: 'Display the first <number> lines from the file',
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

export default HEAD_MANIFEST