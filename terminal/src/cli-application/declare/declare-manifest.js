export const DECLARE_MANIFEST = {
    name: 'declare',
    version: '0.1.0',
    description: 'Declares variables for shell commands',
    type: 'cli',
    dependencies: ['shell'],
    programs: [{
        name: 'declare',
        description: 'Declares a variable for shell',
        arguments: [
            {
                name: '<name_value_pair>',
                description: 'The name and value in format: name=value for declaring a variable',
            }
        ]
    }, {
        name: 'unset',
        description: 'Unsets a variable for shell commands',
        options: [
            {
                name: '-a, --all',
                description: 'Unsets all variables',
            }
        ],
        arguments: [
            {
                name: '<name>',
                description: 'The variable to unset',
            }
        ]
    }]
}

export default DECLARE_MANIFEST
