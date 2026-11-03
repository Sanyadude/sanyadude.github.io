import { ACTIONS } from '../actions.js'

/**
 * Move cursor forward (one character) command
 */
export class MoveCursorForwardCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_FORWARD;
    }

    /**
     * Executes the cursor forward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().moveCursorForward();
    }
}

export default MoveCursorForwardCommand