export const ID_MANIFEST = {
    name: 'id',
    version: '0.1.0',
    description: 'Prints the user and group',
    type: 'cli',
    dependencies: ['userManager'],
    programs: [{
        name: 'id',
        description: 'Prints the user and group',
        options: [
            {
                name: 'group', short: 'g', long: 'group',
                description: 'Print only group ID',
            },
            {
                name: 'groups', short: 'G', long: 'groups',
                description: 'Print all group IDs',
            },
            {
                name: 'name', short: 'n', long: 'name',
                description: 'Print a name instead of a number, for -u,-g,-G',
            },
            {
                name: 'user', short: 'u', long: 'user',
                description: 'Print only user ID',
            },
            {
                name: 'zero', short: 'z', long: 'zero',
                description: 'Delimit entries with NUL (ASCII 0) character',
            }
        ],
        arguments: [
            {
                name: 'name', required: false,
                description: 'The user to describe. Defaults to the current user',
            }
        ]
    }]
}

export default ID_MANIFEST