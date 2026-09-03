export const REMOVE_DIRECTORY_MANIFEST = {
    name: 'remove-directory',
    version: '0.1.0',
    description: 'Removes a directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'rmdir',
        aliases: ['rd'],
        options: [
            {
                name: 'recursive', short: 'S',
                description: 'Remove the directory tree including all contents',
            },
        ],
        arguments: [
            {
                name: 'directory_path', required: true, repeatable: true,
                description: 'The path to the directory(ies)',
            },
        ],
    }, {
        name: 'rd',
        description: 'Removes a directory (alias for rmdir)',
        options: [
            {
                name: 'recursive', short: 'S',
                description: 'Remove the directory tree including all contents',
            },
        ],
        arguments: [
            {
                name: 'directory_path', required: true, repeatable: true,
                description: 'The path to the directory(ies)',
            },
        ],
    }]
}

export default REMOVE_DIRECTORY_MANIFEST
