export const TERMINAL_CLEAR_MANIFEST = {
    name: 'terminal-clear',
    version: '0.1.0',
    description: 'Clears the terminal screen',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'clear',
    }]
}

export default TERMINAL_CLEAR_MANIFEST
