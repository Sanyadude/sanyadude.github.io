/**
 * InputHandlerController class - assigns the handler that receives input the terminal did not handle
 */
export class InputHandlerController {
    /**
     * Creates a new InputHandlerController instance
     * @param {object} defaultHandler The handler restored to when every replacement is popped. Uses handleInput
     */
    constructor(defaultHandler) {
        this._stack = [defaultHandler];
    }

    /**
     * Gets the handler that currently receives forwarded input
     * @returns {object|null} The current input handler
     */
    getCurrent() {
        return this._stack[this._stack.length - 1] || null;
    }

    /**
     * Attaches the input handler that receives keys and pointer events the terminal did not handle
     * Keeps earlier handlers so they can be restored
     * @param {object} handler The input handler. Uses handleInput
     * @returns {InputHandlerController} The instance of the InputHandlerController
     */
    setInputHandler(handler) {
        this._stack.push(handler);
        return this;
    }

    /**
     * Restores the input handler replaced by the last setInputHandler call
     * @returns {InputHandlerController} The instance of the InputHandlerController
     */
    restoreInputHandler() {
        if (this._stack.length > 1) {
            this._stack.pop();
        }
        return this;
    }

    /**
     * Removes one occurrence of a handler without touching the default handler at the bottom
     * @param {object} handler The handler to remove
     * @returns {InputHandlerController} The instance of the InputHandlerController
     */
    release(handler) {
        const index = this._stack.lastIndexOf(handler);
        if (index > 0) {
            this._stack.splice(index, 1);
        }
        return this;
    }
}

export default InputHandlerController