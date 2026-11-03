export const GROUPADD_MANIFEST = {
    name: 'groupadd',
    version: '0.1.0',
    description: 'Adds a group',
    type: 'cli',
    dependencies: ['userManager'],
    programs: [{
        name: 'groupadd',
        description: 'Adds a group',
        options: [
            {
                name: 'users', short: 'U', long: 'users',
                value: { name: 'users', required: true },
                description: 'List of users to add as members. List separated by commas',
            },
        ],
        arguments: [
            {
                name: 'name', required: true,
                description: 'The group name',
            }
        ]
    }]
}

export default GROUPADD_MANIFEST;
