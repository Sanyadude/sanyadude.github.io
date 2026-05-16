/**
 * FunctionCallNode - Represents a function call (e.g. sqrt, sin) in the expression tree
 */
export class FunctionCallNode {
    /**
     * Creates a new FunctionCallNode
     * @param {string} name - The function name
     * @param {Array<NumberNode|BinaryOpNode|UnaryOpNode|FunctionCallNode>} args - The function argument nodes
     */
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}

export default FunctionCallNode