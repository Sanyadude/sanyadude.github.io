import { OPERATIONS, WEEKDAYS, MONTHS } from './date-parser-config.js'

/**
 * DateExpressionEvaluator - Evaluates the operations and returns a Date object
 */
export class DateExpressionEvaluator {
    /**
     * Evaluates the operations and returns a Date object
     * @param {Array<{operation: string, unit: string, value: number, modifier: string}>} operations - The operations to evaluate
     * @param {Date} baseDate - The base date to evaluate the operations from
     * @returns {Date} - The evaluated Date object
     */
    evaluate(operations, baseDate = new Date()) {
        const date = new Date(baseDate);
        const sortedOperations = operations.sort((a, b) => OPERATIONS[a.operation].priority - OPERATIONS[b.operation].priority);
        for (const operation of sortedOperations) {
            switch (operation.operation) {
                case 'shift':
                    this._applyShift(date, operation);
                    break;
                case 'setTimezone':
                    this._applyTimezone(date, operation);
                    break;
                case 'setTime':
                    this._applyTime(date, operation);
                    break;
                case 'setDate':
                    this._applyDate(date, operation);
                    break;
                case 'setDay':
                    this._applyDay(date, operation);
                    break;
                case 'setWeekday':
                    this._applyWeekday(date, operation);
                    break;
                case 'setMonth':
                    this._applyMonth(date, operation);
                    break;
            }
        }
        return date;
    }

    /**
     * Applies a shift operation to a date
     * @param {Date} date - The date to apply the shift operation to
     * @param {object} operation - The operation to apply
     */
    _applyShift(date, operation) {
        const { unit, value } = operation;
        if (unit === 'second') {
            date.setSeconds(date.getSeconds() + value);
        }
        if (unit === 'minute') {
            date.setMinutes(date.getMinutes() + value);
        }
        if (unit === 'hour') {
            date.setHours(date.getHours() + value);
        }
        if (unit === 'day') {
            date.setDate(date.getDate() + value);
        }
        if (unit === 'week') {
            date.setDate(date.getDate() + value * 7);
        }
        if (unit === 'month') {
            date.setMonth(date.getMonth() + value);
        }
        if (unit === 'year') {
            date.setFullYear(date.getFullYear() + value);
        }
    }

    /**
     * Applies a date operation to a date
     * @param {Date} date - The date to apply the date operation to
     * @param {object} operation - The operation to apply
     */
    _applyDate(date, operation) {
        const { value } = operation;
        const targetDate = new Date(value);
        date.setTime(targetDate.getTime());
    }

    /**
     * Applies a time operation to a date
     * @param {Date} date - The date to apply the time operation to
     * @param {object} operation - The operation to apply
     */
    _applyTime(date, operation) {
        const { value } = operation;
        const [hour, minute, second] = value.split(':').map(Number);
        date.setHours(hour, minute, second, 0);
    }

    /**
     * Applies a timezone operation to a date
     * @param {Date} date - The date to apply the timezone operation to
     * @param {object} operation - The operation to apply
     */
    _applyTimezone(date, operation) {
        const { value } = operation;
        let normalizedValue = value.toUpperCase().replace(/^UTC|GMT/, '');
        const match = normalizedValue.match(/^([+-]?)(\d{1,2})(?::?(\d{2}))?$/);
        if (!match) return;
        let [_, sign, hours, minutes] = match;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes || '0', 10);
        if (sign === '-') {
            hours = -hours;
            minutes = -minutes;
        }
        date.setMinutes(date.getMinutes() + hours * 60 + minutes);
    }

    /**
     * Applies a day operation to a date
     * @param {Date} date - The date to apply the day operation to
     * @param {object} operation - The operation to apply
     */
    _applyDay(date, operation) {
        const { value } = operation;
        date.setDate(value);
    }

    /**
     * Applies a weekday operation to a date
     * @param {Date} date - The date to apply the weekday operation to
     * @param {object} operation - The operation to apply
     */
    _applyWeekday(date, operation, weekStart = 'monday') {
        const { value, modifier } = operation;
        const target = WEEKDAYS.find(weekday => weekday.fullName === value).value;
        const weekOffset = weekStart === 'monday' ? 1 : 0;
        const currentWeekDay = (date.getDay() - weekOffset + 7) % 7;
        const targetWeekDay = (target - weekOffset + 7) % 7;
        let diff = targetWeekDay - currentWeekDay;
        if (modifier === 'this') {
            diff = diff < 0 ? diff + 7 : diff;
        }
        if (modifier === 'next') {
            diff = diff + 7;
        }
        if (modifier === 'last') {
            diff = diff - 7;
        }
        date.setDate(date.getDate() + diff);
    }

    /**
     * Applies a month operation to a date
     * @param {Date} date - The date to apply the month operation to
     * @param {object} operation - The operation to apply
     */
    _applyMonth(date, operation) {
        const { value, modifier } = operation;
        const target = MONTHS.find(month => month.fullName === value).value;
        const current = date.getMonth();
        let diff = target - current;
        if (modifier === 'next') {
            if (diff <= 0) diff += 12;
        }
        if (modifier === 'last') {
            if (diff >= 0) diff -= 12;
        }
        date.setMonth(date.getMonth() + diff);
    }
}

export default DateExpressionEvaluator