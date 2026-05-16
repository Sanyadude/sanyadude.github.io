export const SORT_MANIFEST = {
    name: 'sort',
    version: '0.1.0',
    description: 'Sorts lines of text',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'sort',
        options: [
            {
                name: '-b, --ignore-leading-blanks',
                description: 'Ignore leading blanks when sorting',
            },
            {
                name: '-d, --dictionary-order',
                description: 'Consider only blanks and alphanumeric characters',
            },
            {
                name: '-f, --ignore-case',
                description: 'Fold lower case to upper case characters',
            },
            {
                name: '-g, --general-numeric-sort',
                description: 'Compares according to general numerical value',
            },
            {
                name: '-i, --ignore-nonprinting',
                description: 'Consider only printable characters',
            },
            {
                name: '-n, --numeric',
                description: 'Compare according to string numerical value',
            },
            {
                name: '-R, --random-sort',
                description: 'Sort by random hash of keys',
            },
            {
                name: '-r, --reverse',
                description: 'Reverse the result of comparisons',
            },
        ],
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file to sort',
            }
        ]
    }]
}

export default SORT_MANIFEST