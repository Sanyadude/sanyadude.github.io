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
                name: 'count', short: 'c', long: 'count',
                description: 'Prefix lines by the number of occurrences',
            },
            {
                name: 'repeated', short: 'd', long: 'repeated',
                description: 'Show only duplicate lines (one per group)',
            },
            {
                name: 'all-duplicates', short: 'D',
                description: 'Show all duplicate lines',
            },
            {
                name: 'all-repeated', long: 'all-repeated', value: { name: 'method', required: true },
                description: 'Like -D, but allow separating groups with an empty line: none(default), prepend, separate'
            },
            {
                name: 'skip-fields', short: 'f', long: 'skip-fields', value: { name: 'number', required: true },
                description: 'Skip the first <number> fields when comparing lines',
            },
            {
                name: 'group', long: 'group', value: { name: 'method', required: true },
                description: 'Show all items, separating groups with an empty line: separate(default), prepend, append, both'
            },
            {
                name: 'ignore-case', short: 'i', long: 'ignore-case',
                description: 'Ignore case when comparing lines',
            },
            {
                name: 'skip-chars', short: 's', long: 'skip-chars', value: { name: 'number', required: true },
                description: 'Skip the first <number> characters when comparing lines',
            },
            {
                name: 'unique', short: 'u', long: 'unique',
                description: 'Show only unique lines',
            },
            {
                name: 'zero-terminated', short: 'z', long: 'zero-terminated',
                description: 'Line delimiter is NUL (ASCII 0), not newline',
            },
            {
                name: 'check-chars', short: 'w', long: 'check-chars', value: { name: 'number', required: true },
                description: 'Limit comparison to <number> characters',
            },
        ],
        arguments: [
            {
                name: 'file_path', required: false,
                description: 'The path to the file',
            }
        ]
    }]
}

export default UNIQ_MANIFEST