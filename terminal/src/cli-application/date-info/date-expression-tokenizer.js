import { TOKEN, UNITS, WEEKDAYS, MONTHS, KEYWORDS, RELATIVE_DAYS, NUMBER_REGEX, DATE_REGEX, TIME_24H_REGEX, TIME_12H_REGEX, TIMEZONE_REGEX } from './date-parser-config.js'

/**
 * DateExpressionTokenizer - Tokenizes a date string and returns a list of tokens
 */
export class DateExpressionTokenizer {
    /**
     * Tokenizes a date string
     * @param {string} dateString - The date string to tokenize
     * @returns {Array<{type: string, value: string}>} - The tokens
     */
    tokenize(dateString) {
        dateString = dateString
            .toLowerCase()
            .replace(/(\d)\s+(am|pm)\b/g, '$1$2')
            .trim();
        const parts = dateString.split(/\s+/);
        return parts.map(part => {
            if (NUMBER_REGEX.test(part)) {
                return { type: TOKEN.NUMBER, value: Number(part) };
            }
            if (DATE_REGEX.test(part)) {
                return { type: TOKEN.DATE, value: part };
            }
            if (TIME_24H_REGEX.test(part) || TIME_12H_REGEX.test(part)) {
                return { type: TOKEN.TIME, value: part };
            }
            if (TIMEZONE_REGEX.test(part)) {
                return { type: TOKEN.TIMEZONE_OFFSET, value: part };
            }
            if (UNITS.includes(part)) {
                return { type: TOKEN.UNIT, value: part };
            }
            const weekday = WEEKDAYS.find(weekday => weekday.fullName === part || weekday.shortName === part);
            if (weekday) {
                return { type: TOKEN.WEEKDAY, value: weekday.fullName };
            }
            const month = MONTHS.find(month => month.fullName === part || month.shortName === part);
            if (month) {
                return { type: TOKEN.MONTH, value: month.fullName };
            }
            if (KEYWORDS.includes(part)) {
                return { type: TOKEN.KEYWORD, value: part };
            }
            const relativeDay = RELATIVE_DAYS.find(relativeDay => relativeDay.fullName === part);
            if (relativeDay) {
                return { type: TOKEN.RELATIVE_DAY, value: relativeDay.fullName };
            }
            return { type: TOKEN.UNKNOWN, value: part };
        });
    }
}

export default DateExpressionTokenizer