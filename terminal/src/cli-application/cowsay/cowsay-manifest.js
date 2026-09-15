import { DEFAULT_FILE, DEFAULT_WIDTH, DEFAULT_EYES, DEFAULT_TONGUE } from './config.js'

export const COWSAY_MANIFEST = {
    name: 'cowsay',
    version: '0.1.0',
    description: 'Formats message as if it were spoken/thought by a cow',
    type: 'cli',
    programs: [{
        name: 'cowsay',
        description: 'Formats message as if it were spoken by a cow',
        options: [
            {
                name: 'list', short: 'l',
                description: 'List available cows',
            },
            {
                name: 'random', short: 'r',
                description: 'Use a random cow',
            },
            {
                name: 'file', short: 'f', value: { name: 'cowfile_name', required: true },
                description: 'Which cow should say the message',
                defaultValue: DEFAULT_FILE,
            },
            {
                name: 'borg', short: 'b',
                description: 'Initiate Borg mode',
            },
            {
                name: 'dead', short: 'd',
                description: 'Causes the cow to appear dead',
            },
            {
                name: 'greedy', short: 'g',
                description: 'Invokes greedy mode',
            },
            {
                name: 'paranoid', short: 'p',
                description: 'Causes a state of paranoia to come over the cow',
            },
            {
                name: 'stoned', short: 's',
                description: 'Makes the cow appear thoroughly stoned',
            },
            {
                name: 'tired', short: 't',
                description: 'A tired cow',
            },
            {
                name: 'wired', short: 'w',
                description: 'Opposite of tired',
            },
            {
                name: 'youthful', short: 'y',
                description: 'Brings on the cow\'s youthful appearance',
            },
            {
                name: 'no-wrap', short: 'n',
                description: 'If specified message will not be wrapped',
            },
            {
                name: 'eyes', short: 'e', value: { name: 'eyes_string', required: true },
                description: 'The eyes of the cow, first two characters will be used',
                defaultValue: DEFAULT_EYES,
            },
            {
                name: 'tongue', short: 'T', value: { name: 'tongue_string', required: true },
                description: 'The tongue of the cow, first two characters will be used',
                defaultValue: DEFAULT_TONGUE,
            },
            {
                name: 'width', short: 'W', value: { name: 'width', required: true },
                description: 'The width of the bubble after which the message will be wrapped',
                defaultValue: DEFAULT_WIDTH,
            },
        ],
        arguments: [
            {
                name: 'message', required: false,
                description: 'The message for cow to say, if not provided, the standard input will be used',
            }
        ]
    },
    {
        name: 'cowthink',
        description: 'Formats message as if it were thought by a cow',
        options: [
            {
                name: 'list', short: 'l', long: 'list',
                description: 'List available cows',
            },
            {
                name: 'random', short: 'r', long: 'random',
                description: 'Use a random cow',
            },
            {
                name: 'file', short: 'f', long: 'file', value: { name: 'cowfile_name', required: true },
                description: 'Which cow should think the message',
                defaultValue: DEFAULT_FILE,
            },
            {
                name: 'borg', short: 'b',
                description: 'Initiate Borg mode',
            },
            {
                name: 'dead', short: 'd',
                description: 'Causes the cow to appear dead',
            },
            {
                name: 'greedy', short: 'g',
                description: 'Invokes greedy mode',
            },
            {
                name: 'paranoid', short: 'p',
                description: 'Causes a state of paranoia to come over the cow',
            },
            {
                name: 'stoned', short: 's',
                description: 'Makes the cow appear thoroughly stoned',
            },
            {
                name: 'tired', short: 't',
                description: 'A tired cow',
            },
            {
                name: 'wired', short: 'w',
                description: 'Opposite of tired',
            },
            {
                name: 'youthful', short: 'y',
                description: 'Brings on the cow\'s youthful appearance',
            },
            {
                name: 'no-wrap', short: 'n', long: 'no-wrap',
                description: 'If specified message will not be wrapped',
            },
            {
                name: 'eyes', short: 'E', long: 'eyes', value: { name: 'eyes_string', required: true },
                description: 'The eyes of the cow, first two characters will be used',
                defaultValue: DEFAULT_EYES,
            },
            {
                name: 'tongue', short: 'T', long: 'tongue', value: { name: 'tongue_string', required: true },
                description: 'The tongue of the cow, first two characters will be used',
                defaultValue: DEFAULT_TONGUE,
            },
            {
                name: 'width', short: 'W', long: 'width', value: { name: 'width', required: true },
                description: 'The width of the bubble after which the message will be wrapped',
                defaultValue: DEFAULT_WIDTH,
            },
        ],
        arguments: [
            {
                name: 'message', required: false,
                description: 'The message for cow to think, if not provided, the standard input will be used',
            }
        ]
    }]
}

export default COWSAY_MANIFEST