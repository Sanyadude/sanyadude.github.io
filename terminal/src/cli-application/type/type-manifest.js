export const TYPE_MANIFEST = {
    name: 'type',
    version: '0.1.0',
    description: 'Displays the contents of a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'type',
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file',
            },
        ],
    }]
}

export default TYPE_MANIFEST
