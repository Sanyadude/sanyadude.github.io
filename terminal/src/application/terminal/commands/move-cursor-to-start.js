import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor to start of input line command
 */
export class MoveCursorToStartCommand {
    constructor() {
        this.name = ACTIONS.CURSOR_TO_START;
    }

    /**
     * Executes the cursor to start command
     * @param {object} context - Context
     */
    execute(context) {
        context.textBuffer.moveCursorToStart();
        context.terminalApi.renderCursor();
    }
}
