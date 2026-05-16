import { ACTIONS } from '../config/actions.js'

/**
 * Selection extend down command
 */
export class SelectionExtendDownCommand {
    constructor() {
        this.name = ACTIONS.SELECTION_EXTEND_DOWN;
    }

    /**
     * Executes the selection extend down command
     * @param {object} context - Context
     */
    execute(context) {
        if (!context.textSelection.isActive()) {
            const position = context.textBuffer.getCursorPosition();
            context.textSelection.setModeLine();
            context.textSelection.setActive();
            context.textSelection.setStart(position.line, position.column);
        }
        context.textSelection.moveEnd(1);
        context.terminalApi.render();
    }
}
