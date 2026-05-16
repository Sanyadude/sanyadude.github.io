import { DEFAULT_FONT_NAME, DEFAULT_WIDTH } from './config.js'

export const TOILET_MANIFEST = {
    name: 'toilet',
    version: '0.1.0',
    description: 'Display text in ASCII art (upgrade from figlet with additional filters)',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'toilet',
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
            {
                name: '-F, --filter <filter>',
                description: 'The filter to apply to the output, multiple filters can be applied by separating them with `:`. If list value is provided, the available filters will be listed',
            },
            {
                name: '--metal',
                description: 'Applies the metal filter to the output',
            },
            {
                name: '--rainbow',
                description: 'Applies the rainbow filter to the output',
            },
            {
                name: '--gay',
                description: 'Applies the gay filter to the output',
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

export default TOILET_MANIFEST
