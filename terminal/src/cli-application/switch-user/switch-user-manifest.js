export const SWITCH_USER_MANIFEST = {
    name: 'switch-user',
    version: '0.1.0',
    description: 'Switches the current user',
    type: 'cli',
    dependencies: ['shell', 'authenticationManager'],
    programs: [{
        name: 'su',
        description: 'Switches the current user and moves to that user\'s home directory',
        arguments: [
            {
                name: 'name', required: true,
                description: 'The user to switch to',
            }
        ]
    }]
}

export default SWITCH_USER_MANIFEST