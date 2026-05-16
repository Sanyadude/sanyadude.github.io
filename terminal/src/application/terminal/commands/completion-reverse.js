import { ACTIONS } from '../config/actions.js'

/**
 * Input completion reverse command
 */
export class CompletionReverseCommand {
    constructor() {
        this.name = ACTIONS.COMPLETION_REVERSE;
    }

    /**
     * Executes the completion reverse command
     * @param {object} context - Context
     */
    execute(context) {
        context.textSelection.reset();
        const text = context.textBuffer.getInputText();
        const index = context.textBuffer.getCursorIndex();
        const reverse = true;
        const completion = context.inputCompletion.complete(text, index, reverse);
        context.textBuffer.setInputText(completion.text);
        context.textBuffer.moveCursorTo(completion.index);
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
