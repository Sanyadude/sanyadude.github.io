export const LOLCAT_MANIFEST = {
    name: 'lolcat',
    version: '0.1.0',
    description: 'Coloring text in rainbow colors',
    type: 'cli',
    dependencies: ['fileSystemExplorer'],
    programs: [{
        name: 'lolcat',
        options: [
            {
                name: '-p, --spread <spread>',
                description: 'The spread of the colors horizontally (hue shift) (bigger value means more colors in one line)',
                defaultValue: 3,
            },
            {
                name: '-f, --freq <freq>',
                description: 'The speed of the colors vertically (hue drift) (bigger value means faster color change)',
                defaultValue: 0.1,
            },
            {
                name: '-s, --seed <seed>',
                description: 'The seed for starting color, if not provided, a random seed will be used',
            },
            {
                name: '-i, --invert',
                description: 'Invert fg and bg colors',
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
