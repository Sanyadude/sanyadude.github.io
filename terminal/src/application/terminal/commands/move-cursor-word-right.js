import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor to word start right command
 */
export class MoveCursorWordRightCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_WORD_RIGHT;
    }

    /**
     * Executes the cursor word right command
     * @param {object} context - Context
     */
    execute(context) {
        context.textBuffer.moveCursorToWordStartRight();
        context.terminalApi.renderCursor();
    }
}

export default MoveCursorWordRightCommand