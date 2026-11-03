import { ACTIONS } from '../actions.js'

/**
 * Input completion reverse command
 */
export class CompletionReverseCommand {
    constructor() {
        this.name = ACTIONS.COMPLETION_REVERSE;
    }

    /**
     * Executes the completion reverse command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        const readline = shell.getReadline();
        readline.setCompletionOptions(shell.getCwdCompletionList());
        readline.complete(true);
    }
}

export default CompletionReverseCommand