
export class Tokenizer {
    constructor() {
        this.keywords = ["if", "else", "while", "for", "function", "var", "let", "const", "return", "new", "try", "catch"];
        this.operators = ["+", "-", "*", "/", "=", "==", "===", "!=", "!==", ">", "<", ">=", "<="];
        this.separators = ["(", ")", "{", "}", "[", "]", ",", ";"];
    }

    isOperator(char) {
        return this.operators.includes(char);
    }

    isSeparator(char) {
        return this.separators.includes(char);
    }

    isKeyword(token) {
        return this.keywords.includes(token);
    }

    isNumericLiteral(token) {
        return /^\d+(\.\d+)?$/.test(token);
    }

    isBooleanLiteral(token) {
        return token === 'true' || token === 'false';
    }

    tokenize(input) {
        const tokens = [];
        const processToken = (token) => {
            if (this.isKeyword(token)) {
                tokens.push({ type: 'keyword', value: token });
            } else if (this.isOperator(token)) {
                tokens.push({ type: 'operator', value: token });
            } else if (this.isSeparator(token)) {
                tokens.push({ type: 'separator', value: token });
            } else if (this.isNumericLiteral(token)) {
                tokens.push({ type: 'number', value: parseFloat(token) });
            } else if (this.isBooleanLiteral(token)) {
                tokens.push({ type: 'boolean', value: token === "true" });
            } else {
                tokens.push({ type: 'identifier', value: token });
            }
        }
        let currentToken = '';
        let inString = false;
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char === '"') {
                inString = !inString;
                currentToken += char;
            } else if (inString) {
                currentToken += char;
            } else if (/\s/.test(char) || char === '\n' || char === '\r') {
                // Whitespace or newline characters - process the current token and reset
                if (currentToken) {
                    processToken(currentToken);
                    currentToken = '';
                }
            } else if (this.isSeparator(char) || this.isOperator(char)) {
                // Separators or operators - process the current token and the character
                if (currentToken) {
                    processToken(currentToken);
                    currentToken = '';
                }
                processToken(char);
            } else {
                // Other characters - add to the current token
                currentToken += char;
            }
        }
        // Process the last token
        if (currentToken) {
            processToken(currentToken);
        }
        return tokens;
    }
}

export default Tokenizer

// Example usage
const codeString = `
{
    frame: new UIRect(0, 0, 200, 50),
    widthMode: UISizeMode.frameSize,
    heightMode: UISizeMode.frameSize,
    backgroundColor: UIColor.black
}
`;
const tokenizer = new Tokenizer();
const tokens = tokenizer.tokenize(codeString);
console.log(tokens);