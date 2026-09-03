export const TERMINAL_SETTINGS_MANIFEST = {
    name: 'terminal-settings',
    version: '0.1.0',
    description: 'Change terminal settings',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'terminal',
        options: [
            { name: 'linux-prompt', short: 'L', long: 'linux-prompt', description: 'Set the prompt to linux style' },
            { name: 'windows-prompt', short: 'W', long: 'windows-prompt', description: 'Set the prompt to windows style' },
            { name: 'cursor-caret', short: 'C', long: 'cursor-caret', description: 'Set the cursor to caret' },
            { name: 'cursor-underline', short: 'U', long: 'cursor-underline', description: 'Set the cursor to underline' },
            { name: 'posix-syntax', short: 'P', long: 'posix-syntax', description: 'Set the shell syntax to POSIX/Unix' },
            { name: 'dos-syntax', short: 'D', long: 'dos-syntax', description: 'Set the shell syntax to Windows/DOS' },
            { name: 'theme', short: 't', long: 'theme', value: { name: 'option', required: true }, description: 'Set the theme or show info; options: list|test|current|default|<theme_name>' },
            { name: 'prev-theme', short: 'p', long: 'prev-theme', description: 'Sets the previous theme' },
            { name: 'next-theme', short: 'n', long: 'next-theme', description: 'Sets the next theme' },
            { name: 'scrollbar-use-theme', long: 'scrollbar-use-theme', description: 'Toggles whether the theme should be used for the scroll bar' },
            { name: 'debug', long: 'debug', description: 'Toggles whether the debug information should be shown' },
        ],
    }]
}

export default TERMINAL_SETTINGS_MANIFEST
