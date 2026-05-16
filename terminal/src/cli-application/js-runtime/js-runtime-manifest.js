export const JS_RUNTIME_MANIFEST = {
    name: 'js-runtime',
    version: '0.1.0',
    description: 'A runtime for running JavaScript code',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'js',
        arguments: [
            {
                name: '<code>',
                description: 'The JavaScript code to run',
            },
            {
                name: '<file_path>',
                description: 'The path to the JavaScript file to run',
            },
        ],
    }]
}

export default JS_RUNTIME_MANIFEST
