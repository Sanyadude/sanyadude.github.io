import { ACTIONS } from '../config/actions.js'

/**
 * Scroll page up command
 */
export class ScrollPageUpCommand {
    constructor() {
        this.name = ACTIONS.SCROLL_PAGE_UP;
    }

    /**
     * Executes the scroll page up command
     * @param {object} context Context
     */
    execute(context) {
        const rows = context.textViewport.getViewport().rows;
        context.textViewport.scrollY(-Math.max(1, rows));
    }
}

export default ScrollPageUpCommand