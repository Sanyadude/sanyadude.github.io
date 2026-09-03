export const YES_MANIFEST = {
    name: 'yes',
    version: '0.1.0',
    description: 'Repeatedly outputs a line until interrupted',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'yes',
        arguments: [
            {
                name: 'text', required: false, repeatable: true,
                description: 'The text to repeat (default: y)',
            }
        ]
    }]
}

export default YES_MANIFEST
