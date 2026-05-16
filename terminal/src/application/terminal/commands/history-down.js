import { ACTIONS } from '../config/actions.js'

/**
 * History down (next command) command
 */
export class HistoryDownCommand {
    constructor() {
        this.name = ACTIONS.HISTORY_DOWN;
    }

    /**
     * Executes the history down command
     * @param {object} context - Context
     */
    execute(context) {
        context.textSelection.reset();
        const text = context.textBuffer.getInputText();
        const newText = context.inputHistoryNavigation.navigateForward(text);
        context.textBuffer.setInputText(newText);
        context.textBuffer.moveCursorTo(newText.length);
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
