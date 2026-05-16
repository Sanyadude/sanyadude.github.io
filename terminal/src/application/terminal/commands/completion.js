import { ACTIONS } from '../config/actions.js'

/**
 * Input completion command
 */
export class CompletionCommand {
    constructor() {
        this.name = ACTIONS.COMPLETION;
    }

    /**
     * Executes the input completion command
     * @param {object} context - Context
     */
    execute(context) {
        context.textSelection.reset();
        const text = context.textBuffer.getInputText();
        const index = context.textBuffer.getCursorIndex();
        const reverse = false;
        const completion = context.inputCompletion.complete(text, index, reverse);
        context.textBuffer.setInputText(completion.text);
        context.textBuffer.moveCursorTo(completion.index);
        context.terminalApi.render();
        context.terminalApi.renderCursor();
    }
}
