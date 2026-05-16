import { ACTIONS } from '../config/actions.js'

/**
 * Copy to clipboard command
 */
export class CopyCommand {
    constructor() {
        this.name = ACTIONS.COPY;
    }

    /**
     * Executes the copy command
     * @param {object} context - Context
     */
    async execute(context) {
        try {
            const selectionRanges = context.textSelection.getSelectionRanges();
            const selectionText = context.textBuffer.getSelectionText(selectionRanges);
            await navigator.clipboard.writeText(selectionText);
        } catch (error) {
            return;
        }
    }
}
