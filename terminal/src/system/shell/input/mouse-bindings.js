import { ACTIONS } from './actions.js'

/**
 * Mouse bindings: maps mouse combinations to shell input actions
 */
export const MOUSE_BINDINGS = Object.freeze({
    'rightpress': ACTIONS.PASTE,
    'left1click': ACTIONS.MOVE_CURSOR_TO_COORDINATES,
});

export default MOUSE_BINDINGS