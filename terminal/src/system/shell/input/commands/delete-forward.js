import { ACTIONS } from '../actions.js'

/**
 * Delete character forward command
 */
export class DeleteForwardCommand {
    constructor() {
        this.name = ACTIONS.DELETE_FORWARD;
    }

    /**
     * Executes the delete forward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().deleteForward();
    }
}

export default DeleteForwardCommand