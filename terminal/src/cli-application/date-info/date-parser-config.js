export const TOKEN = {
    NUMBER: 'NUMBER',
    UNIT: 'UNIT',
    WEEKDAY: 'WEEKDAY',
    MONTH: 'MONTH',
    KEYWORD: 'KEYWORD',
    TIME: 'TIME',
    DATE: 'DATE',
    TIMEZONE_OFFSET: 'TIMEZONE_OFFSET',
    RELATIVE_DAY: 'RELATIVE_DAY',
    UNKNOWN: 'UNKNOWN'
};
export const UNITS = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours', 'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years'];
export const WEEKDAYS = [
    { fullName: 'monday', shortName: 'mon', value: 1 },
    { fullName: 'tuesday', shortName: 'tue', value: 2 },
    { fullName: 'wednesday', shortName: 'wed', value: 3 },
    { fullName: 'thursday', shortName: 'thu', value: 4 },
    { fullName: 'friday', shortName: 'fri', value: 5 },
    { fullName: 'saturday', shortName: 'sat', value: 6 },
    { fullName: 'sunday', shortName: 'sun', value: 0 }
];
export const MONTHS = [
    { fullName: 'january', shortName: 'jan', value: 0 },
    { fullName: 'february', shortName: 'feb', value: 1 },
    { fullName: 'march', shortName: 'mar', value: 2 },
    { fullName: 'april', shortName: 'apr', value: 3 },
    { fullName: 'may', shortName: 'may', value: 4 },
    { fullName: 'june', shortName: 'jun', value: 5 },
    { fullName: 'july', shortName: 'jul', value: 6 },
    { fullName: 'august', shortName: 'aug', value: 7 },
    { fullName: 'september', shortName: 'sep', value: 8 },
    { fullName: 'october', shortName: 'oct', value: 9 },
    { fullName: 'november', shortName: 'nov', value: 10 },
    { fullName: 'december', shortName: 'dec', value: 11 }
];
export const KEYWORDS = ['this', 'next', 'last', 'ago', 'in', 'at'];
export const RELATIVE_DAYS = [
    { fullName: 'today', value: 0 },
    { fullName: 'tomorrow', value: 1 },
    { fullName: 'yesterday', value: -1 }
];
export const NUMBER_REGEX = /^\d+$/;
export const DATE_REGEX = /^(\d{4}[-/]\d{2}[-/]\d{2})$|^(\d{2}[-/]\d{2}[-/]\d{4})$/;
export const TIME_24H_REGEX = /^(?:[01]?\d|2[0-3])(?::[0-5]\d){0,2}$/;
export const TIME_12H_REGEX = /^(?:0?[1-9]|1[0-2])(?::[0-5]\d){0,2}(am|pm)$/;
export const TIMEZONE_REGEX = /^(?:utc|gmt)?\s*([+-]?\d{1,2}(?::?\d{2})?)$/;
export const OPERATIONS = {
    setDate: {
        priority: 1,
    },
    setMonth: {
        priority: 2,
    },
    setDay: {
        priority: 2,
    },
    setWeekday: {
        priority: 3,
    },
    shift: {
        priority: 4,
    },
    setTime: {
        priority: 5,
    },
    setTimezone: {
        priority: 6,
    }
};

export const CONFIG = {
    TOKEN,
    UNITS,
    WEEKDAYS,
    MONTHS,
    KEYWORDS,
    RELATIVE_DAYS,
    NUMBER_REGEX,
    DATE_REGEX,
    TIME_24H_REGEX,
    TIME_12H_REGEX,
    TIMEZONE_REGEX,
    OPERATIONS
};

export default CONFIG