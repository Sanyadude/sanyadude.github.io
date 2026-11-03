import { ACTIONS } from '../actions.js'

/**
 * Submit current input line command
 */
export class SubmitCommand {
    constructor() {
        this.name = ACTIONS.SUBMIT;
    }

    /**
     * Executes the submit command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        const reading = shell.isReading();
        const text = shell.getReadline().commitLine();
        if (reading) {
            shell.completeRead(text);
            return;
        }
        shell.input(text);
    }
}

export default SubmitCommand