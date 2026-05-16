export const TERMINAL_HISTORY_MANIFEST = {
    name: 'terminal-history',
    version: '0.1.0',
    description: 'Shows the history of commands entered in the terminal',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'history',
    }]
}

export default TERMINAL_HISTORY_MANIFEST
