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
                name: '-r, --recursive',
                description: 'Recursively remove directory and its contents',
            },
        ],
        arguments: [
            {
                name: '<directory_path>',
                description: 'The path to the directory',
            },
        ],
    }, {
        name: 'rd',
        description: 'Removes a directory (alias for rmdir)',
        options: [
            {
                name: '-r, --recursive',
                description: 'Recursively remove directory and its contents',
            },
        ],
        arguments: [
            {
                name: '<directory_path>',
                description: 'The path to the directory',
            },
        ],
    }]
}

export default REMOVE_DIRECTORY_MANIFEST
