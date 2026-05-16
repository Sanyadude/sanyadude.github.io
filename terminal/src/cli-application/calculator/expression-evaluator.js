import { NumberNode } from './node/number-node.js'
import { BinaryOpNode } from './node/binary-op-node.js'
import { UnaryOpNode } from './node/unary-op-node.js'
import { FunctionCallNode } from './node/function-call-node.js'
import { FUNCTIONS } from './functions.js'

/**
 * ExpressionEvaluator - Walks an AST and computes the numeric result
 */
export class ExpressionEvaluator {
    /**
     * Creates a new ExpressionEvaluator
     */
    constructor() {
        this._tree = null;
    }

    /**
     * Evaluates the given AST and returns the numeric result
     * @param {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} tree - The root AST node
     * @returns {number} - The computed numeric value
     * @throws {Error} If division by zero occurs or an unknown function/node is encountered
     */
    evaluate(tree) {
        this._tree = tree;
        return this._evaluateNode(this._tree);
    }

    /**
     * Recursively evaluates an AST node
     * @param {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} node - The AST node to evaluate
     * @returns {number} - The computed numeric value
     * @throws {Error} If division by zero occurs or an unknown function/node is encountered
     */
    _evaluateNode(node) {
        if (node instanceof NumberNode) return node.value;
        if (node instanceof BinaryOpNode) {
            const left = this._evaluateNode(node.left);
            const right = this._evaluateNode(node.right);
            switch (node.operator) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/':
                    if (right === 0) throw new Error('Division by zero');
                    return left / right;
                case '^': return Math.pow(left, right);
            }
        }
        if (node instanceof UnaryOpNode) {
            if (node.operator === '-') return -this._evaluateNode(node.operand);
        }
        if (node instanceof FunctionCallNode) {
            const args = node.args.map(arg => this._evaluateNode(arg));
            const fn = FUNCTIONS[node.name.toLowerCase()];
            if (!fn) throw new Error(`Unknown function: '${node.name}'`);
            return fn(...args);
        }
        throw new Error('Unknown node type');
    }
}

export default ExpressionEvaluator
