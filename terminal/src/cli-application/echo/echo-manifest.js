export const ECHO_MANIFEST = {
    name: 'echo',
    version: '0.1.0',
    description: 'Displays the given text',
    type: 'cli',
    programs: [{
        name: 'echo',
        arguments: [
            {
                name: '<text>',
                description: 'The text to display, if not provided, the standard input will be used',
            }
        ]
    }]
}

export default ECHO_MANIFEST