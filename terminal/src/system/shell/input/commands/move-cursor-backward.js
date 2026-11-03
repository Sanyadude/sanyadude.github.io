import { ACTIONS } from '../actions.js'

/**
 * Move cursor backward (one character) command
 */
export class MoveCursorBackwardCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_BACKWARD;
    }

    /**
     * Executes the cursor backward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().moveCursorBackward();
    }
}

export default MoveCursorBackwardCommand