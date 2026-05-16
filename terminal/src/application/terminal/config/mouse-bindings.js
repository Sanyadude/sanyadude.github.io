import { ACTIONS } from './actions.js'

/**
 * Mouse bindings: maps mouse combinations to action names
 */
export const MOUSE_BINDINGS = Object.freeze({
    'RightClick': ACTIONS.PASTE,
    'LeftClick': ACTIONS.MOVE_CURSOR_TO_COORDINATES,
});

export default MOUSE_BINDINGS