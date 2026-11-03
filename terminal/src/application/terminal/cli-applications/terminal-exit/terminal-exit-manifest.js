export const TERMINAL_EXIT_MANIFEST = {
    name: 'terminal-exit',
    version: '0.1.0',
    description: 'Closes the terminal',
    type: 'cli',
    dependencies: ['shell'],
    programs: [{
        name: 'exit',
    }]
}

export default TERMINAL_EXIT_MANIFEST
