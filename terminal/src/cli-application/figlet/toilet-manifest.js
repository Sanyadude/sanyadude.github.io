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
                name: 'font', short: 'f', long: 'font', value: { name: 'font_name', required: true },
                description: 'The font to use, if not provided, the default font will be used',
                defaultValue: DEFAULT_FONT_NAME,
            },
            {
                name: 'left', short: 'l', long: 'left',
                description: 'Align output to the left',
            },
            {
                name: 'right', short: 'r', long: 'right',
                description: 'Align output to the right',
            },
            {
                name: 'center', short: 'c', long: 'center',
                description: 'Align output to the center',
            },
            {
                name: 'terminal', short: 't', long: 'terminal',
                description: 'Use the terminal width as the width of the output',
            },
            {
                name: 'width', short: 'w', long: 'width', value: { name: 'width', required: true },
                description: 'The width of the output',
                defaultValue: DEFAULT_WIDTH,
            },
            {
                name: 'kerning', short: 'k', long: 'kerning',
                description: 'Enables kerning which removes as many blanks as possible between characters so they touch, but does not merge them',
            },
            {
                name: 'smushing', short: 's', long: 'smushing',
                description: 'Enables smushing where overlapping sub-characters between adjacent letters are removed to make them fit more tightly',
            },
            {
                name: 'full-width', short: 'W', long: 'full-width',
                description: 'Displays all characters at full width, without kerning or smushing',
            },
            {
                name: 'left-to-right', short: 'L', long: 'left-to-right',
                description: 'Print the output from left to right',
            },
            {
                name: 'right-to-left', short: 'R', long: 'right-to-left',
                description: 'Print the output from right to left',
            },
            {
                name: 'list', long: 'list',
                description: 'Lists all available fonts',
            },
            {
                name: 'filter', short: 'F', long: 'filter', value: { name: 'filter', required: true },
                description: 'The filter to apply to the output, multiple filters can be applied by separating them with `:`. If list value is provided, the available filters will be listed',
            },
            {
                name: 'metal', long: 'metal',
                description: 'Applies the metal filter to the output',
            },
            {
                name: 'rainbow', long: 'rainbow',
                description: 'Applies the rainbow filter to the output',
            },
            {
                name: 'gay', long: 'gay',
                description: 'Applies the gay filter to the output',
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

export default TOILET_MANIFEST
