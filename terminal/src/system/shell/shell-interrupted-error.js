/**
 * ShellInterruptedError - Thrown when a shell job is interrupted
 */
export class ShellInterruptedError extends Error {
    /**
     * Creates a new ShellInterruptedError
     * @param {string} message - The error message
     */
    constructor(message = 'Shell interrupted') {
        super(message);
        this.name = 'ShellInterruptedError';
    }
}

export default ShellInterruptedError