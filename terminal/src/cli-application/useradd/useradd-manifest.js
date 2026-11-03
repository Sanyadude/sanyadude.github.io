export const USERADD_MANIFEST = {
    name: 'useradd',
    version: '0.1.0',
    description: 'Adds a user and creates a home directory',
    type: 'cli',
    dependencies: ['userManager', 'fileSystemManager'],
    programs: [{
        name: 'useradd',
        description: 'Adds a user and creates a home directory',
        options: [
            {
                name: 'group', short: 'g', long: 'gid',
                value: { name: 'group', required: true },
                description: 'Name or number of primary group. The group must already exist',
            },
            {
                name: 'groups', short: 'G', long: 'groups',
                value: { name: 'groups', required: true },
                description: 'List of supplementary groups. List separated by commas',
            }
        ],
        arguments: [
            {
                name: 'name', required: true,
                description: 'The user name',
            }
        ]
    }]
}

export default USERADD_MANIFEST