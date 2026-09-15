export const STEAM_LOCOMOTIVE_MANIFEST = {
    name: 'steam-locomotive',
    version: '0.1.0',
    description: 'Displays animations aimed to correct users who accidentally enter sl instead of ls',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'sl',
        description: 'Displays animations aimed to correct users who accidentally enter sl instead of ls. SL stands for Steam Locomotive',
        options: [
            {
                name: 'accident', short: 'a',
                description: 'An accident is occurring. People cry for help.',
            },
            {
                name: 'c51', short: 'c',
                description: 'Show c51 instead of d51',
            },
            {
                name: 'escape', short: 'e',
                description: 'Escape. Allow interrupt by Ctrl+C.',
            },
            {
                name: 'fly', short: 'F',
                description: 'It flies like the galaxy express 999.',
            },
            {
                name: 'little', short: 'l',
                description: 'Show little version',
            },
        ],
    }]
}

export default STEAM_LOCOMOTIVE_MANIFEST