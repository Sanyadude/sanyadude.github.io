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
                name: 'name_command_pair', required: true,
                description: 'The name and command in format: name=command for creating an alias',
            }
        ]
    }, {
        name: 'unalias',
        description: 'Removes an alias for shell commands',
        options: [
            {
                name: 'all', short: 'a', long: 'all',
                description: 'Removes all aliases',
            }
        ],
        arguments: [
            {
                name: 'name', required: true,
                description: 'The alias to remove',
            }
        ]
    }]
}

export default ALIAS_MANIFEST
