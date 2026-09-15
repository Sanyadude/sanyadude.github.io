export const ECHO_MANIFEST = {
    name: 'echo',
    version: '0.1.0',
    description: 'Displays the given text',
    type: 'cli',
    programs: [{
        name: 'echo',
        options: [
            {
                name: 'no-newline', short: 'n',
                description: 'Do not output the trailing newline',
            },
            {
                name: 'enable-escapes', short: 'e',
                description: 'Enable interpretation of backslash escapes',
            },
            {
                name: 'disable-escapes', short: 'E',
                description: 'Disable interpretation of backslash escapes (default)',
            },
        ],
        arguments: [
            {
                name: 'text', required: false, repeatable: true,
                description: 'The text to display, if not provided, the standard input will be used',
            }
        ]
    }]
}

export default ECHO_MANIFEST