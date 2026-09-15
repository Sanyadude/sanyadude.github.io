import { ACTIONS } from '../config/actions.js'

/**
 * Delete character at cursor right command
 */
export class DeleteForwardCommand {
    constructor() {
        this.name = ACTIONS.DELETE_FORWARD;
    }

    /**
     * Executes the delete forward command
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

export default DeleteForwardCommand