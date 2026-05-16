import { NumberNode } from './node/number-node.js'
import { BinaryOpNode } from './node/binary-op-node.js'
import { UnaryOpNode } from './node/unary-op-node.js'
import { FunctionCallNode } from './node/function-call-node.js'
import { TOKEN_TYPE } from './token-type.js'
import { CONSTANTS } from './constants.js'

/**
 * ExpressionParser - Recursive-descent parser that builds an AST from tokens
 *
 * Grammar (lowest to highest precedence):
 *   expression = term (('+' | '-') term)*
 *   term       = power (('*' | '/') power)*
 *   power      = unary ('^' power)?          -- right-associative
 *   unary      = ('-' | '+') unary | call
 *   call       = IDENTIFIER '(' args ')' | primary
 *   primary    = NUMBER | IDENTIFIER(constant) | '(' expression ')'
 */
export class ExpressionParser {
    /**
     * Creates a new ExpressionParser
     */
    constructor() {
        this._tokens = [];
        this._position = 0;
    }

    /**
     * Returns the token at the current position
     * @returns {{type: string, value: string|null}} - The current token
     */
    _current() {
        return this._tokens[this._position];
    }

    /**
     * Consumes the current token if it matches the expected type, otherwise throws
     * @param {string} type - The expected token type
     * @returns {{type: string, value: string|null}} - The consumed token
     * @throws {Error} If the current token does not match the expected type
     */
    _consume(type) {
        const token = this._current();
        if (token.type !== type) {
            throw new Error(`Expected '${type}' but got '${token.type}'`);
        }
        this._position++;
        return token;
    }

    /**
     * Parses the given token list into an AST
     * @param {Array<{type: string, value: string|null}>} tokens - The token list from the tokenizer
     * @returns {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} - The root AST node
     * @throws {Error} If the token list contains syntax errors
     */
    parse(tokens) {
        this._tokens = tokens;
        this._position = 0;
        const node = this._expression();
        this._consume(TOKEN_TYPE.EOF);
        return node;
    }

    /**
     * Parses an expression (addition and subtraction)
     * @returns {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} - The parsed AST node
     */
    _expression() {
        let left = this._term();
        while (this._current().type === TOKEN_TYPE.PLUS || this._current().type === TOKEN_TYPE.MINUS) {
            const operator = this._current().value;
            this._position++;
            left = new BinaryOpNode(operator, left, this._term());
        }
        return left;
    }

    /**
     * Parses a term (multiplication and division)
     * @returns {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} - The parsed AST node
     */
    _term() {
        let left = this._power();
        while (this._current().type === TOKEN_TYPE.STAR || this._current().type === TOKEN_TYPE.SLASH) {
            const operator = this._current().value;
            this._position++;
            left = new BinaryOpNode(operator, left, this._power());
        }
        return left;
    }

    /**
     * Parses a power expression (right-associative exponentiation)
     * @returns {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} - The parsed AST node
     */
    _power() {
        let base = this._unary();
        if (this._current().type === TOKEN_TYPE.CARET) {
            this._position++;
            base = new BinaryOpNode('^', base, this._power());
        }
        return base;
    }

    /**
     * Parses a unary expression (unary minus or plus)
     * @returns {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} - The parsed AST node
     */
    _unary() {
        if (this._current().type === TOKEN_TYPE.MINUS) {
            this._position++;
            return new UnaryOpNode('-', this._unary());
        }
        if (this._current().type === TOKEN_TYPE.PLUS) {
            this._position++;
            return this._unary();
        }
        return this._call();
    }

    /**
     * Parses a function call or resolves a named constant
     * @returns {NumberNode|FunctionCallNode} - The parsed AST node
     * @throws {Error} If the identifier is not a known function or constant
     */
    _call() {
        if (this._current().type === TOKEN_TYPE.IDENTIFIER) {
            const name = this._current().value;
            this._position++;
            if (this._current().type === TOKEN_TYPE.LPAREN) {
                this._position++;
                const args = [];
                if (this._current().type !== TOKEN_TYPE.RPAREN) {
                    args.push(this._expression());
                    while (this._current().type === TOKEN_TYPE.COMMA) {
                        this._position++;
                        args.push(this._expression());
                    }
                }
                this._consume(TOKEN_TYPE.RPAREN);
                return new FunctionCallNode(name, args);
            }
            const resolved = CONSTANTS[name.toLowerCase()];
            if (resolved !== undefined) return new NumberNode(resolved);
            throw new Error(`Unknown identifier: '${name}'`);
        }
        return this._primary();
    }

    /**
     * Parses a primary expression (number literal or parenthesized expression)
     * @returns {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} - The parsed AST node
     * @throws {Error} If an unexpected token is encountered
     */
    _primary() {
        if (this._current().type === TOKEN_TYPE.NUMBER) {
            const value = parseFloat(this._current().value);
            this._position++;
            return new NumberNode(value);
        }
        if (this._current().type === TOKEN_TYPE.LPAREN) {
            this._position++;
            const expr = this._expression();
            this._consume(TOKEN_TYPE.RPAREN);
            return expr;
        }
        throw new Error(`Unexpected token: '${this._current().value || this._current().type}'`);
    }
}

export default ExpressionParser