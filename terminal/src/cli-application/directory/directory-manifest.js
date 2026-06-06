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
                name: '-h, --hidden',
                description: 'Display hidden files and directories',
            },
            {
                name: '-d, --directories',
                description: 'Display directories only',
            },
            {
                name: '-f, --files',
                description: 'Display files only',
            },
            {
                name: '-c, --thousand-separator',
                description: 'Display the thousand separator in file sizes',
            },
            {
                name: '-b, --bare',
                description: 'Use bare format',
            },
            {
                name: '-l, --lowercase',
                description: 'Use lowercase names',
            },
            {
                name: '-s, --sort <field>',
                description: 'Sort the entries by name, size, or date',
            }
        ]
    }]
}

export default DIRECTORY_MANIFEST
