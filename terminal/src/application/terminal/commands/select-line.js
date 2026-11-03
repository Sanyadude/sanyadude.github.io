import { ACTIONS } from '../config/actions.js'

/**
 * Select the line at the click
 */
export class SelectLineCommand {
    constructor() {
        this.name = ACTIONS.SELECT_LINE;
    }

    /**
     * Executes the select line command
     * @param {object} context Context
     * @param {object} payload Payload
     */
    execute(context, payload) {
        const { row } = payload.cell;
        context.textSelection.selectLine(row);
    }
}

export default SelectLineCommand