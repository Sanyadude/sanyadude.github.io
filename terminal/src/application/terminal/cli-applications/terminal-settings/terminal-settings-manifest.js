export const TERMINAL_SETTINGS_MANIFEST = {
    name: 'terminal-settings',
    version: '0.1.0',
    description: 'Change terminal settings',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'terminal',
        options: [
            { name: '-l, --linux-prompt', description: 'Set the prompt to linux style' },
            { name: '-w, --windows-prompt', description: 'Set the prompt to windows style' },
            { name: '-c, --cursor-caret', description: 'Set the cursor to caret' },
            { name: '-u, --cursor-underline', description: 'Set the cursor to underline' },
            { name: '-t, --theme <option>', description: 'Set the theme or show info; options: list|test|current|default|<theme_name>' },
            { name: '-p, --prev-theme', description: 'Sets the previous theme' },
            { name: '-n, --next-theme', description: 'Sets the next theme' },
            { name: '--scrollbar-use-theme', description: 'Toggles whether the theme should be used for the scroll bar' },
            { name: '--debug', description: 'Toggles whether the debug information should be shown' },
        ],
    }]
}

export default TERMINAL_SETTINGS_MANIFEST
