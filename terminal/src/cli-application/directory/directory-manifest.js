export const DIRECTORY_MANIFEST = {
    name: 'directory',
    version: '0.1.0',
    description: 'Lists directory contents',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'dir',
        options: [
            {
                name: '-l, --list',
                description: 'Show as short list',
            },
            {
                name: '-a, --all',
                description: 'Show all entries (including hidden)',
            },
        ]
    }]
}

export default DIRECTORY_MANIFEST
