import { DEFAULT_LENGTH_THRESHOLD } from './config.js'

export const FORTUNE_MANIFEST = {
    name: 'fortune',
    version: '0.1.0',
    description: 'Print a random, hopefully interesting, adage',
    type: 'cli',
    programs: [{
        name: 'fortune',
        description: 'Print a random, hopefully interesting, adage',
        options: [
            {
                name: '-a, --all',
                description: 'Print all fortune files including offensive ones',
            },
            {
                name: '-o, --offensive',
                description: 'Only print offensive fortunes',
            },
            {
                name: '-s, --short',
                description: 'Only print short fortunes',
            },
            {
                name: '-l, --long',
                description: 'Only print long fortunes',
            },
            {
                name: '-n, --length <length>',
                description: 'Specifies how long is defined',
                defaultValue: DEFAULT_LENGTH_THRESHOLD,
            },
            {
                name: '-m, --pattern <pattern>',
                description: 'Specifies the pattern to use for filtering fortunes'
            },
            {
                name: '-i, --ignore-case',
                description: 'Make pattern matching ignore case',
            },
            {
                name: '-c, --show-cookie',
                description: 'Show the cookie file from which the fortune came.',
            },
            {
                name: '-f, --list',
                description: 'List available fortune files',
            }
        ],
        arguments: [
            {
                name: '[file]',
                description: 'Fortune file to pick from',
            }
        ]
    }]
}

export default FORTUNE_MANIFEST
