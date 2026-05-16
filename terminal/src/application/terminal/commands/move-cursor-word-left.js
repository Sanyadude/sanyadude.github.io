import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor to word start left command
 */
export class MoveCursorWordLeftCommand {
    constructor() {
        this.name = ACTIONS.CURSOR_WORD_LEFT;
    }

    /**
     * Executes the cursor word left command
     * @param {object} context - Context
     */
    execute(context) {
        context.textBuffer.moveCursorToWordStartLeft();
        context.terminalApi.renderCursor();
    }
}
