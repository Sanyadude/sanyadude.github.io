import { ACTIONS } from '../actions.js'

/**
 * Move cursor to word start forward command
 */
export class MoveCursorWordForwardCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_WORD_FORWARD;
    }

    /**
     * Executes the cursor word forward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().moveCursorWordForward();
    }
}

export default MoveCursorWordForwardCommand