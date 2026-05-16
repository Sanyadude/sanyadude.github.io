export const DOWNLOAD_MANIFEST = {
    name: 'download',
    version: '0.1.0',
    description: 'Download a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'dl',
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file',
            },
        ],
    }]
}

export default DOWNLOAD_MANIFEST
