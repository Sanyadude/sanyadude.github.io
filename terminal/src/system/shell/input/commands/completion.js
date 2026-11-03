import { ACTIONS } from '../actions.js'

/**
 * Input completion command
 */
export class CompletionCommand {
    constructor() {
        this.name = ACTIONS.COMPLETION;
    }

    /**
     * Executes the input completion command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        const readline = shell.getReadline();
        readline.setCompletionOptions(shell.getCwdCompletionList());
        readline.complete(false);
    }
}

export default CompletionCommand