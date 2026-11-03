import { ACTIONS } from '../actions.js'

/**
 * Move cursor to end of input line command
 */
export class MoveCursorToEndCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_TO_END;
    }

    /**
     * Executes the cursor to end command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().moveCursorToEnd();
    }
}

export default MoveCursorToEndCommand