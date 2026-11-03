import { ACTIONS } from '../config/actions.js'

/**
 * Scroll home command
 */
export class ScrollHomeCommand {
    constructor() {
        this.name = ACTIONS.SCROLL_HOME;
    }

    /**
     * Executes the scroll home command
     * @param {object} context Context
     */
    execute(context) {
        context.textViewport.setOffsetRow(context.scrollBoundsProvider.getMinOffsetRow());
    }
}

export default ScrollHomeCommand