export const MOVE_MANIFEST = {
    name: 'move',
    version: '0.1.0',
    description: 'Moves a file or directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'move',
        arguments: [
            {
                name: '<source_path>',
                description: 'The path to the source file or directory',
            },
            {
                name: '<destination_path>',
                description: 'The path to the destination directory',
            },
        ],
    }]
}

export default MOVE_MANIFEST
