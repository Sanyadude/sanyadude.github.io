import { ACTIONS } from '../config/actions.js'

/**
 * Scroll page down command
 */
export class ScrollPageDownCommand {
    constructor() {
        this.name = ACTIONS.SCROLL_PAGE_DOWN;
    }

    /**
     * Executes the scroll page down command
     * @param {object} context Context
     */
    execute(context) {
        const rows = context.textViewport.getViewport().rows;
        context.textViewport.scrollY(Math.max(1, rows));
    }
}

export default ScrollPageDownCommand