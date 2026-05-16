export const CALCULATOR_MANIFEST = {
    name: 'calculator',
    version: '0.2.0',
    description: 'Evaluate mathematical expressions',
    type: 'cli',
    programs: [{
        name: 'calc',
        description: 'Parses and evaluates mathematical expressions with support for +, -, *, /, ^ operators, parentheses, and functions (sqrt, sin, cos, tan, log, abs, min, max, pow)',
        arguments: [
            {
                name: '<expression>',
                description: 'Mathematical expression to evaluate. Supports: +, -, *, /, ^ (power), parentheses, and functions like sqrt(), sin(), cos(), tan(), log(), abs(), min(), max(). Constants: pi, e. Examples: "2 + 3 * 4", "sqrt(16) + 2^3", "sin(pi / 2)"',
            }
        ]
    }]
}

export default CALCULATOR_MANIFEST
