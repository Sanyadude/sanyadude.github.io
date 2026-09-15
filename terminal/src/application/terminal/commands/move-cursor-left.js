import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor left (one character) command
 */
export class MoveCursorLeftCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_LEFT;
    }

    /**
     * Executes the cursor left command
     * @param {object} context - Context
     */
    execute(context) {
        context.textBuffer.moveCursorLeft();
        context.terminalApi.renderCursor();
    }
}

export default MoveCursorLeftCommand