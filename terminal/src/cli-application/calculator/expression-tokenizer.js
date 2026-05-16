import { TOKEN_TYPE } from './token-type.js'

/**
 * Single-character token type lookup
 * @type {Object<string, string>}
 */
const SINGLE_CHAR_TOKENS = Object.freeze({
    '+': TOKEN_TYPE.PLUS,
    '-': TOKEN_TYPE.MINUS,
    '*': TOKEN_TYPE.STAR,
    '/': TOKEN_TYPE.SLASH,
    '^': TOKEN_TYPE.CARET,
    '(': TOKEN_TYPE.LPAREN,
    ')': TOKEN_TYPE.RPAREN,
    ',': TOKEN_TYPE.COMMA,
});

/**
 * ExpressionTokenizer - Scans a math expression string and produces a list of tokens
 *
 * Supported tokens: numbers (including decimals), identifiers (function names
 * and constants), arithmetic operators (+, -, *, /, ^), parentheses, and commas.
 */
export class ExpressionTokenizer {
    /**
     * Creates a new ExpressionTokenizer
     */
    constructor() {
        this._input = '';
        this._position = 0;
        this._tokens = [];
    }

    /**
     * Tokenizes the given expression string and returns the token list
     * @param {string} input - The raw expression string
     * @returns {Array<{type: string, value: string|null}>} - The token list
     * @throws {Error} If an unexpected character is encountered
     */
    tokenize(input) {
        this._input = input;
        this._position = 0;
        this._tokens = [];

        while (this._position < this._input.length) {
            const character = this._input[this._position];
            if (/\s/.test(character)) {
                this._position++;
                continue;
            }
            if (/[0-9.]/.test(character)) {
                this._readNumber();
                continue;
            }
            if (/[a-zA-Z_]/.test(character)) {
                this._readIdentifier();
                continue;
            }
            if (SINGLE_CHAR_TOKENS[character]) {
                this._tokens.push({ type: SINGLE_CHAR_TOKENS[character], value: character });
                this._position++;
                continue;
            }
            throw new Error(`Unexpected character: '${character}'`);
        }

        this._tokens.push({ type: TOKEN_TYPE.EOF, value: null });
        return this._tokens;
    }

    /**
     * Reads a numeric literal (integer or decimal) from the current position
     */
    _readNumber() {
        const start = this._position;
        let hasDot = false;
        while (this._position < this._input.length) {
            const c = this._input[this._position];
            if (c === '.') {
                if (hasDot) break;
                hasDot = true;
            } else if (!/[0-9]/.test(c)) {
                break;
            }
            this._position++;
        }
        this._tokens.push({ type: TOKEN_TYPE.NUMBER, value: this._input.slice(start, this._position) });
    }

    /**
     * Reads an identifier (function name or constant) from the current position
     */
    _readIdentifier() {
        const start = this._position;
        while (this._position < this._input.length && /[a-zA-Z0-9_]/.test(this._input[this._position])) {
            this._position++;
        }
        this._tokens.push({ type: TOKEN_TYPE.IDENTIFIER, value: this._input.slice(start, this._position) });
    }
}

export default ExpressionTokenizer