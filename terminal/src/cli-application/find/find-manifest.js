export const FIND_MANIFEST = {
    name: 'find',
    version: '0.1.0',
    description: 'Searches for strings in files or standard input',
    type: 'cli',
    dependencies: ['fileSystemManager', 'fileSystemExplorer'],
    programs: [{
        name: 'find',
        options: [
            {
                name: 'invert-match', short: 'V',
                description: 'Search all lines that do not contain the specified string',
            },
            {
                name: 'count', short: 'C',
                description: 'Show only the number of matches',
            },
            {
                name: 'line-number', short: 'N',
                description: 'Show file line number before each line',
            },
            {
                name: 'ignore-case', short: 'I',
                description: 'Ignore case',
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

export default FIND_MANIFEST