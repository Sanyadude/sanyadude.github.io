/**
 * Action names
 */
export const ACTIONS = Object.freeze({
    INSERT_CHAR: 'insertChar',
    SUBMIT: 'submit',
    COMPLETION: 'completion',
    COMPLETION_REVERSE: 'completionReverse',
    DELETE_LEFT: 'deleteLeft',
    DELETE_RIGHT: 'deleteRight',
    HISTORY_UP: 'historyUp',
    HISTORY_DOWN: 'historyDown',
    SELECTION_EXTEND_UP: 'selectionExtendUp',
    SELECTION_EXTEND_DOWN: 'selectionExtendDown',
    SELECTION_EXTEND_LEFT: 'selectionExtendLeft',
    SELECTION_EXTEND_RIGHT: 'selectionExtendRight',
    COPY: 'copy',
    PASTE: 'paste',
    MOVE_CURSOR_LEFT: 'moveCursorLeft',
    MOVE_CURSOR_RIGHT: 'moveCursorRight',
    MOVE_CURSOR_WORD_LEFT: 'moveCursorWordLeft',
    MOVE_CURSOR_WORD_RIGHT: 'moveCursorWordRight',
    MOVE_CURSOR_TO_COORDINATES: 'moveCursorToCoordinates',
    MOVE_CURSOR_TO_START: 'moveCursorToStart',
    MOVE_CURSOR_TO_END: 'moveCursorToEnd',
});

export default ACTIONS