import { ACTIONS } from './actions.js'
import { CompletionReverseCommand } from './commands/completion-reverse.js'
import { CompletionCommand } from './commands/completion.js'
import { InterruptCommand } from './commands/interrupt.js'
import { DeleteBackwardCommand } from './commands/delete-backward.js'
import { DeleteWordBackwardCommand } from './commands/delete-word-backward.js'
import { DeleteForwardCommand } from './commands/delete-forward.js'
import { HistoryBackwardCommand } from './commands/history-backward.js'
import { HistoryForwardCommand } from './commands/history-forward.js'
import { InsertCharCommand } from './commands/insert-char.js'
import { PasteCommand } from './commands/paste.js'
import { SubmitCommand } from './commands/submit.js'
import { MoveCursorBackwardCommand } from './commands/move-cursor-backward.js'
import { MoveCursorForwardCommand } from './commands/move-cursor-forward.js'
import { MoveCursorWordBackwardCommand } from './commands/move-cursor-word-backward.js'
import { MoveCursorWordForwardCommand } from './commands/move-cursor-word-forward.js'
import { MoveCursorToCoordinatesCommand } from './commands/move-cursor-to-coordinates.js'
import { MoveCursorToStartCommand } from './commands/move-cursor-to-start.js'
import { MoveCursorToEndCommand } from './commands/move-cursor-to-end.js'

export const COMMANDS = Object.freeze({
    [ACTIONS.COMPLETION]: new CompletionCommand(),
    [ACTIONS.COMPLETION_REVERSE]: new CompletionReverseCommand(),
    [ACTIONS.INTERRUPT]: new InterruptCommand(),
    [ACTIONS.DELETE_BACKWARD]: new DeleteBackwardCommand(),
    [ACTIONS.DELETE_WORD_BACKWARD]: new DeleteWordBackwardCommand(),
    [ACTIONS.DELETE_FORWARD]: new DeleteForwardCommand(),
    [ACTIONS.HISTORY_BACKWARD]: new HistoryBackwardCommand(),
    [ACTIONS.HISTORY_FORWARD]: new HistoryForwardCommand(),
    [ACTIONS.INSERT_CHAR]: new InsertCharCommand(),
    [ACTIONS.PASTE]: new PasteCommand(),
    [ACTIONS.SUBMIT]: new SubmitCommand(),
    [ACTIONS.MOVE_CURSOR_BACKWARD]: new MoveCursorBackwardCommand(),
    [ACTIONS.MOVE_CURSOR_FORWARD]: new MoveCursorForwardCommand(),
    [ACTIONS.MOVE_CURSOR_WORD_BACKWARD]: new MoveCursorWordBackwardCommand(),
    [ACTIONS.MOVE_CURSOR_WORD_FORWARD]: new MoveCursorWordForwardCommand(),
    [ACTIONS.MOVE_CURSOR_TO_COORDINATES]: new MoveCursorToCoordinatesCommand(),
    [ACTIONS.MOVE_CURSOR_TO_START]: new MoveCursorToStartCommand(),
    [ACTIONS.MOVE_CURSOR_TO_END]: new MoveCursorToEndCommand(),
});

export default COMMANDS