export const CAT_MANIFEST = {
    name: 'cat',
    version: '0.1.0',
    description: 'Displays the contents of a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'cat',
        options: [
            {
                name: '-A, --show-all',
                description: 'Equivalent to -vET',
            },
            {
                name: '-b, --number-nonblank',
                description: 'Number non-blank output lines, overrides -n',
            },
            {
                name: '-e, --show-nonprinting-ends',
                description: 'Equivalent to -vE',
            },
            {
                name: '-E, --show-ends',
                description: 'Display $ at the end of each line',
            },
            {
                name: '-n, --number',
                description: 'Number all output lines',
            },
            {
                name: '-s, --squeeze-blank',
                description: 'Suppress repeated empty output lines',
            },
            {
                name: '-t, --show-nonprinting-tabs',
                description: 'Equivalent to -vT',
            },
            {
                name: '-T, --show-tabs',
                description: 'Display TAB characters as ^I',
            },
            {
                name: '-v, --show-nonprinting',
                description: 'Use ^ and M- notation, except for LFD and TAB',
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

export default CAT_MANIFEST
