import { ACTIONS } from '../config/actions.js'

/**
 * Delete character at cursor right command
 */
export class DeleteRightCommand {
    constructor() {
        this.name = ACTIONS.DELETE_RIGHT;
    }

    /**
     * Executes the delete right command
     * @param {object} context - Context
     */
    execute(context) {
        context.inputCompletion.reset();
        context.textSelection.reset();
        context.textBuffer.deleteAtCursorRight();
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
