import { ACTIONS } from '../actions.js'

/**
 * Move cursor to word start backward command
 */
export class MoveCursorWordBackwardCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_WORD_BACKWARD;
    }

    /**
     * Executes the cursor word backward command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().moveCursorWordBackward();
    }
}

export default MoveCursorWordBackwardCommand