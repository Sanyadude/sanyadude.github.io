export const TYPE_MANIFEST = {
    name: 'type',
    version: '0.1.0',
    description: 'Displays the contents of a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'type',
        arguments: [
            {
                name: 'file_path', required: true, repeatable: true,
                description: 'The path to the file(s)',
            },
        ],
    }]
}

export default TYPE_MANIFEST