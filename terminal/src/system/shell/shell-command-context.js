/**
 * ShellCommandContext - Represents a command context
 */
export class ShellCommandContext {
    /**
     * Creates a new Shell command context
     * @param {string} commandLine - The command line
     */
    constructor(command, stdin = '') {
        this.raw = command;
        this.command = command;
        this.stdin = stdin;
        this.stdout = '';
        this.stop = false;
    }
}

export default ShellCommandContext