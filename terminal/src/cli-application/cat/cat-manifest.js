export const CAT_MANIFEST = {
    name: 'cat',
    version: '0.1.0',
    description: 'Displays the contents of a file',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'cat',
        options: [
            {
                name: 'show-all', short: 'A', long: 'show-all',
                description: 'Equivalent to -vET',
            },
            {
                name: 'number-nonblank', short: 'b', long: 'number-nonblank',
                description: 'Number non-blank output lines, overrides -n',
            },
            {
                name: 'show-nonprinting-ends', short: 'e',
                description: 'Equivalent to -vE',
            },
            {
                name: 'show-ends', short: 'E', long: 'show-ends',
                description: 'Display $ at the end of each line',
            },
            {
                name: 'number', short: 'n', long: 'number',
                description: 'Number all output lines',
            },
            {
                name: 'squeeze-blank', short: 's', long: 'squeeze-blank',
                description: 'Suppress repeated empty output lines',
            },
            {
                name: 'show-nonprinting-tabs', short: 't',
                description: 'Equivalent to -vT',
            },
            {
                name: 'show-tabs', short: 'T', long: 'show-tabs',
                description: 'Display TAB characters as ^I',
            },
            {
                name: 'show-nonprinting', short: 'v', long: 'show-nonprinting',
                description: 'Use ^ and M- notation, except for LFD and TAB',
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

export default CAT_MANIFEST