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
                name: '-l, --list',
                description: 'List available cows',
            },
            {
                name: '-r, --random',
                description: 'Use a random cow',
            },
            {
                name: '-f, --file <cowfile_name>',
                description: 'Which cow should say the message',
                defaultValue: DEFAULT_FILE,
            },
            {
                name: '-b',
                description: 'Initiate Borg mode',
            },
            {
                name: '-d',
                description: 'Causes the cow to appear dead',
            },
            {
                name: '-g',
                description: 'Invokes greedy mode',
            },
            {
                name: '-p',
                description: 'Causes a state of paranoia to come over the cow',
            },
            {
                name: '-s',
                description: 'Makes the cow appear thoroughly stoned',
            },
            {
                name: '-t',
                description: 'A tired cow',
            },
            {
                name: '-w',
                description: 'Opposite of tired',
            },
            {
                name: '-y',
                description: 'Brings on the cow\'s youthful appearance',
            },
            {
                name: '-n',
                description: 'If specified message will not be wrapped',
            },
            {
                name: '-E, --eyes <eyes_string>',
                description: 'The eyes of the cow, first two characters will be used',
                defaultValue: DEFAULT_EYES,
            },
            {
                name: '-T, --tongue <tongue_string>',
                description: 'The tongue of the cow, first two characters will be used',
                defaultValue: DEFAULT_TONGUE,
            },
            {
                name: '-W, --width <width>',
                description: 'The width of the bubble after which the message will be wrapped',
                defaultValue: DEFAULT_WIDTH,
            },
        ],
        arguments: [
            {
                name: '<message>',
                description: 'The message for cow to say, if not provided, the standard input will be used',
            }
        ]
    },
    {
        name: 'cowthink',
        description: 'Formats message as if it were thought by a cow',
        options: [
            {
                name: '-l, --list',
                description: 'List available cows',
            },
            {
                name: '-r, --random',
                description: 'Use a random cow',
            },
            {
                name: '-f, --file <cowfile_name>',
                description: 'Which cow should think the message',
                defaultValue: DEFAULT_FILE,
            },
            {
                name: '-b',
                description: 'Initiate Borg mode',
            },
            {
                name: '-d',
                description: 'Causes the cow to appear dead',
            },
            {
                name: '-g',
                description: 'Invokes greedy mode',
            },
            {
                name: '-p',
                description: 'Causes a state of paranoia to come over the cow',
            },
            {
                name: '-s',
                description: 'Makes the cow appear thoroughly stoned',
            },
            {
                name: '-t',
                description: 'A tired cow',
            },
            {
                name: '-w',
                description: 'Opposite of tired',
            },
            {
                name: '-y',
                description: 'Brings on the cow\'s youthful appearance',
            },
            {
                name: '-n, --no-wrap',
                description: 'If specified message will not be wrapped',
            },
            {
                name: '-E, --eyes <eyes_string>',
                description: 'The eyes of the cow, first two characters will be used',
                defaultValue: DEFAULT_EYES,
            },
            {
                name: '-T, --tongue <tongue_string>',
                description: 'The tongue of the cow, first two characters will be used',
                defaultValue: DEFAULT_TONGUE,
            },
            {
                name: '-W, --width <width>',
                description: 'The width of the bubble after which the message will be wrapped',
                defaultValue: DEFAULT_WIDTH,
            },
        ],
        arguments: [
            {
                name: '<message>',
                description: 'The message for cow to think, if not provided, the standard input will be used',
            }
        ]
    }]
}

export default COWSAY_MANIFEST