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
                name: 'font', short: 'f', value: { name: 'font_name', required: true },
                description: 'The font to use, if not provided, the default font will be used',
                defaultValue: DEFAULT_FONT_NAME,
            },
            {
                name: 'left', short: 'l',
                description: 'Align output to the left',
            },
            {
                name: 'right', short: 'r',
                description: 'Align output to the right',
            },
            {
                name: 'center', short: 'c',
                description: 'Align output to the center',
            },
            {
                name: 'terminal', short: 't',
                description: 'Use the terminal width as the width of the output',
            },
            {
                name: 'width', short: 'w', value: { name: 'width', required: true },
                description: 'The width of the output',
                defaultValue: DEFAULT_WIDTH,
            },
            {
                name: 'kerning', short: 'k',
                description: 'Enables kerning which removes as many blanks as possible between characters so they touch, but does not merge them',
            },
            {
                name: 'smushing', short: 's',
                description: 'Enables smushing where overlapping sub-characters between adjacent letters are removed to make them fit more tightly',
            },
            {
                name: 'full-width', short: 'W',
                description: 'Displays all characters at full width, without kerning or smushing',
            },
            {
                name: 'left-to-right', short: 'L',
                description: 'Print the output from left to right',
            },
            {
                name: 'right-to-left', short: 'R',
                description: 'Print the output from right to left',
            },
            {
                name: 'list', long: 'list',
                description: 'Lists all available fonts',
            },
        ],
        arguments: [
            {
                name: 'message', required: true,
                description: 'The message to display, if not provided, the standard input will be used',
            },
        ]
    }]
}

export default FIGLET_MANIFEST
