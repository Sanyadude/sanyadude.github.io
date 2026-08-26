import { ACTIONS } from './actions.js'

/**
 * Key bindings: maps key combinations to action names
 */
export const KEY_BINDINGS = Object.freeze({
    'enter': ACTIONS.SUBMIT,
    'tab': ACTIONS.COMPLETION,
    'shift+tab': ACTIONS.COMPLETION_REVERSE,
    'backspace': ACTIONS.DELETE_LEFT,
    'delete': ACTIONS.DELETE_RIGHT,
    'arrowup': ACTIONS.HISTORY_UP,
    'arrowdown': ACTIONS.HISTORY_DOWN,
    'arrowleft': ACTIONS.MOVE_CURSOR_LEFT,
    'arrowright': ACTIONS.MOVE_CURSOR_RIGHT,
    'control+arrowleft': ACTIONS.MOVE_CURSOR_WORD_LEFT,
    'control+arrowright': ACTIONS.MOVE_CURSOR_WORD_RIGHT,
    'shift+arrowup': ACTIONS.SELECTION_EXTEND_UP,
    'shift+arrowdown': ACTIONS.SELECTION_EXTEND_DOWN,
    'shift+arrowleft': ACTIONS.SELECTION_EXTEND_LEFT,
    'shift+arrowright': ACTIONS.SELECTION_EXTEND_RIGHT,
    'control+c': ACTIONS.INTERRUPT,
    'control+shift+c': ACTIONS.COPY,
    'control+v': ACTIONS.PASTE,
    'control+a': ACTIONS.MOVE_CURSOR_TO_START,
    'control+e': ACTIONS.MOVE_CURSOR_TO_END,
});

export default KEY_BINDINGS