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
                name: '-p, --spread <spread>',
                description: 'The spread of the colors horizontally (hue shift) (bigger value means more colors in one line)',
                defaultValue: DEFAULT_SPREAD,
            },
            {
                name: '-f, --freq <freq>',
                description: 'The speed of the colors vertically (hue drift) (bigger value means faster color change)',
                defaultValue: DEFAULT_FREQ,
            },
            {
                name: '-S, --seed <seed>',
                description: 'The seed for starting color, if not provided or 0, a random seed will be used',
                defaultValue: DEFAULT_SEED,
            },
            {
                name: '-i, --invert',
                description: 'Invert fg and bg colors',
            },
            {
                name: '-a, --animate',
                description: 'Enables text animation mode',
            },
            {
                name: '-d, --duration <duration>',
                description: 'Animation duration',
                defaultValue: DEFAULT_ANIMATION_DURATION,
            },
            {
                name: '-s, --speed <speed>',
                description: 'Animation speed',
                defaultValue: DEFAULT_ANIMATION_SPEED,
            },
        ],
        arguments: [
            {
                name: '<file_path>',
                description: 'The path to the file to colorize, if not provided, the standard input will be used',
            },
        ]
    }]
}

export default LOLCAT_MANIFEST
