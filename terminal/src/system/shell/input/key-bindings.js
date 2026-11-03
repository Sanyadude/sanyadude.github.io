import { ACTIONS } from './actions.js'

/**
 * Key bindings: maps key combinations to shell input actions
 */
export const KEY_BINDINGS = Object.freeze({
    'enter': ACTIONS.SUBMIT,
    'tab': ACTIONS.COMPLETION,
    'shift+tab': ACTIONS.COMPLETION_REVERSE,
    'backspace': ACTIONS.DELETE_BACKWARD,
    'control+backspace': ACTIONS.DELETE_WORD_BACKWARD,
    'alt+backspace': ACTIONS.DELETE_WORD_BACKWARD,
    'delete': ACTIONS.DELETE_FORWARD,
    'arrowup': ACTIONS.HISTORY_BACKWARD,
    'arrowdown': ACTIONS.HISTORY_FORWARD,
    'arrowleft': ACTIONS.MOVE_CURSOR_BACKWARD,
    'arrowright': ACTIONS.MOVE_CURSOR_FORWARD,
    'control+arrowleft': ACTIONS.MOVE_CURSOR_WORD_BACKWARD,
    'control+arrowright': ACTIONS.MOVE_CURSOR_WORD_FORWARD,
    'meta+arrowleft': ACTIONS.MOVE_CURSOR_WORD_BACKWARD,
    'meta+arrowright': ACTIONS.MOVE_CURSOR_WORD_FORWARD,
    'control+c': ACTIONS.INTERRUPT,
    'control+v': ACTIONS.PASTE,
    'meta+v': ACTIONS.PASTE,
    'control+a': ACTIONS.MOVE_CURSOR_TO_START,
    'meta+a': ACTIONS.MOVE_CURSOR_TO_START,
    'control+e': ACTIONS.MOVE_CURSOR_TO_END,
    'home': ACTIONS.MOVE_CURSOR_TO_START,
    'end': ACTIONS.MOVE_CURSOR_TO_END,
});

export default KEY_BINDINGS