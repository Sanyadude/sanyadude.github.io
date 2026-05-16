/**
 * Token type constants used by the Tokenizer and Parser
 * @enum {string}
 */
export const TOKEN_TYPE = Object.freeze({
    NUMBER: 'NUMBER',
    PLUS: '+',
    MINUS: '-',
    STAR: '*',
    SLASH: '/',
    CARET: '^',
    LPAREN: '(',
    RPAREN: ')',
    COMMA: ',',
    IDENTIFIER: 'IDENTIFIER',
    EOF: 'EOF'
});

export default TOKEN_TYPE
