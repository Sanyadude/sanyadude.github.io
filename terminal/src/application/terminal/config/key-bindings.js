import { ACTIONS } from './actions.js'

/**
 * Key bindings: maps key combinations to action names
 */
export const KEY_BINDINGS = Object.freeze({
    'Enter': ACTIONS.SUBMIT,
    'Tab': ACTIONS.COMPLETION,
    'Shift+Tab': ACTIONS.COMPLETION_REVERSE,
    'Backspace': ACTIONS.DELETE_LEFT,
    'Delete': ACTIONS.DELETE_RIGHT,
    'ArrowUp': ACTIONS.HISTORY_UP,
    'ArrowDown': ACTIONS.HISTORY_DOWN,
    'ArrowLeft': ACTIONS.MOVE_CURSOR_LEFT,
    'ArrowRight': ACTIONS.MOVE_CURSOR_RIGHT,
    'Control+ArrowLeft': ACTIONS.MOVE_CURSOR_WORD_LEFT,
    'Control+ArrowRight': ACTIONS.MOVE_CURSOR_WORD_RIGHT,
    'Shift+ArrowUp': ACTIONS.SELECTION_EXTEND_UP,
    'Shift+ArrowDown': ACTIONS.SELECTION_EXTEND_DOWN,
    'Shift+ArrowLeft': ACTIONS.SELECTION_EXTEND_LEFT,
    'Shift+ArrowRight': ACTIONS.SELECTION_EXTEND_RIGHT,
    'Control+c': ACTIONS.COPY,
    'Control+v': ACTIONS.PASTE,
    'Control+a': ACTIONS.MOVE_CURSOR_TO_START,
    'Control+e': ACTIONS.MOVE_CURSOR_TO_END,
});

export default KEY_BINDINGS