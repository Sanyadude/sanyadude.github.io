export const COPY_MANIFEST = {
    name: 'copy',
    version: '0.1.0',
    description: 'Copies a file or directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'copy',
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

export default COPY_MANIFEST
