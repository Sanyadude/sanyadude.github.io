import { ACTIONS } from '../config/actions.js'

/**
 * Paste from clipboard command
 */
export class PasteCommand {
    constructor() {
        this.name = ACTIONS.PASTE;
    }

    /**
     * Executes the paste command
     * @param {object} context - Context
     */
    async execute(context) {
        try {
            let text = await navigator.clipboard.readText();
            text = text.replace(/\n|\r/g, '');
            context.textBuffer.insertAtCursor(text);
            context.textBuffer.moveCursorRight(text.length);
            context.terminalApi.render();
            context.terminalApi.renderCursor();
        } catch (error) {
            return;
        }
    }
}
