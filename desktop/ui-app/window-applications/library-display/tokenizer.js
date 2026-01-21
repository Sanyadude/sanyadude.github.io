
export class Tokenizer {
    constructor() {
        this.keywords = ["if", "else", "while", "for", "function", "var", "let", "const", "return", "new", "try", "catch", "this"];
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

    isStringLiteral(token) {
        return /^(['"]).*\1$/.test(token);
    }

    tokenize(input = '') {
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
            } else if (this.isStringLiteral(token)) {
                tokens.push({ type: 'string', value: token });
            } else {
                tokens.push({ type: 'identifier', value: token });
            }
        }

        let currentToken = '';
        let inString = false;
        let currentIndentation = 0; // Track the current indentation level

        let lines = input.split('\n'); // Split input into lines to handle indentation line by line

        lines.forEach((line, lineIndex) => {
            let indentCount = 0;

            // Count leading spaces at the start of the line as indentation
            while (line[indentCount] === ' ') {
                indentCount++;
            }

            // If indentation has changed from the previous line, add a tab token for indentation
            if (lineIndex > 0 && indentCount > 0) {
                tokens.push({ type: 'tab', value: ' '.repeat(indentCount - currentIndentation) });
            }

            currentIndentation = indentCount;

            currentToken = '';
            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    // Toggle string literal state
                    inString = !inString;
                    currentToken += char;
                } else if (inString) {
                    // Inside a string literal, just append the character
                    currentToken += char;
                } else if (/\s/.test(char)) {
                    // Skip spaces between tokens, they don't create new tokens
                    if (currentToken) {
                        processToken(currentToken);
                        currentToken = '';
                    }
                } else if (this.isSeparator(char) || this.isOperator(char)) {
                    // Handle separators or operators: process the current token and the character
                    if (currentToken) {
                        processToken(currentToken);
                        currentToken = '';
                    }
                    processToken(char);
                } else {
                    // Otherwise, accumulate the character in the current token
                    currentToken += char;
                }
            }

            // Process the last token of the line
            if (currentToken) {
                processToken(currentToken);
            }

            // Add a newline token after processing each line
            tokens.push({ type: 'newline', value: '\n' });
        });

        return tokens;
    }

    toHTML(tokens) {
        let htmlContent = '';
        
        tokens.forEach(token => {
            switch (token.type) {
                case 'keyword':
                    htmlContent += `<span style="color:#569cd6;">${token.value}</span> `;
                    break;
                case 'operator':
                    htmlContent += `<span style="color:#d4d4d4;">${token.value}</span> `;
                    break;
                case 'identifier':
                    htmlContent += `<span style="color:#9cdcfe;">${token.value}</span> `;
                    break;
                case 'number':
                    htmlContent += `<span style="color:#b5cea8;">${token.value}</span> `;
                    break;
                case 'boolean':
                    htmlContent += `<span style="color:#569cd6;">${token.value}</span> `;
                    break;
                case 'string':
                    htmlContent += `<span style="color:#ce9178;">${token.value}</span> `;
                    break;
                case 'separator':
                    htmlContent += `<span style="color:#cccccc;">${token.value}</span> `;
                    break;
                case 'tab':
                    htmlContent += `<span style="display:inline-block;width: 2em;"></span>`;
                    break;
                case 'newline':
                    htmlContent += `<span style="display:block;"></span>`;
                    break;
                default:
                    htmlContent += `<span>${token.value}</span> `;
                    break;
            }
        });
    
        return htmlContent;
    }
}

export default Tokenizer