import { ACTIONS } from '../config/actions.js'

/**
 * Select the word at the click
 */
export class SelectWordCommand {
    constructor() {
        this.name = ACTIONS.SELECT_WORD;
    }

    /**
     * Executes the select word command
     * @param {object} context Context
     * @param {object} payload Payload
     */
    execute(context, payload) {
        const { row, column } = payload.cell;
        const line = context.textBuffer.getRows(row, 1)[0];
        context.textSelection.selectWord(row, column, line);
    }
}

export default SelectWordCommand