import { ACTIONS } from './actions.js'

/**
 * Mouse bindings: maps mouse combinations to action names
 */
export const MOUSE_BINDINGS = Object.freeze({
    'left2click': ACTIONS.SELECT_WORD,
    'left3click': ACTIONS.SELECT_LINE,
});

export default MOUSE_BINDINGS