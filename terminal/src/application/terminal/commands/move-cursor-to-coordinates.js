import { ACTIONS } from '../config/actions.js'

/**
 * Move cursor to coordinates command
 */
export class MoveCursorToCoordinatesCommand {
    constructor() {
        this.name = ACTIONS.CURSOR_TO_COORDINATES;
    }

    /**
     * Executes the cursor to coordinates command
     * @param {object} context - Context
     * @param {object} payload - Payload
     */
    execute(context, payload) {
        if (context.textSelection.isActive()) {
            context.textSelection.reset();
            context.terminalApi.render();
        }
        const position = payload.position;
        const absolutePosition = context.textViewport.getAbsolutePositionFromCoordinates(position.x, position.y);
        const inputTextStartPosition = context.textBuffer.getInputTextStartPosition();
        const index = context.textViewport.getIndexFromPosition(absolutePosition.line - inputTextStartPosition.line, absolutePosition.column - inputTextStartPosition.column);
        if (index < 0) return;
        context.textBuffer.moveCursorTo(index);
        context.terminalApi.renderCursor();
    }
}
