import { ACTIONS } from '../config/actions.js'

/**
 * History up (previous command) command
 */
export class HistoryUpCommand {
    constructor() {
        this.name = ACTIONS.HISTORY_UP;
    }

    /**
     * Executes the history up command
     * @param {object} context - Context
     */
    execute(context) {
        context.textSelection.reset();
        const text = context.textBuffer.getInputText();
        const newText = context.inputHistoryNavigation.navigateBackward(text);
        context.textBuffer.setInputText(newText);
        context.textBuffer.moveCursorTo(newText.length);
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
