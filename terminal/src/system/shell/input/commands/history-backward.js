import { ACTIONS } from '../actions.js'

/**
 * History backward (previous command) command
 */
export class HistoryBackwardCommand {
    constructor() {
        this.name = ACTIONS.HISTORY_BACKWARD;
    }

    /**
     * Executes the history backward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().historyBackward();
    }
}

export default HistoryBackwardCommand