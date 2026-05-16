import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor to end of input line command
 */
export class MoveCursorToEndCommand {
    constructor() {
        this.name = ACTIONS.CURSOR_TO_END;
    }

    /**
     * Executes the cursor to end command
     * @param {object} context - Context
     */
    execute(context) {
        context.textBuffer.moveCursorToEnd();
        context.terminalApi.renderCursor();
    }
}
