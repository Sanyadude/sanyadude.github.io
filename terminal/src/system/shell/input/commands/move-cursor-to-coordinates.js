import { ACTIONS } from '../actions.js'

/**
 * Move cursor to coordinates command
 */
export class MoveCursorToCoordinatesCommand {
    constructor() {
        this.name = ACTIONS.MOVE_CURSOR_TO_COORDINATES;
    }

    /**
     * Executes the cursor to coordinates command
     * @param {Shell} shell The shell
     * @param {object} payload Payload
     */
    execute(shell, payload) {
        const terminal = shell.getTerminal();
        const readline = shell.getReadline();
        const columns = terminal.getSize().columns;
        if (columns <= 0) return;
        const cursor = terminal.getCursorPosition();
        const cursorCell = cursor.row * columns + cursor.column;
        const clickCell = payload.cell.row * columns + payload.cell.column;
        const index = readline.getCursorIndex() + (clickCell - cursorCell);
        if (index < 0) return;
        readline.moveCursorTo(index);
    }
}

export default MoveCursorToCoordinatesCommand