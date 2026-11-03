import { ACTIONS } from '../actions.js'

/**
 * Delete backward to the word boundary used by word navigation
 */
export class DeleteWordBackwardCommand {
    constructor() {
        this.name = ACTIONS.DELETE_WORD_BACKWARD;
    }

    /**
     * Executes the delete word backward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().deleteWordBackward();
    }
}

export default DeleteWordBackwardCommand