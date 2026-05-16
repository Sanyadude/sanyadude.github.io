export const UNIQ_MANIFEST = {
    name: 'uniq',
    version: '0.1.0',
    description: 'Filters out duplicate lines from a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'uniq',
        options: [
            {
                name: '-c, --count',
                description: 'Prefix lines by the number of occurrences',
            },
            {
                name: '-d, --duplicates',
                description: 'Show only duplicate lines',
            },
            {
                name: '-u, --unique',
                description: 'Show only unique lines',
            },
            {
                name: '-i, --ignore-case',
                description: 'Ignore case when comparing lines',
            },
            {
                name: '-f, --skip-fields <number>',
                description: 'Skip the first <number> fields when comparing lines',
            },
            {
                name: '-s, --skip-chars <number>',
                description: 'Skip the first <number> characters when comparing lines',
            },
            {
                name: '-w, --check-chars <number>',
                description: 'Limit comparison to <number> characters',
            },
        ],
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file',
            }
        ]
    }]
}

export default UNIQ_MANIFEST