import { ACTIONS } from '../config/actions.js'

/**
 * Delete character at cursor left command
 */
export class DeleteLeftCommand {
    constructor() {
        this.name = ACTIONS.DELETE_LEFT;
    }

    /**
     * Executes the delete left command
     * @param {object} context - Context
     */
    execute(context) {
        context.inputCompletion.reset();
        context.textSelection.reset();
        context.textBuffer.deleteAtCursorLeft();
        context.textBuffer.moveCursorLeft();
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
