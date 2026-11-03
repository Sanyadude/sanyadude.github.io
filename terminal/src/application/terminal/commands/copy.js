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
     * @param {object} context Context
     */
    async execute(context) {
        if (!context.textSelection.isActive() || !context.textSelection.hasRange()) return;
        try {
            const selectionRanges = context.textSelection.getSelectionRanges();
            const block = context.textSelection.getSelection().mode === 'block';
            const selectionText = context.textBuffer.getSelectionText(selectionRanges, block);
            await context.clipboard.copy(selectionText);
        } catch (error) {
            return;
        }
    }
}

export default CopyCommand