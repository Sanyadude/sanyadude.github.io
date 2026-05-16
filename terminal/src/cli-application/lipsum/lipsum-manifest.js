import { DEFAULT_PARAGRAPHS, DEFAULT_WORDS } from './config.js'

export const LIPSUM_MANIFEST = {
    name: 'lipsum',
    version: '0.1.0',
    description: 'Generates lorem ipsum text',
    type: 'cli',
    programs: [{
        name: 'lipsum',
        options: [
            {
                name: '-p, --paragraphs <paragraphs>',
                description: 'The number of paragraphs to generate',
                defaultValue: DEFAULT_PARAGRAPHS,
            },
            {
                name: '-w, --words <words>',
                description: 'The number of words to generate',
                defaultValue: DEFAULT_WORDS,
            },
        ],
    }]
}

export default LIPSUM_MANIFEST
