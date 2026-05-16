export const FIND_MANIFEST = {
    name: 'find',
    version: '0.1.0',
    description: 'Searches for strings in files or standard input',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'findstr',
        description: 'Searches for strings in files or standard input using regular expressions',
        options: [
            {
                name: '-b, --beginning',
                description: 'Match when the search string is at the beginning of the line',
            },
            {
                name: '-e, --end',
                description: 'Match when the search string is at the end of the line',
            },
            {
                name: '-x, --exact',
                description: 'Search for the exact string',
            },
            {
                name: '-c, --count',
                description: 'Show only the number of matches',
            },
            {
                name: '-i, --ignore-case',
                description: 'Ignore case',
            },
            {
                name: '-v, --invert-match',
                description: 'Search all lines that do not contain the specified string',
            },
            {
                name: '-n, --line-number',
                description: 'Show file line number before each line',
            },
            {
                name: '-o, --offset',
                description: 'Show offset of the match before each line',
            },
            {
                name: '-l, --literal',
                description: 'Use search string literally',
            },
            {
                name: '-r, --regex',
                description: 'Use search string as regular expressions',
            },
        ],
        arguments: [
            {
                name: '<search_string>',
                description: 'The search string',
            },
            {
                name: '[<file_path>]',
                description: 'The path to the file to search in',
            },
        ],
    },
    {
        name: 'find',
        options: [
            {
                name: '-c, --count',
                description: 'Show only the number of matches',
            },
            {
                name: '-i, --ignore-case',
                description: 'Ignore case',
            },
            {
                name: '-v, --invert-match',
                description: 'Search all lines that do not contain the specified string',
            },
            {
                name: '-n, --line-number',
                description: 'Show file line number before each line',
            }
        ],
        arguments: [
            {
                name: '<search_string>',
                description: 'The search string',
            },
            {
                name: '[<file_path>]',
                description: 'The path to the file to search in',
            },
        ],
    }]
}

export default FIND_MANIFEST
