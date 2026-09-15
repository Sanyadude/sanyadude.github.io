export const FINDSTR_MANIFEST = {
    name: 'findstr',
    version: '0.1.0',
    description: 'Searches for strings in files or standard input using regular expressions',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'findstr',
        description: 'Searches for strings in files or standard input using regular expressions',
        options: [
            {
                name: 'beginning', short: 'B',
                description: 'Match when the search string is at the beginning of the line',
            },
            {
                name: 'end', short: 'E',
                description: 'Match when the search string is at the end of the line',
            },
            {
                name: 'literal', short: 'L',
                description: 'Use search string literally',
            },
            {
                name: 'regex', short: 'R',
                description: 'Use search string as regular expressions',
            },
            {
                name: 'recursive', short: 'S',
                description: 'Search for matching files in the current directory and all subdirectories',
            },
            {
                name: 'ignore-case', short: 'I',
                description: 'Ignore case',
            },
            {
                name: 'exact', short: 'X',
                description: 'Search for the exact string',
            },
            {
                name: 'invert-match', short: 'V',
                description: 'Search all lines that do not contain the specified string',
            },
            {
                name: 'count', short: 'C',
                description: 'Show only the number of matches',
            },
            {
                name: 'filename-only', short: 'M',
                description: 'Print only the filename if a file contains a match',
            },
            {
                name: 'line-number', short: 'N',
                description: 'Show file line number before each line',
            },
            {
                name: 'offset', short: 'O',
                description: 'Show offset of the match before each line',
            },
        ],
        arguments: [
            {
                name: 'search_string', required: true,
                description: 'The search string',
            },
            {
                name: 'file_path', required: false, repeatable: true,
                description: 'The path to the file(s) to search in',
            },
        ],
    }]
}

export default FINDSTR_MANIFEST