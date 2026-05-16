export const DELETE_FILE_MANIFEST = {
    name: 'delete-file',
    version: '0.1.0',
    description: 'Deletes a file',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'del',
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file',
            },
        ],
    }]
}

export default DELETE_FILE_MANIFEST
