import { Application } from '../../../../system/application/application.js'
import { TERMINAL_HISTORY_MANIFEST } from './terminal-history-manifest.js'

/**
 * TerminalHistory - Application for displaying command history
 * @extends {Application}
 */
export class TerminalHistory extends Application {
    /**
     * Creates a new TerminalHistory instance
     */
    constructor() {
        super('terminal-history', TERMINAL_HISTORY_MANIFEST);
    }

    /**
     * Executes the `history` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the history command execution
     */
    main(commandLine, context) {
        const inputs = context.terminal.getInputHistory();
        const distinctInputs = Array.from(new Set(inputs));
        return distinctInputs.map((value, index) => `${index + 1}. ${value}`).join('\n');
    }
}

export default TerminalHistory
