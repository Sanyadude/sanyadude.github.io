import { ACTIONS } from '../config/actions.js'

/**
 * Scroll end command
 */
export class ScrollEndCommand {
    constructor() {
        this.name = ACTIONS.SCROLL_END;
    }

    /**
     * Executes the scroll end command
     * @param {object} context Context
     */
    execute(context) {
        context.textViewport.setOffsetRow(context.scrollBoundsProvider.getMaxOffsetRow());
    }
}

export default ScrollEndCommand