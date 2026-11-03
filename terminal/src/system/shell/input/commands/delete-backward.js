import { ACTIONS } from '../actions.js'

/**
 * Delete character backward command
 */
export class DeleteBackwardCommand {
    constructor() {
        this.name = ACTIONS.DELETE_BACKWARD;
    }

    /**
     * Executes the delete backward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().deleteBackward();
    }
}

export default DeleteBackwardCommand