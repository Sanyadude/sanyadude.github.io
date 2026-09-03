import { DEFAULT_SPREAD, DEFAULT_FREQ, DEFAULT_SEED, DEFAULT_ANIMATION_DURATION, DEFAULT_ANIMATION_SPEED } from './config.js'

export const LOLCAT_MANIFEST = {
    name: 'lolcat',
    version: '0.1.0',
    description: 'Coloring text in rainbow colors',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'terminal'],
    programs: [{
        name: 'lolcat',
        options: [
            {
                name: 'spread', short: 'p', long: 'spread', value: { name: 'spread', required: true },
                description: 'The spread of the colors horizontally (hue shift) (bigger value means more colors in one line)',
                defaultValue: DEFAULT_SPREAD,
            },
            {
                name: 'freq', short: 'F', long: 'freq', value: { name: 'freq', required: true },
                description: 'The speed of the colors vertically (hue drift) (bigger value means faster color change)',
                defaultValue: DEFAULT_FREQ,
            },
            {
                name: 'seed', short: 'S', long: 'seed', value: { name: 'seed', required: true },
                description: 'The seed for starting color, if not provided or 0, a random seed will be used',
                defaultValue: DEFAULT_SEED,
            },
            {
                name: 'animate', short: 'a', long: 'animate',
                description: 'Enables text animation mode',
            },
            {
                name: 'duration', short: 'd', long: 'duration', value: { name: 'duration', required: true },
                description: 'Animation duration',
                defaultValue: DEFAULT_ANIMATION_DURATION,
            },
            {
                name: 'speed', short: 's', long: 'speed', value: { name: 'speed', required: true },
                description: 'Animation speed',
                defaultValue: DEFAULT_ANIMATION_SPEED,
            },
            {
                name: 'invert', short: 'i', long: 'invert',
                description: 'Invert fg and bg colors',
            },
        ],
        arguments: [
            {
                name: 'file_path', required: true,
                description: 'The path to the file to colorize, if not provided, the standard input will be used',
            },
        ]
    }]
}

export default LOLCAT_MANIFEST
