export const REV_MANIFEST = {
    name: 'rev',
    version: '0.1.0',
    description: 'Reverse the order of characters in each line of input',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'rev',
        options: [
            {
                name: 'zero', short: '0', long: 'zero',
                description: 'Use NUL (ASCII 0) as line separator',
            }
        ],
        arguments: [
            {
                name: 'file_path', required: false, repeatable: true,
                description: 'The path to the file(s)',
            }
        ]
    }]
}

export default REV_MANIFEST