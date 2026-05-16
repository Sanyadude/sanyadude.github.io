import { DEFAULT_FONT_NAME, DEFAULT_WIDTH } from './config.js'

export const FIGLET_MANIFEST = {
    name: 'figlet',
    version: '0.1.0',
    description: 'Display text in ASCII art',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'figlet',
        options: [
            {
                name: '--list',
                description: 'Lists all available fonts',
            },
            {
                name: '-w, --width <width>',
                description: 'The width of the output',
                defaultValue: DEFAULT_WIDTH,
            },
            {
                name: '-t, --terminal',
                description: 'Use the terminal width as the width of the output',
            },
            {
                name: '-f, --font <font_name>',
                description: 'The font to use, if not provided, the default font will be used',
                defaultValue: DEFAULT_FONT_NAME,
            },
            {
                name: '-l, --left',
                description: 'Align output to the left',
            },
            {
                name: '-r, --right',
                description: 'Align output to the right',
            },
            {
                name: '-c, --center',
                description: 'Align output to the center',
            },
            {
                name: '-L, --left-to-right',
                description: 'Print the output from left to right',
            },
            {
                name: '-R, --right-to-left',
                description: 'Print the output from right to left',
            },
            {
                name: '-k, --kerning',
                description: 'Enables kerning which removes as many blanks as possible between characters so they touch, but does not merge them',
            },
            {
                name: '-s, --smushing',
                description: 'Enables smushing where overlapping sub-characters between adjacent letters are removed to make them fit more tightly',
            },
            {
                name: '-W, --full-width',
                description: 'Displays all characters at full width, without kerning or smushing',
            },
        ],
        arguments: [
            {
                name: '<message>',
                description: 'The message to display, if not provided, the standard input will be used',
            },
        ]
    }]
}

export default FIGLET_MANIFEST
