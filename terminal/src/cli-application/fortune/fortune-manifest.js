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
                name: 'all', short: 'a',
                description: 'Print all fortune files including offensive ones',
            },
            {
                name: 'cookie', short: 'c',
                description: 'Show the cookie file from which the fortune came',
            },
            {
                name: 'equal', short: 'e',
                description: 'Consider all fortune files to be of equal size',
            },
            {
                name: 'list', short: 'f',
                description: 'List available fortune files',
            },
            {
                name: 'long', short: 'l',
                description: 'Only print long fortunes',
            },
            {
                name: 'pattern', short: 'm', value: { name: 'pattern', required: true },
                description: 'Specifies the pattern to use for filtering fortunes'
            },
            {
                name: 'length', short: 'n', value: { name: 'length', required: true },
                description: 'Specifies how long is defined',
                defaultValue: DEFAULT_LENGTH_THRESHOLD,
            },
            {
                name: 'offensive', short: 'o',
                description: 'Only print offensive fortunes',
            },
            {
                name: 'short', short: 's',
                description: 'Only print short fortunes',
            },
            {
                name: 'ignore-case', short: 'i',
                description: 'Make pattern matching ignore case',
            }
        ],
        arguments: [
            {
                name: 'files', required: false, repeatable: true,
                description: 'Fortune files to pick from, optionally prefixed with N% (e.g. 90% computers 10% zippy)',
            }
        ]
    }]
}

export default FORTUNE_MANIFEST