export const MAKE_DIRECTORY_MANIFEST = {
    name: 'make-directory',
    version: '0.1.0',
    description: 'Creates a new directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'mkdir',
        aliases: ['md'],
        arguments: [
            {
                name: '<path>',
                description: 'The path to new directory',
            },
        ],
    }, {
        name: 'md',
        description: 'Creates a new directory (alias for mkdir)',
        arguments: [
            {
                name: '<path>',
                description: 'The path to new directory',
            },
        ],
    }]
}

export default MAKE_DIRECTORY_MANIFEST
