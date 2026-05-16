import { ACTIONS } from './actions.js'
import { CompletionReverseCommand } from '../commands/completion-reverse.js'
import { CompletionCommand } from '../commands/completion.js'
import { CopyCommand } from '../commands/copy.js'
import { DeleteLeftCommand } from '../commands/delete-left.js'
import { DeleteRightCommand } from '../commands/delete-right.js'
import { HistoryDownCommand } from '../commands/history-down.js'
import { HistoryUpCommand } from '../commands/history-up.js'
import { InsertCharCommand } from '../commands/insert-char.js'
import { PasteCommand } from '../commands/paste.js'
import { SelectionExtendDownCommand } from '../commands/selection-extend-down.js'
import { SelectionExtendLeftCommand } from '../commands/selection-extend-left.js'
import { SelectionExtendRightCommand } from '../commands/selection-extend-right.js'
import { SelectionExtendUpCommand } from '../commands/selection-extend-up.js'
import { SubmitCommand } from '../commands/submit.js'
import { MoveCursorLeftCommand } from '../commands/move-cursor-left.js'
import { MoveCursorRightCommand } from '../commands/move-cursor-right.js'
import { MoveCursorWordLeftCommand } from '../commands/move-cursor-word-left.js'
import { MoveCursorWordRightCommand } from '../commands/move-cursor-word-right.js'
import { MoveCursorToCoordinatesCommand } from '../commands/move-cursor-to-coordinates.js'
import { MoveCursorToStartCommand } from '../commands/move-cursor-to-start.js'
import { MoveCursorToEndCommand } from '../commands/move-cursor-to-end.js'

export const COMMANDS = Object.freeze({
    [ACTIONS.COMPLETION]: new CompletionCommand(),
    [ACTIONS.COMPLETION_REVERSE]: new CompletionReverseCommand(),
    [ACTIONS.COPY]: new CopyCommand(),
    [ACTIONS.DELETE_LEFT]: new DeleteLeftCommand(),
    [ACTIONS.DELETE_RIGHT]: new DeleteRightCommand(),
    [ACTIONS.HISTORY_DOWN]: new HistoryDownCommand(),
    [ACTIONS.HISTORY_UP]: new HistoryUpCommand(),
    [ACTIONS.INSERT_CHAR]: new InsertCharCommand(),
    [ACTIONS.PASTE]: new PasteCommand(),
    [ACTIONS.SELECTION_EXTEND_DOWN]: new SelectionExtendDownCommand(),
    [ACTIONS.SELECTION_EXTEND_LEFT]: new SelectionExtendLeftCommand(),
    [ACTIONS.SELECTION_EXTEND_RIGHT]: new SelectionExtendRightCommand(),
    [ACTIONS.SELECTION_EXTEND_UP]: new SelectionExtendUpCommand(),
    [ACTIONS.SUBMIT]: new SubmitCommand(),
    [ACTIONS.MOVE_CURSOR_LEFT]: new MoveCursorLeftCommand(),
    [ACTIONS.MOVE_CURSOR_RIGHT]: new MoveCursorRightCommand(),
    [ACTIONS.MOVE_CURSOR_WORD_LEFT]: new MoveCursorWordLeftCommand(),
    [ACTIONS.MOVE_CURSOR_WORD_RIGHT]: new MoveCursorWordRightCommand(),
    [ACTIONS.MOVE_CURSOR_TO_COORDINATES]: new MoveCursorToCoordinatesCommand(),
    [ACTIONS.MOVE_CURSOR_TO_START]: new MoveCursorToStartCommand(),
    [ACTIONS.MOVE_CURSOR_TO_END]: new MoveCursorToEndCommand(),
});

export default COMMANDS