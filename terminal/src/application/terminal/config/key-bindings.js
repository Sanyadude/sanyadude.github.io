import { ACTIONS } from './actions.js'

/**
 * Key bindings: maps key combinations to action names
 */
export const KEY_BINDINGS = Object.freeze({
    'shift+arrowup': ACTIONS.SELECTION_EXTEND_UP,
    'shift+arrowdown': ACTIONS.SELECTION_EXTEND_DOWN,
    'shift+arrowleft': ACTIONS.SELECTION_EXTEND_LEFT,
    'shift+arrowright': ACTIONS.SELECTION_EXTEND_RIGHT,
    'control+shift+c': ACTIONS.COPY,
    'meta+c': ACTIONS.COPY,
    'control+home': ACTIONS.SCROLL_HOME,
    'control+end': ACTIONS.SCROLL_END,
    'pageup': ACTIONS.SCROLL_PAGE_UP,
    'pagedown': ACTIONS.SCROLL_PAGE_DOWN
});

export default KEY_BINDINGS