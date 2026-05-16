export const ALIAS_MANIFEST = {
    name: 'alias',
    version: '0.1.0',
    description: 'Creates or manages aliases for shell commands',
    type: 'cli',
    dependencies: ['shell'],
    programs: [{
        name: 'alias',
        description: 'Creates an alias for shell commands',
        arguments: [
            {
                name: '<name_command_pair>',
                description: 'The name and command in format: name=command for creating an alias',
            }
        ]
    }, {
        name: 'unalias',
        description: 'Removes an alias for shell commands',
        options: [
            {
                name: '-a, --all',
                description: 'Removes all aliases',
            }
        ],
        arguments: [
            {
                name: '<name>',
                description: 'The alias to remove',
            }
        ]
    }]
}

export default ALIAS_MANIFEST
