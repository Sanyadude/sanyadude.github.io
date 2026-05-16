import { Application } from '../../../../system/application/application.js'
import { TERMINAL_CLEAR_MANIFEST } from './terminal-clear-manifest.js'

/**
 * TerminalClear - Application for clearing the terminal screen
 * @extends {Application}
 */
export class TerminalClear extends Application {
    /**
     * Creates a new TerminalClear instance
     */
    constructor() {
        super('terminal-clear', TERMINAL_CLEAR_MANIFEST);
    }

    /**
     * Executes the `clear` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the clear command execution
     */
    main(commandLine, context) {
        context.terminal.clear();
        return '';
    }
}

export default TerminalClear
