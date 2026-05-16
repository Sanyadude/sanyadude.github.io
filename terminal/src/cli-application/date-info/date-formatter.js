import { DAYS_FULL, DAYS_SHORT, MONTHS_FULL, MONTHS_SHORT } from './config.js'

const pad = (number, length = 2) => String(number).padStart(length, '0');
const padSpace = (number, length = 2) => String(number).padStart(length, ' ');
const getTimezoneOffset = (date) => {
    const offset = -date.getTimezoneOffset(); // minutes
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    const hours = pad(Math.floor(abs / 60));
    const mins = pad(abs % 60);
    return `${sign}${hours}${mins}`;
};
const getDayOfYear = (date, utc = false) => {
    const start = utc
        ? new Date(Date.UTC(date.getUTCFullYear(), 0, 0))
        : new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / 86400000);
};
const getWeekNumber = (date, startOnMonday = false, utc = false) => {
    const firstDayOfYear = utc
        ? new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
        : new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / 86400000);
    const dayOfWeek = utc ? firstDayOfYear.getUTCDay() : firstDayOfYear.getDay();
    const firstWeekday = startOnMonday ? (dayOfWeek || 7) - 1 : dayOfWeek;
    return Math.floor((dayOfYear + firstWeekday) / 7);
};
const getTokenValue = (date, token, utc = false) => {
    const get = (method) => utc ? date[`getUTC${method}`]() : date[`get${method}`]();
    switch (token) {
        // Year
        case '%Y': return get('FullYear');
        case '%y': return String(get('FullYear')).slice(-2);
        // Month
        case '%m': return pad(get('Month') + 1);
        case '%-m': return get('Month') + 1;
        case '%_m': return padSpace(get('Month') + 1);
        // Day
        case '%d': return pad(get('Date'));
        case '%-d': return get('Date');
        case '%_d': return padSpace(get('Date'));
        // Hour
        case '%H': return pad(get('Hours'));
        case '%-H': return get('Hours');
        case '%_H': return padSpace(get('Hours'));
        case '%I': {
            const h = (get('Hours') % 12) || 12;
            return pad(h);
        }
        // Minute
        case '%M': return pad(get('Minutes'));
        case '%-M': return get('Minutes');
        case '%_M': return padSpace(get('Minutes'));
        // Second
        case '%S': return pad(get('Seconds'));
        case '%-S': return get('Seconds');
        case '%_S': return padSpace(get('Seconds'));
        // Milliseconds
        case '%L': return pad(get('Milliseconds'), 3);
        // Nanoseconds
        case '%N': return pad(get('Milliseconds') * 1000000, 9);
        // Day of the week name
        case '%A': return DAYS_FULL[get('Day')];
        case '%a': return DAYS_SHORT[get('Day')];
        // Month name
        case '%B': return MONTHS_FULL[get('Month')];
        case '%b': return MONTHS_SHORT[get('Month')];
        // AM/PM
        case '%p': return get('Hours') < 12 ? 'AM' : 'PM';
        case '%P': return get('Hours') < 12 ? 'am' : 'pm';
        // Timezone offset
        case '%z': return utc ? '+0000' : getTimezoneOffset(date);
        case '%Z': return utc ? 'UTC' : date.toString().match(/\(([A-Za-z\s]+)\)/)[1] || '';
        // Day of the year
        case '%j': return pad(getDayOfYear(date, utc), 3);
        case '%-j': return getDayOfYear(date, utc);
        case '%_j': return padSpace(getDayOfYear(date, utc), 3);
        // Day of the week (1-7, 1 is Monday)
        case '%u': return get('Day') === 0 ? 7 : get('Day');
        // Day of the week (0-6, 0 is Sunday)
        case '%w': return get('Day');
        // Week of the year (0-53) with Sunday as first day of week
        case '%U': return pad(getWeekNumber(date, false, utc), 2);
        case '%-U': return getWeekNumber(date, false, utc);
        case '%_U': return padSpace(getWeekNumber(date, false, utc), 2);
        // Week of the year (0-53) with Monday as first day of week
        case '%W': return pad(getWeekNumber(date, true, utc), 2);
        case '%-W': return getWeekNumber(date, true, utc);
        case '%_W': return padSpace(getWeekNumber(date, true, utc), 2);
        // Seconds since epoch
        case '%s': return Math.floor(date.getTime() / 1000);
        // Century
        case '%C': return Math.floor(get('FullYear') / 100);
        // Literal %
        case '%%': return '%';
        // Date in YYYY-MM-DD format
        case '%F': return `${get('FullYear')}-${pad(get('Month') + 1)}-${pad(get('Date'))}`;
        // Time in HH:MM:SS format
        case '%T': return `${pad(get('Hours'))}:${pad(get('Minutes'))}:${pad(get('Seconds'))}`;
        // Time in HH:MM format
        case '%R': return `${pad(get('Hours'))}:${pad(get('Minutes'))}`;
        // Time in HH:MM:SS AM/PM format
        case '%r': {
            const h = (get('Hours') % 12) || 12;
            return `${pad(h)}:${pad(get('Minutes'))}:${pad(get('Seconds'))} ${get('Hours') < 12 ? 'AM' : 'PM'}`;
        }
        // Date in MM/DD/YY format
        case '%D': return `${pad(get('Month') + 1)}/${pad(get('Date'))}/${String(get('FullYear')).slice(-2)}`;
        // Locale date and time
        case '%c': return date.toLocaleString();
        // Locale date only
        case '%x': return date.toLocaleDateString();
        // Locale time only
        case '%X': return date.toLocaleTimeString();
        // Value as-is
        default: return token;
    }
};

/**
 * DateFormatter - Formats a date according to the given format
 */
export class DateFormatter {
    /**
     * Formats the date according to the given format
     * @param {Date} date - The date to format
     * @param {string} format - The format to use
     * @param {boolean} utc - Whether to use UTC time
     * @returns {string} - The formatted date
     */
    format(date, format, utc = false) {
        let formattedDate = '';
        let i = 0;
        while (i < format.length) {
            if (format[i] === '%') {
                let token = format[i];
                const nextChar = format[i + 1];
                if (nextChar === '-') {
                    token += '-' + format[i + 2];
                    i += 3;
                } else if (nextChar === '_') {
                    token += '_' + format[i + 2];
                    i += 3;
                } else {
                    token += nextChar;
                    i += 2;
                }
                formattedDate += getTokenValue(date, token, utc);
                continue;
            }
            formattedDate += format[i];
            i++;
        }
        return formattedDate;
    }
}

export default DateFormatter