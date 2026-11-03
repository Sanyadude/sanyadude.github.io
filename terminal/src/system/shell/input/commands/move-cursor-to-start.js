import { ACTIONS } from '../actions.js'

/**
 * Move cursor to start of input line command
 */
export class MoveCursorToStartCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_TO_START;
    }

    /**
     * Executes the cursor to start command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        shell.getReadline().moveCursorToStart();
    }
}

export default MoveCursorToStartCommand