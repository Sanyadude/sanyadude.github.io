import { DEFAULT_DATE_FORMAT, DEFAULT_ISO8601_FORMAT } from './config.js';

export const DATE_MANIFEST = {
    name: 'date',
    version: '0.1.0',
    description: 'Shows current date',
    type: 'cli',
    dependencies: ['systemTime'],
    programs: [{
        name: 'date',
        options: [
            {
                name: '-d, --date <date>',
                description: 'The date to use, if not provided, the current date will be used'
            },
            {
                name: '-f, --format <format>',
                description: 'Format the date output:'
                    +'\n  - %Y: Year (4 digits)'
                    +'\n  - %y: Year (2 digits)'
                    +'\n  - %m: Month (2 digits)'
                    +'\n  - %d: Day (2 digits)'
                    +'\n  - %H: Hour (2 digits)'
                    +'\n  - %I: Hour (12-hour format)'
                    +'\n  - %M: Minute (2 digits)'
                    +'\n  - %S: Second (2 digits)'
                    +'\n  - %L: Millisecond (3 digits)'
                    +'\n  - %N: Nanosecond (9 digits)'
                    +'\n  - %A: Day of the week (full name)'
                    +'\n  - %a: Day of the week (abbreviated name)'
                    +'\n  - %B: Month (full name)'
                    +'\n  - %b: Month (abbreviated name)'
                    +'\n  - %p: AM/PM'
                    +'\n  - %P: am/pm'
                    +'\n  - %z: Timezone offset'
                    +'\n  - %Z: Timezone name'
                    +'\n  - %j: Day of the year (3 digits)'
                    +'\n  - %u: Day of the week (1-7, 1 is Monday)'
                    +'\n  - %w: Day of the week (0-6, 0 is Sunday)'
                    +'\n  - %U: Week of the year (0-53) with Sunday as first day of week (2 digits)'
                    +'\n  - %W: Week of the year (0-53) with Monday as first day of week (2 digits)'
                    +'\n  - %s: Seconds since epoch'
                    +'\n  - %C: Century'
                    +'\n  - %F: Date in YYYY-MM-DD format'
                    +'\n  - %T: Time in HH:MM:SS format'
                    +'\n  - %R: Time in HH:MM format'
                    +'\n  - %r: Time in HH:MM:SS AM/PM format'
                    +'\n  - %D: Date in MM/DD/YY format'
                    +'\n  - %c: Locale date and time'
                    +'\n  - %x: Locale date only'
                    +'\n  - %X: Locale time only\n',
                defaultValue: DEFAULT_DATE_FORMAT,
            },
            {
                name: '-I, --iso8601 <format>',
                description: `Format the date output according to the ISO 8601 standard ('date', 'hours', 'minutes', 'seconds', 'days')`,
                defaultValue: DEFAULT_ISO8601_FORMAT,
            },
            {
                name: '-R, --rfc-email',
                description: 'Format the date output according to the RFC 5322 standard'
            },
            {
                name: '-u, --utc',
                description: 'Use UTC time'
            },
            {
                name: '-s, --set-date <date>',
                description: 'Set the system time to the specified date'
            }
        ],
    }]
}

export default DATE_MANIFEST