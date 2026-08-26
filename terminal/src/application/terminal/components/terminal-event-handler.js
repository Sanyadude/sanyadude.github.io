import TERMINAL_EVENT_TYPE from './terminal-event-type.js'
import KEY_BINDINGS from '../config/key-bindings.js'
import MOUSE_BINDINGS from '../config/mouse-bindings.js'
import ACTIONS from '../config/actions.js'
import COMMANDS from '../config/commands.js'

/**
 * TerminalEventHandler - Handles dispatched TerminalEvents (shell mode)
 */
export class TerminalEventHandler {
    /**
     * Creates a new TerminalEventHandler instance
     * @param {object} context - The terminal context
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Handles a normalized terminal event
     * @param {TerminalEvent} terminalEvent - The terminal event to handle
     */
    handle(terminalEvent) {
        this._handleShell(terminalEvent);
    }

    /**
     * Handles a terminal event in shell (cooked) mode
     * @param {TerminalEvent} terminalEvent - The terminal event to handle
     */
    _handleShell(terminalEvent) {
        switch (terminalEvent.type) {
            case TERMINAL_EVENT_TYPE.KEY:
                this._handleShellKey(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.MOUSE:
                this._handleShellMouse(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SELECTION_START:
                this._handleShellSelectionStart(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SELECTION_UPDATE:
                this._handleShellSelectionUpdate(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SELECTION_END:
                this._handleShellSelectionEnd(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SCROLL_STEP:
                this._handleShellScrollStep(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.SCROLL:
                this._handleShellScroll(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.RESIZE:
                this._handleShellResize(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.DROP:
                this._handleShellDrop(terminalEvent);
                break;
            case TERMINAL_EVENT_TYPE.THEME:
                this._handleShellTheme(terminalEvent);
                break;
            default:
                break;
        }
    }

    /**
     * Handles a key event in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellKey(terminalEvent) {
        const action = KEY_BINDINGS[terminalEvent.name.toLowerCase()]
            || (terminalEvent.data.printable ? ACTIONS.INSERT_CHAR : null);
        const command = COMMANDS[action];
        if (!command) return;
        terminalEvent.originalEvent?.preventDefault?.();
        command.execute(this._context, {
            event: terminalEvent.originalEvent,
            terminalEvent,
        });
    }

    /**
     * Handles a mouse event in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellMouse(terminalEvent) {
        const action = MOUSE_BINDINGS[terminalEvent.name];
        if (!action) return;
        const command = COMMANDS[action];
        if (!command) return;
        command.execute(this._context, {
            event: terminalEvent.originalEvent,
            position: terminalEvent.data.position,
            terminalEvent,
        });
    }

    /**
     * Handles selection start in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellSelectionStart(terminalEvent) {
        const { start, altKey } = terminalEvent.data;
        if (altKey) {
            this._context.textSelection.setModeBlock();
        } else {
            this._context.textSelection.setModeLine();
        }
        const absolutePosition = this._context.textViewport.getAbsolutePositionFromCoordinates(start.x, start.y);
        this._context.textSelection.setActive();
        this._context.textSelection.setStart(absolutePosition.line, absolutePosition.column);
    }

    /**
     * Handles selection update in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellSelectionUpdate(terminalEvent) {
        const { end } = terminalEvent.data;
        const absolutePosition = this._context.textViewport.getAbsolutePositionFromCoordinates(end.x, end.y);
        this._context.textSelection.setEnd(absolutePosition.line, absolutePosition.column);
        this._context.terminalApi.render();
    }

    /**
     * Handles selection end in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellSelectionEnd(terminalEvent) {
        const { end } = terminalEvent.data;
        const absolutePosition = this._context.textViewport.getAbsolutePositionFromCoordinates(end.x, end.y);
        this._context.textSelection.setEnd(absolutePosition.line, absolutePosition.column);
        this._context.terminalApi.render();
    }

    /**
     * Handles scroll step in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellScrollStep(terminalEvent) {
        const { scrollStep } = terminalEvent.data;
        this._context.textViewport.scrollY(scrollStep);
        const scrollPosition = this._context.scrollBoundsProvider.getScrollPositionFromOffsetLine(
            this._context.textViewport.getOffsetLine()
        );
        this._context.terminalViewport.setScrollThumbPosition(scrollPosition);
        this._context.terminalApi.render();
        this._context.terminalApi.renderCursor();
    }

    /**
     * Handles scroll in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellScroll(terminalEvent) {
        const { scrollPosition } = terminalEvent.data;
        const newOffsetLine = this._context.scrollBoundsProvider.getOffsetLineFromScrollPosition(scrollPosition);
        const currentOffsetLine = this._context.textViewport.getOffsetLine();
        if (newOffsetLine === currentOffsetLine) return;
        this._context.textViewport.setOffsetLine(newOffsetLine);
        this._context.terminalApi.render();
        this._context.terminalApi.renderCursor();
    }

    /**
     * Handles resize in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellResize(terminalEvent) {
        this._context.textBuffer.recalculateBufferLayout();
        this._context.textRenderer.populateContainer();
        this._context.terminalApi.render();
        this._context.terminalApi.renderCursor();
    }

    /**
     * Handles file drop in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellDrop(terminalEvent) {
        const files = terminalEvent.data.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = new Uint8Array(event.target.result);
                const path = this._context.fileSystemExplorer.getCurrentPath() + '/' + file.name;
                this._context.fileSystemManager.createFile(path, content, true);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    /**
     * Handles theme change in shell mode
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _handleShellTheme(terminalEvent) {
        const { theme } = terminalEvent.data;
        this._context.textRenderer.resetCache();
        this._context.terminalViewport.applyTheme(theme);
        this._context.cursorRenderer.applyTheme(theme);
    }
}

export default TerminalEventHandler
