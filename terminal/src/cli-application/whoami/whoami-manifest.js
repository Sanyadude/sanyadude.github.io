export const WHOAMI_MANIFEST = {
    name: 'whoami',
    version: '0.1.0',
    description: 'Prints the current user name',
    type: 'cli',
    dependencies: ['systemUser'],
    programs: [{
        name: 'whoami',
        description: 'Prints the current user name',
    }]
}

export default WHOAMI_MANIFEST