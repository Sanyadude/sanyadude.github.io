export const DECLARE_MANIFEST = {
    name: 'declare',
    version: '0.1.0',
    description: 'Declares variables for shell commands',
    type: 'cli',
    dependencies: ['shell'],
    programs: [{
        name: 'declare',
        description: 'Declares a variable for shell commands',
        arguments: [
            {
                name: 'name_value_pair', required: true,
                description: 'The name and value in format: name=value for declaring a variable',
            }
        ]
    }, {
        name: 'unset',
        description: 'Unsets a variable for shell commands',
        options: [
            {
                name: 'all', short: 'a', long: 'all',
                description: 'Unsets all variables',
            }
        ],
        arguments: [
            {
                name: 'name', required: true,
                description: 'The variable to unset',
            }
        ]
    }]
}

export default DECLARE_MANIFEST