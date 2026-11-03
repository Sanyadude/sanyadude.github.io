import { ACTIONS } from './actions.js'
import { KEY_BINDINGS } from './key-bindings.js'
import { MOUSE_BINDINGS } from './mouse-bindings.js'
import { COMMANDS } from './commands.js'

/**
 * ShellInput - handles keys and pointer events the terminal did not handle
 */
export class ShellInput {
    /**
     * Creates a new ShellInput instance
     * @param {Shell} shell The shell that owns this input
     */
    constructor(shell) {
        this._shell = shell;
    }

    /**
     * Handles a forwarded terminal event
     * @param {object} terminalEvent The terminal event
     * @returns {ShellInput} The instance of the ShellInput
     */
    handleInput(terminalEvent) {
        const isKey = terminalEvent.type === 'key';
        const action = this._action(terminalEvent);
        this._execute(action, terminalEvent, isKey);
        return this;
    }

    /**
     * Returns the shell action for a forwarded terminal event
     * @param {object} terminalEvent The terminal event
     * @returns {string|null} The action name, or null when the event is not input
     */
    _action(terminalEvent) {
        if (terminalEvent.type === 'key') {
            return KEY_BINDINGS[terminalEvent.name]
                || (terminalEvent.data.printable ? ACTIONS.INSERT_CHAR : null);
        }
        return MOUSE_BINDINGS[terminalEvent.name];
    }

    /**
     * Runs the command for an action
     * @param {string} action The action name
     * @param {object} terminalEvent The terminal event
     * @param {boolean} preventDefault True when the original event should be cancelled
     * @returns {ShellInput} The instance of the ShellInput
     */
    _execute(action, terminalEvent, preventDefault) {
        const command = COMMANDS[action];
        if (!command) return this;
        if (preventDefault) terminalEvent.originalEvent?.preventDefault?.();
        command.execute(this._shell, {
            event: terminalEvent.originalEvent,
            point: terminalEvent.data.point,
            cell: terminalEvent.data.cell,
            terminalEvent,
        });
        return this;
    }
}

export default ShellInput