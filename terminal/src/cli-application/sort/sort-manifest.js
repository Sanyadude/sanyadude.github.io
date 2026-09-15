export const SORT_MANIFEST = {
    name: 'sort',
    version: '0.1.0',
    description: 'Sorts lines of text',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'sort',
        options: [
            {
                name: 'ignore-leading-blanks', short: 'b', long: 'ignore-leading-blanks',
                description: 'Ignore leading blanks when sorting',
            },
            {
                name: 'dictionary-order', short: 'd', long: 'dictionary-order',
                description: 'Consider only blanks and alphanumeric characters',
            },
            {
                name: 'ignore-case', short: 'f', long: 'ignore-case',
                description: 'Fold lower case to upper case characters',
            },
            {
                name: 'general-numeric-sort', short: 'g', long: 'general-numeric-sort',
                description: 'Compares according to general numerical value',
            },
            {
                name: 'human-numeric-sort', short: 'h', long: 'human-numeric-sort',
                description: 'Compare human readable numbers (e.g., 2K 1G)',
            },
            {
                name: 'ignore-nonprinting', short: 'i', long: 'ignore-nonprinting',
                description: 'Consider only printable characters',
            },
            {
                name: 'month-sort', short: 'M', long: 'month-sort',
                description: 'Compare (unknown) < JAN < ... < DEC',
            },
            {
                name: 'numeric-sort', short: 'n', long: 'numeric-sort',
                description: 'Compare according to string numerical value',
            },
            {
                name: 'random-sort', short: 'R', long: 'random-sort',
                description: 'Sort by random hash of keys',
            },
            {
                name: 'reverse', short: 'r', long: 'reverse',
                description: 'Reverse the result of comparisons',
            },
            {
                name: 'sort', long: 'sort', value: { name: 'sort_type', required: true },
                description: 'Sort according to <sort_type>: general-numeric (-g), human-numeric (-h), month (-M), numeric (-n), random (-R), version (-V), string',
            },
            {
                name: 'version-sort', short: 'V', long: 'version-sort',
                description: 'Natural sort of (version) numbers within text',
            },
        ],
        arguments: [
            {
                name: 'file_path', required: false, repeatable: true,
                description: 'The path to the file(s)',
            }
        ]
    }]
}

export default SORT_MANIFEST