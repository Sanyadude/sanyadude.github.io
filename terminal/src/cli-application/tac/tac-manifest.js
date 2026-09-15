export const TAC_MANIFEST = {
    name: 'tac',
    version: '0.1.0',
    description: 'Displays the contents of a file in reverse order',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'tac',
        options: [
            {
                name: 'before', short: 'b', long: 'before',
                description: 'Attach the separator to the beginning of the record',
            },
            {
                name: 'regex', short: 'r', long: 'regex',
                description: 'Interpret the separator as a regular expression',
            },
            {
                name: 'separator', short: 's', long: 'separator', value: { name: 'separator', required: true },
                description: 'Use <separator> instead of newline characters',
            }
        ],
        arguments: [
            {
                name: 'file_path', required: false, repeatable: true,
                description: 'The path to the file(s)',
            },
        ],
    }]
}

export default TAC_MANIFEST