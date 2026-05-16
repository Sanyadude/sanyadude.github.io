/**
 * UnaryOpNode - Represents a unary operation (e.g. negation) in the expression tree
 */
export class UnaryOpNode {
    /**
     * Creates a new UnaryOpNode
     * @param {string} operator - The unary operator symbol
     * @param {NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode} operand - The operand node
     */
    constructor(operator, operand) {
        this.operator = operator;
        this.operand = operand;
    }
}

export default UnaryOpNode