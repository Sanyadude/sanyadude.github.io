import { ACTIONS } from '../actions.js'

/**
 * History forward (next command) command
 */
export class HistoryForwardCommand {
    constructor() {
        this.name = ACTIONS.HISTORY_FORWARD;
    }

    /**
     * Executes the history forward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().historyForward();
    }
}

export default HistoryForwardCommand