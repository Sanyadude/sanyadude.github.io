export const HOSTNAME_MANIFEST = {
    name: 'hostname',
    version: '0.1.0',
    description: 'Prints the current host name',
    type: 'cli',
    dependencies: ['systemHost'],
    programs: [{
        name: 'hostname',
        description: 'Prints the current host name',
    }]
}

export default HOSTNAME_MANIFEST