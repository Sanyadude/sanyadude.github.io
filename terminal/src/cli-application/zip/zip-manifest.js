export const ZIP_MANIFEST = {
    name: 'zip',
    version: '0.1.0',
    description: 'Zip a file or directory',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'zip',
        options: [
            {
                name: '-f, --force',
                description: 'Force to overwrite the existing zip file if it exists',
            },
        ],
        arguments: [
            {
                name: '<path>',
                description: 'The path to the file or directory to zip',
            },
            {
                name: '[<zip_name>]',
                description: 'The name of the zip file',
            },
        ],
    }]
}

export default ZIP_MANIFEST
