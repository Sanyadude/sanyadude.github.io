import { ACTIONS } from '../config/actions.js'

/**
 * Selection extend left command
 */
export class SelectionExtendLeftCommand {
    constructor() {
        this.name = ACTIONS.SELECTION_EXTEND_LEFT;
    }

    /**
     * Executes the selection extend left command
     * @param {object} context - Context
     */
    execute(context) {
        if (!context.textSelection.isActive()) {
            const position = context.textBuffer.getCursorPosition();
            context.textSelection.setModeLine();
            context.textSelection.setActive();
            context.textSelection.setStart(position.line, position.column);
        }
        context.textSelection.moveEnd(0, -1);
        context.terminalApi.render();
    }
}
