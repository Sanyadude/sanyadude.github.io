import { TERMINAL_EVENT_TYPE } from './terminal-event-type.js'
import { KEY_BINDINGS } from '../config/key-bindings.js'
import { MOUSE_BINDINGS } from '../config/mouse-bindings.js'
import { COMMANDS } from '../config/commands.js'

/**
 * TerminalEventHandler - Handles dispatched TerminalEvents
 */
export class TerminalEventHandler {
    /**
     * Creates a new TerminalEventHandler instance
     * @param {object} context The terminal context
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Handles a normalized terminal event
     * @param {TerminalEvent} terminalEvent The terminal event to handle
     */
    handle(terminalEvent) {
        this._handle(terminalEvent);
    }

    /**
     * Handles a terminal event
     * @param {TerminalEvent} terminalEvent The terminal event to handle
     */
    _handle(terminalEvent) {
        switch (terminalEvent.type) {
            case TERMINAL_EVENT_TYPE.KEY:
                this._handleKey(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.MOUSE:
                this._handleMouse(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.PRESS:
                this._handlePress(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.RELEASE:
                this._handleRelease(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.CLICK:
                this._handleClick(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SELECTION:
                this._handleSelection(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SCROLL_STEP:
                this._handleScrollStep(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SCROLL:
                this._handleScroll(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.RESIZE:
                this._handleResize(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.THEME:
                this._handleTheme(terminalEvent);
                break;
            default:
                break;
        }
    }

    /**
     * Handles a key event
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleKey(terminalEvent) {
        const handled = this._executeCommand(KEY_BINDINGS[terminalEvent.name], terminalEvent, true);
        if (handled) return;
        this._forwardInput(terminalEvent);
    }

    /**
     * Handles a tracked mouse event
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleMouse(terminalEvent) {
        return;
    }

    /**
     * Handles a press event
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handlePress(terminalEvent) {
        const handled = this._executeCommand(MOUSE_BINDINGS[terminalEvent.name], terminalEvent, false);
        if (handled) return;
        this._forwardInput(terminalEvent);
    }

    /**
     * Handles a release event
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleRelease(terminalEvent) {
        const handled = this._executeCommand(MOUSE_BINDINGS[terminalEvent.name], terminalEvent, false);
        if (handled) return;
        this._forwardInput(terminalEvent);
    }

    /**
     * Handles a click event
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleClick(terminalEvent) {
        const handled = this._executeCommand(MOUSE_BINDINGS[terminalEvent.name], terminalEvent, false);
        if (handled) return;
        this._forwardInput(terminalEvent);
    }

    /**
     * Forwards an event to the current input handler
     * Clears the screen selection for input events before the handler runs
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _forwardInput(terminalEvent) {
        const input = this._context.inputHandlerController.getCurrent();
        if (!input) return;
        if (this._shouldDismissSelection(terminalEvent) && this._context.textSelection.isActive()) {
            this._context.textSelection.reset();
        }
        input.handleInput(terminalEvent);
    }

    /**
     * Returns whether forwarding this event dismisses the screen selection
     * A left press stays so it can start a drag or a touch scroll
     * @param {TerminalEvent} terminalEvent The terminal event
     * @returns {boolean} True when the selection should be cleared
     */
    _shouldDismissSelection(terminalEvent) {
        if (terminalEvent.type === TERMINAL_EVENT_TYPE.KEY) return !this._isModifierKey(terminalEvent);
        if (terminalEvent.type === TERMINAL_EVENT_TYPE.CLICK) return true;
        return false;
    }

    /**
     * Returns whether the event is a modifier key on its own
     * @param {TerminalEvent} terminalEvent The terminal event
     * @returns {boolean} True when the key is Shift, Control, Alt, or Meta
     */
    _isModifierKey(terminalEvent) {
        const key = terminalEvent.data.key;
        return key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta';
    }

    /**
     * Runs a terminal command for an action
     * @param {string} action The action name
     * @param {TerminalEvent} terminalEvent The terminal event
     * @param {boolean} preventDefault True when the original event should be cancelled
     * @returns {boolean} True when a terminal command ran
     */
    _executeCommand(action, terminalEvent, preventDefault) {
        const command = COMMANDS[action];
        if (!command) return false;
        if (preventDefault) terminalEvent.originalEvent?.preventDefault?.();
        command.execute(this._context, {
            event: terminalEvent.originalEvent,
            point: terminalEvent.data.point,
            cell: terminalEvent.data.cell,
            terminalEvent,
        });
        return true;
    }

    /**
     * Handles selection
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleSelection(terminalEvent) {
        const { phase } = terminalEvent.data;
        if (phase === 'start') {
            this._handleSelectionStart(terminalEvent);
        } else if (phase === 'update') {
            this._handleSelectionUpdate(terminalEvent);
        } else if (phase === 'end') {
            this._handleSelectionEnd(terminalEvent);
        }
    }

    /**
     * Handles selection start
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleSelectionStart(terminalEvent) {
        const { alt, startCell } = terminalEvent.data;
        if (alt) {
            this._context.textSelection.setModeBlock();
        } else {
            this._context.textSelection.setModeLine();
        }
        this._context.textSelection.setActive();
        this._context.textSelection.setStart(startCell.row, startCell.column);
    }

    /**
     * Handles selection update
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleSelectionUpdate(terminalEvent) {
        const { endCell } = terminalEvent.data;
        const previousEndPosition = this._context.textSelection.getEnd();
        if (endCell.equals(previousEndPosition)) return;
        this._context.textSelection.setEnd(endCell.row, endCell.column);
    }

    /**
     * Handles selection end
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleSelectionEnd(terminalEvent) {
        const { endCell } = terminalEvent.data;
        this._context.textSelection.setEnd(endCell.row, endCell.column);
    }

    /**
     * Handles a scroll step
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleScrollStep(terminalEvent) {
        const { scrollStep } = terminalEvent.data;
        this._context.textViewport.scrollY(scrollStep);
    }

    /**
     * Handles a scroll
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleScroll(terminalEvent) {
        const { scrollPosition } = terminalEvent.data;
        const newOffsetRow = this._context.scrollBoundsProvider.getOffsetRowFromScrollPosition(scrollPosition);
        const currentOffsetRow = this._context.textViewport.getOffsetRow();
        if (newOffsetRow === currentOffsetRow) return;
        this._context.textViewport.setOffsetRow(newOffsetRow);
    }

    /**
     * Handles a resize
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleResize(terminalEvent) {
        this._context.textBufferProvider.reflow();
        this._context.textViewport.refresh();
        this._context.renderer.resetCache();
        this._context.renderer.populateContainer();
    }

    /**
     * Handles a theme change
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _handleTheme(terminalEvent) {
        const { theme } = terminalEvent.data;
        this._context.renderer.resetCache();
        this._context.dom.applyTheme(theme);
        this._context.cursorRenderer.applyTheme(theme);
    }
}

export default TerminalEventHandler