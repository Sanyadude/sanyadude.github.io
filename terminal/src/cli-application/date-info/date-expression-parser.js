import { TOKEN, RELATIVE_DAYS } from './date-parser-config.js'

/**
 * DateExpressionParser - Parses the tokens and returns a parsed object
 */
export class DateExpressionParser {
    /**
     * Parses the tokens and returns a parsed object
     * @param {Array<{type: string, value: string}>} tokens - The tokens to parse
     * @returns {Object} - The parsed object
     */
    parse(tokens) {
        const operations = [];
        let i = 0;
        while (i < tokens.length) {
            const token = tokens[i];
            //Relative days
            if (token.type === TOKEN.RELATIVE_DAY) {
                operations.push({
                    operation: 'shift',
                    unit: 'day',
                    value: RELATIVE_DAYS.find(relativeDay => relativeDay.fullName === token.value).value
                });
                i++;
                continue;
            }
            //Numbers and units
            if (token.type === TOKEN.NUMBER && tokens[i + 1]?.type === TOKEN.UNIT) {
                const num = token.value;
                const unit = this._normalizeUnit(tokens[i + 1].value);
                let direction = 1;
                if (tokens[i + 2]?.value === 'ago') {
                    direction = -1;
                    i += 3;
                } else {
                    i += 2;
                }
                operations.push({
                    operation: 'shift',
                    unit,
                    value: num * direction
                });
                continue;
            }
            if (token.value === 'in' && tokens[i + 1]?.type === TOKEN.NUMBER && tokens[i + 2]?.type === TOKEN.UNIT) {
                const num = tokens[i + 1].value;
                const unit = this._normalizeUnit(tokens[i + 2]?.value);
                operations.push({
                    operation: 'shift',
                    unit,
                    value: num
                });
                i += 3;
                continue;
            }
            //Next, last, this
            if (token.value === 'next' || token.value === 'last' || token.value === 'this') {
                const nextToken = tokens[i + 1];
                //Next, last, this + weekday
                if (nextToken?.type === TOKEN.WEEKDAY) {
                    operations.push({
                        operation: 'setWeekday',
                        value: nextToken.value,
                        modifier: token.value
                    });
                    i += 2;
                    continue;
                }
                //Next, last, this + month + optional day
                if (nextToken?.type === TOKEN.MONTH) {
                    const nextToken2 = tokens[i + 2];
                    if (nextToken2?.type === TOKEN.NUMBER) {
                        operations.push({
                            operation: 'setDay',
                            value: nextToken2.value,
                            modifier: 'this'
                        });
                        operations.push({
                            operation: 'setMonth',
                            value: nextToken.value,
                            modifier: token.value
                        });
                        i += 3;
                        continue;
                    }
                    operations.push({
                        operation: 'setMonth',
                        value: nextToken.value,
                        modifier: token.value
                    });
                    i += 2;
                    continue;
                }
            }
            //Weekday
            if (token.type === TOKEN.WEEKDAY) {
                operations.push({
                    operation: 'setWeekday',
                    value: token.value,
                    modifier: 'this'
                });
                i++;
                continue;
            }
            //Month + optional day
            if (token.type === TOKEN.MONTH) {
                const nextToken = tokens[i + 1];
                if (nextToken?.type === TOKEN.NUMBER) {
                    operations.push({
                        operation: 'setDay',
                        value: nextToken.value,
                        modifier: 'this'
                    });
                    operations.push({
                        operation: 'setMonth',
                        value: token.value,
                        modifier: 'this'
                    });
                    i += 2;
                    continue;
                }
                operations.push({
                    operation: 'setMonth',
                    value: token.value,
                    modifier: 'this'
                });
                i++;
                continue;
            }
            // Timezone offset alone (rare case)
            if (token.type === TOKEN.TIMEZONE_OFFSET) {
                operations.push({
                    operation: 'setTimezone',
                    value: token.value
                });
                i++;
                continue;
            }
            //Time
            if (token.type === TOKEN.TIME) {
                operations.push({
                    operation: 'setTime',
                    value: this._normalizeTime(token.value)
                });
                i++;
                continue;
            }
            //Date
            if (token.type === TOKEN.DATE) {
                operations.push({
                    operation: 'setDate',
                    value: token.value
                });
                i++;
                continue;
            }
            i++;
        }
        return operations;
    }

    /**
     * Normalizes a unit
     * @param {string} unit - The unit to normalize
     * @returns {string} - The normalized unit
     */
    _normalizeUnit(unit) {
        return unit.endsWith('s') ? unit.slice(0, -1) : unit;
    }

    /**
     * Normalizes a time
     * @param {string} time - The time to normalize
     * @returns {string} - The normalized time
     */
    _normalizeTime(time) {
        const is12h = time.includes('am') || time.includes('pm');
        let clean = time.replace(/am|pm/, '');
        let [hour, minute = '00', second = '00'] = clean.split(':').map(Number);
        if (is12h) {
            if (time.includes('pm') && hour !== 12) hour += 12;
            if (time.includes('am') && hour === 12) hour = 0;
        }
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }
}

export default DateExpressionParser