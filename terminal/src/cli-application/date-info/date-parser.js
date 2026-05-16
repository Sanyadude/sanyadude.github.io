import { DateExpressionTokenizer } from './date-expression-tokenizer.js'
import { DateExpressionParser } from './date-expression-parser.js'
import { DateExpressionEvaluator } from './date-expression-evaluator.js'

export class DateParser {
    /**
     * Parses a date string and returns a Date object
     * @param {string} dateString - The date string to parse
     * @returns {Date} - The parsed Date object
     */
    parse(dateString) {
        const now = new Date();
        const tokens = new DateExpressionTokenizer().tokenize(dateString);
        const parsed = new DateExpressionParser().parse(tokens);
        const date = new DateExpressionEvaluator().evaluate(parsed, now);
        return date;
    }

}

export default DateParser