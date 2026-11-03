/**
 * Shell input action names
 */
export const ACTIONS = Object.freeze({
    INSERT_CHAR: 'insertChar',
    SUBMIT: 'submit',
    COMPLETION: 'completion',
    COMPLETION_REVERSE: 'completionReverse',
    DELETE_BACKWARD: 'deleteBackward',
    DELETE_FORWARD: 'deleteForward',
    DELETE_WORD_BACKWARD: 'deleteWordBackward',
    HISTORY_BACKWARD: 'historyBackward',
    HISTORY_FORWARD: 'historyForward',
    PASTE: 'paste',
    INTERRUPT: 'interrupt',
    MOVE_CURSOR_BACKWARD: 'moveCursorBackward',
    MOVE_CURSOR_FORWARD: 'moveCursorForward',
    MOVE_CURSOR_WORD_BACKWARD: 'moveCursorWordBackward',
    MOVE_CURSOR_WORD_FORWARD: 'moveCursorWordForward',
    MOVE_CURSOR_TO_COORDINATES: 'moveCursorToCoordinates',
    MOVE_CURSOR_TO_START: 'moveCursorToStart',
    MOVE_CURSOR_TO_END: 'moveCursorToEnd',
});

export default ACTIONS