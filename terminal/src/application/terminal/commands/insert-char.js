import { ACTIONS } from '../config/actions.js'

/**
 * Insert character command: insert a single character at cursor
 */
export class InsertCharCommand {
    constructor() {
        this.name = ACTIONS.INSERT_CHAR;
    }

    /**
     * Executes the insert character command
     * @param {object} context - Context
     * @param {object} payload - Payload
     */
    execute(context, payload) {
        context.inputCompletion.reset()
        context.textSelection.reset()
        context.textBuffer.insertAtCursor(payload.event.key)
        context.textBuffer.moveCursorRight()
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
