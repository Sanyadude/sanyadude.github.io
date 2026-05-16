import { ACTIONS } from '../config/actions.js'

/**
 * Submit current input line command
 */
export class SubmitCommand {
    constructor() {
        this.name = ACTIONS.SUBMIT;
    }

    /**
     * Executes the submit command
     * @param {object} context - Context
     */
    execute(context) {
        if (context.textSelection.isActive()) {
            context.textSelection.reset();
            context.terminalApi.render();
            return;
        }
        const text = context.textBuffer.getInputText();
        context.inputHistoryNavigation.addInput(text);
        context.shell.input(text);
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
