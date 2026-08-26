export const TAC_MANIFEST = {
    name: 'tac',
    version: '0.1.0',
    description: 'Displays the contents of a file in reverse order',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'tac',
        options: [
            {
                name: '-b, --before',
                description: 'Attach the separator to the beginning of the record',
            },
            {
                name: '-r, --regex',
                description: 'Interpret the separator as a regular expression',
            },
            {
                name: '-s, --separator <separator>',
                description: 'Use <separator> instead of newline characters',
            }
        ],
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file',
            },
        ],
    }]
}

export default TAC_MANIFEST
