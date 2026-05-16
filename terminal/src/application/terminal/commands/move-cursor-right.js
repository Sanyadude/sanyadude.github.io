import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor right (one character) command
 */
export class MoveCursorRightCommand {
    constructor() {
        this.name = ACTIONS.CURSOR_RIGHT;
    }

    /**
     * Executes the cursor right command
     * @param {object} context - Context
     */
    execute(context) {
        context.textBuffer.moveCursorRight();
        context.terminalApi.renderCursor();
    }
}
