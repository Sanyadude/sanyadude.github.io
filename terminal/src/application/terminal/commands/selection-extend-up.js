import { ACTIONS } from '../config/actions.js'

/**
 * Selection extend up command
 */
export class SelectionExtendUpCommand {
    constructor() {
        this.name = ACTIONS.SELECTION_EXTEND_UP;
    }

    /**
     * Executes the selection extend up command
     * @param {object} context - Context
     */
    execute(context) {
        if (!context.textSelection.isActive()) {
            const position = context.textBuffer.getCursorPosition();
            context.textSelection.setModeLine();
            context.textSelection.setActive();
            context.textSelection.setStart(position.line, position.column);
        }
        context.textSelection.moveEnd(-1);
        context.terminalApi.render();
    }
}
