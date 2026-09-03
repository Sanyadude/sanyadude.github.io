import { DEFAULT_PARAGRAPHS, DEFAULT_WORDS } from './config.js'

export const LIPSUM_MANIFEST = {
    name: 'lipsum',
    version: '0.1.0',
    description: 'Generates lorem ipsum text',
    type: 'cli',
    dependencies: ['terminal'],
    programs: [{
        name: 'lipsum',
        options: [
            {
                name: 'paragraphs', short: 'p', long: 'paragraphs', value: { name: 'paragraphs', required: true },
                description: 'The number of paragraphs to generate',
                defaultValue: DEFAULT_PARAGRAPHS,
            },
            {
                name: 'words', short: 'w', long: 'words', value: { name: 'words', required: true },
                description: 'The number of words to generate',
                defaultValue: DEFAULT_WORDS,
            },
            {
                name: 'width', short: 'W', long: 'width', value: { name: 'width', required: true },
                description: 'Wrap lines to <width> columns; default is the terminal width, or 80',
            },
        ],
    }]
}

export default LIPSUM_MANIFEST
