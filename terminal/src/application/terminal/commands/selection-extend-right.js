import { ACTIONS } from '../config/actions.js'

/**
 * Selection extend right command
 */
export class SelectionExtendRightCommand {
    constructor() {
        this.name = ACTIONS.SELECTION_EXTEND_RIGHT;
    }

    /**
     * Executes the selection extend right command
     * @param {object} context - Context
     */
    execute(context) {
        if (!context.textSelection.isActive()) {
            const position = context.textBuffer.getCursorPosition();
            context.textSelection.setModeLine();
            context.textSelection.setActive();
            context.textSelection.setStart(position.line, position.column);
        }
        context.textSelection.moveEnd(0, 1);
        context.terminalApi.render();
    }
}
