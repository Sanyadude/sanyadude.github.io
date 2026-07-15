export const TERMINAL_SETTINGS_MANIFEST = {
    name: 'terminal-settings',
    version: '0.1.0',
    description: 'Change terminal settings',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'terminal',
        options: [
            { name: '-L, --linux-prompt', description: 'Set the prompt to linux style' },
            { name: '-W, --windows-prompt', description: 'Set the prompt to windows style' },
            { name: '-C, --cursor-caret', description: 'Set the cursor to caret' },
            { name: '-U, --cursor-underline', description: 'Set the cursor to underline' },
            { name: '-P, --posix-syntax', description: 'Set the shell syntax to POSIX/Unix' },
            { name: '-D, --dos-syntax', description: 'Set the shell syntax to Windows/DOS' },
            { name: '-t, --theme <option>', description: 'Set the theme or show info; options: list|test|current|default|<theme_name>' },
            { name: '-p, --prev-theme', description: 'Sets the previous theme' },
            { name: '-n, --next-theme', description: 'Sets the next theme' },
            { name: '--scrollbar-use-theme', description: 'Toggles whether the theme should be used for the scroll bar' },
            { name: '--debug', description: 'Toggles whether the debug information should be shown' },
        ],
    }]
}

export default TERMINAL_SETTINGS_MANIFEST
