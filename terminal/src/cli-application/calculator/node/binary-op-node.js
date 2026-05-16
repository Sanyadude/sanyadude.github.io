/**
 * BinaryOpNode - Represents a binary operation (e.g. +, -, *, /, ^) in the expression tree
 */
export class BinaryOpNode {
    /**
     * Creates a new BinaryOpNode
     * @param {string} operator - The operator symbol
     * @param {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} left - The left operand node
     * @param {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} right - The right operand node
     */
    constructor(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

export default BinaryOpNode