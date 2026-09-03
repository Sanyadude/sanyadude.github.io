export const DELETE_FILE_MANIFEST = {
    name: 'delete-file',
    version: '0.1.0',
    description: 'Deletes a file',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'del',
        aliases: ['erase'],
        arguments: [
            {
                name: 'file_path', required: true, repeatable: true,
                description: 'The path to the file(s)',
            },
        ],
    }, 
    {
        name: 'erase',
        description: 'Deletes a file (alias for del)',
        arguments: [
            {
                name: 'file_path', required: true, repeatable: true,
                description: 'The path to the file(s)',
            },
        ],
    }]
}

export default DELETE_FILE_MANIFEST
