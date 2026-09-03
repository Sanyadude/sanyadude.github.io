export const COPY_MANIFEST = {
    name: 'copy',
    version: '0.1.0',
    description: 'Copies a file or directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'copy',
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
                description: 'Destination path, or directory when copying multiple sources',
            },
        ],
    }]
}

export default COPY_MANIFEST
