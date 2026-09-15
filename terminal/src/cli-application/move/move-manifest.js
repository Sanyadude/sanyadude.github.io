export const MOVE_MANIFEST = {
    name: 'move',
    version: '0.1.0',
    description: 'Moves a file or directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'move',
        options: [
            {
                name: 'overwrite', short: 'Y',
                description: 'Overwrite the destination if it already exists',
            },
        ],
        arguments: [
            {
                name: 'source_path', required: true, repeatable: true,
                description: 'Source path(s)',
            },
            {
                name: 'destination_path', required: true,
                description: 'Destination path, or directory when moving multiple sources',
            },
        ],
    }]
}

export default MOVE_MANIFEST