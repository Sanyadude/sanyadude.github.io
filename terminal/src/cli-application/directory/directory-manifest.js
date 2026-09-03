export const DIRECTORY_MANIFEST = {
    name: 'directory',
    version: '0.1.0',
    description: 'Lists directory contents',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager', 'terminal'],
    programs: [{
        name: 'dir',
        options: [
            {
                name: 'attributes', short: 'A', value: { name: 'attributes', required: false },
                description: 'Display entries with specified attributes: D directories, H hidden, R read-only; prefix - to exclude',
            },
            {
                name: 'bare', short: 'B',
                description: 'Use bare format',
            },
            {
                name: 'thousands', short: 'C',
                description: 'Display the thousand separator in file sizes',
            },
            {
                name: 'column', short: 'D',
                description: 'Display in wide format, sorted by column',
            },
            {
                name: 'lowercase', short: 'L',
                description: 'Use lowercase names',
            },
            {
                name: 'sort', short: 'O', value: { name: 'sort_orders', required: true },
                description: 'Sort by N name, S size, D date, E extension, G directories first; prefix - to reverse',
            },
            {
                name: 'owner', short: 'Q',
                description: 'Display the owner of the file',
            },
            {
                name: 'recursive', short: 'S',
                description: 'Display files in the specified directory and all subdirectories',
            },
            {
                name: 'time', short: 'T', value: { name: 'time_field', required: true },
                description: 'Time field displayed and used for sorting: C creation, A last access, W last written',
            },
            {
                name: 'wide', short: 'W',
                description: 'Display in wide format',
            },
            {
                name: 'four-digit-year', short: '4',
                description: 'Display four-digit years',
            }
        ],
        arguments: [
            {
                name: 'path', required: false,
                description: 'The path to directory',
            }
        ]
    }]
}

export default DIRECTORY_MANIFEST
