export const GROUPS_MANIFEST = {
    name: 'groups',
    version: '0.1.0',
    description: 'Prints the group for a user',
    type: 'cli',
    dependencies: ['userManager'],
    programs: [{
        name: 'groups',
        description: 'Prints the group for a user',
        arguments: [
            {
                name: 'name', required: false,
                description: 'The user whose group to print. Defaults to the current user',
            }
        ]
    }]
}

export default GROUPS_MANIFEST