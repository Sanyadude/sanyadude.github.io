export const PASSWD_MANIFEST = {
    name: 'passwd',
    version: '0.1.0',
    description: 'Changes the password for a user',
    type: 'cli',
    dependencies: ['userManager', 'authenticationManager', 'shell'],
    programs: [{
        name: 'passwd',
        description: 'Changes the password for a user',
        options: [
            {
                name: 'delete', short: 'd', long: 'delete',
                description: 'Delete the password for the user',
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

export default PASSWD_MANIFEST