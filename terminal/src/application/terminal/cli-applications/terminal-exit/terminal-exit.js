import { Application } from '../../../../system/application/application.js'
import { TERMINAL_EXIT_MANIFEST } from './terminal-exit-manifest.js'

/**
 * TerminalExit - Application for closing the terminal
 * @extends {Application}
 */
export class TerminalExit extends Application {
    /**
     * Creates a new TerminalExit instance
     */
    constructor() {
        super('terminal-exit', TERMINAL_EXIT_MANIFEST);
    }

    /**
     * Executes the `exit` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {string} The result of the exit command execution
     */
    main(commandLine, context) {
        context.shell.requestExit();
        return '';
    }
}

export default TerminalExit
