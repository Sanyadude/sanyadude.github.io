import { ACTIONS } from '../actions.js'

/**
 * Insert character command: insert a single character at cursor
 */
export class InsertCharCommand {
    constructor() {
        this.name = ACTIONS.INSERT_CHAR;
    }

    /**
     * Executes the insert character command
     * @param {Shell} shell The shell
     * @param {object} payload Payload
     */
    execute(shell, payload) {
        shell.getReadline().insert(payload.event.key);
    }
}

export default InsertCharCommand