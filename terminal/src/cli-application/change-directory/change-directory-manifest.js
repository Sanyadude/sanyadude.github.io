export const CHANGE_DIRECTORY_MANIFEST = {
    name: 'change-directory',
    version: '0.1.0',
    description: 'Changes the current directory',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'chdir',
        aliases: ['cd'],
        arguments: [
            {
                name: '<directory_path>',
                description: 'The path to the directory',
            }
        ]
    },
    {
        name: 'cd',
        description: 'Changes the current directory (alias for chdir)',
        arguments: [
            {
                name: '<directory_path>',
                description: 'The path to the directory',
            }
        ]
    }]
}

export default CHANGE_DIRECTORY_MANIFEST