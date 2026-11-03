import { ACTIONS } from '../actions.js'

/**
 * Paste from clipboard command
 */
export class PasteCommand {
    constructor() {
        this.name = ACTIONS.PASTE;
    }

    /**
     * Executes the paste command
     * @param {Shell} shell The shell
     */
    async execute(shell) {
        try {
            let text = await shell.getTerminal().readClipboard();
            text = text.replace(/\n|\r/g, '');
            shell.getReadline().insert(text);
        } catch (error) {
            return;
        }
    }
}

export default PasteCommand