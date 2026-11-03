import { ACTIONS } from './actions.js'
import { CopyCommand } from '../commands/copy.js'
import { SelectionExtendDownCommand } from '../commands/selection-extend-down.js'
import { SelectionExtendLeftCommand } from '../commands/selection-extend-left.js'
import { SelectionExtendRightCommand } from '../commands/selection-extend-right.js'
import { SelectionExtendUpCommand } from '../commands/selection-extend-up.js'
import { SelectLineCommand } from '../commands/select-line.js'
import { SelectWordCommand } from '../commands/select-word.js'
import { ScrollHomeCommand } from '../commands/scroll-home.js'
import { ScrollEndCommand } from '../commands/scroll-end.js'
import { ScrollPageUpCommand } from '../commands/scroll-page-up.js'
import { ScrollPageDownCommand } from '../commands/scroll-page-down.js'

export const COMMANDS = Object.freeze({
    [ACTIONS.COPY]: new CopyCommand(),
    [ACTIONS.SELECTION_EXTEND_DOWN]: new SelectionExtendDownCommand(),
    [ACTIONS.SELECTION_EXTEND_LEFT]: new SelectionExtendLeftCommand(),
    [ACTIONS.SELECTION_EXTEND_RIGHT]: new SelectionExtendRightCommand(),
    [ACTIONS.SELECTION_EXTEND_UP]: new SelectionExtendUpCommand(),
    [ACTIONS.SELECT_LINE]: new SelectLineCommand(),
    [ACTIONS.SELECT_WORD]: new SelectWordCommand(),
    [ACTIONS.SCROLL_HOME]: new ScrollHomeCommand(),
    [ACTIONS.SCROLL_END]: new ScrollEndCommand(),
    [ACTIONS.SCROLL_PAGE_UP]: new ScrollPageUpCommand(),
    [ACTIONS.SCROLL_PAGE_DOWN]: new ScrollPageDownCommand(),
});

export default COMMANDS