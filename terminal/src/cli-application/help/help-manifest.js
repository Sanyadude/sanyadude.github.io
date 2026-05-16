export const HELP_MANIFEST = {
    name: 'help',
    version: '0.1.0',
    description: 'List all available commands or shows help for a specific command',
    type: 'cli',
    dependencies: ['shell'],
    programs: [{
        name: 'help',
        arguments: [
            {
                name: '<command_name>',
                description: 'The command to show help for',
            },
        ],
    }]
}

export default HELP_MANIFEST
