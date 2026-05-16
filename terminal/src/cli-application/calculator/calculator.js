import { Application } from '../../system/application/application.js'
import { CALCULATOR_MANIFEST } from './calculator-manifest.js'
import { ExpressionTokenizer } from './expression-tokenizer.js'
import { ExpressionParser } from './expression-parser.js'
import { ExpressionEvaluator } from './expression-evaluator.js'

/**
 * Calculator - Application that parses mathematical expressions,
 * builds an AST, and evaluates them.
 * @extends {Application}
 */
export class Calculator extends Application {
    /**
     * Creates a new Calculator instance
     */
    constructor() {
        super('calculator', CALCULATOR_MANIFEST);
    }

    /**
     * Parses and evaluates a mathematical expression
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {string} - The evaluation result
     */
    main(commandLine) {
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        let expression = [stdin, ...args].join(' ').trim();
        if (!expression) {
            return 'No expression provided';
        }
        try {
            const tokens = new ExpressionTokenizer().tokenize(expression);
            const tree = new ExpressionParser().parse(tokens);
            const result = new ExpressionEvaluator().evaluate(tree);
            return `${result}`;
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }
}

export default Calculator