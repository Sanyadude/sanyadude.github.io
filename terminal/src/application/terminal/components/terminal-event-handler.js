import { KEY_BINDINGS } from '../config/key-bindings.js'
import { MOUSE_BINDINGS } from '../config/mouse-bindings.js'
import { ACTIONS } from '../config/actions.js'
import { COMMANDS } from '../config/commands.js'

/**
 * Terminal event handler
 */
export class TerminalEventHandler {
    /**
     * Creates a new TerminalEventHandler instance
     * @param {object} context - The context of the terminal
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Adds the listeners for the terminal
     */
    addListeners() {
        const terminalViewport = this._context.terminalViewport;
        const themeProvider = this._context.themeProvider;
        terminalViewport.onDrop = (event) => {
            this.handleDrop(event.uiEvent);
        };
        terminalViewport.onClick = (event) => {
            this.handleClick(event.uiEvent, event.position);
        };
        terminalViewport.onSelectionStart = (event) => {
            this.handleSelectionStart(event.uiEvent, event.start, event.end);
        };
        terminalViewport.onSelectionUpdate = (event) => {
            this.handleSelectionUpdate(event.uiEvent, event.start, event.end);
        };
        terminalViewport.onSelectionEnd = (event) => {
            this.handleSelectionEnd(event.uiEvent, event.start, event.end);
        };
        terminalViewport.onScrollStep = (event) => {
            this.handleScrollStep(event.uiEvent, event.scrollStep);
        };
        terminalViewport.onScroll = (event) => {
            this.handleScroll(event.uiEvent, event.scrollPosition);
        };
        terminalViewport.onResize = (event) => {
            this.handleResize(event.uiEvent, event.layout);
        };
        terminalViewport.onKeyDown = (event) => {
            this.handleKeyDown(event.uiEvent);
        };
        themeProvider.onThemeChange = (event) => {
            this.handleThemeChange(event.theme);
        };
    }

    /**
     * Gets the mouse combination from the event
     * @param {MouseEvent} event - The mouse event
     * @returns {string} - The mouse combination
     */
    _getMouseCombinationFromEvent(event) {
        const parts = [];
        if (event.button === 0) parts.push('LeftClick');
        if (event.button === 1) parts.push('MiddleClick');
        if (event.button === 2) parts.push('RightClick');
        return parts.join('+');
    }

    /**
     * Gets the key combination from the event
     * @param {KeyboardEvent} event - The keyboard event
     * @returns {string} - The key combination
     */
    _getKeyCombinationFromEvent(event) {
        const parts = [];
        if (event.ctrlKey && event.key !== 'Control') parts.push('Control');
        if (event.altKey && event.key !== 'Alt') parts.push('Alt');
        if (event.shiftKey && event.key !== 'Shift') parts.push('Shift');
        if (event.metaKey && event.key !== 'Meta') parts.push('Meta');
        parts.push(event.key);
        return parts.join('+');
    }

    /**
     * Handles the drop event for the terminal
     * @param {DragEvent} event - The drop event
     */
    handleDrop(event) {
        const files = event.dataTransfer.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = new Uint8Array(event.target.result);
                this._context.fileSystemExplorer.createFile(file.name, content, true);
                this._context.inputCompletion.setOptions(this._context.shell.getCwdCompletionList());
            };
            reader.readAsArrayBuffer(file);
        }
    }

    /**
     * Handles the resize event for the terminal
     * @param {object} event - The resize event
     * @param {TerminalLayout} layout - The layout of the terminal
     */
    handleResize(event, layout) {
        this._context.textBuffer.recalculateBufferLayout();
        this._context.textRenderer.populateContainer();
        this._context.terminalApi.render();
        this._context.terminalApi.renderCursor();
    }

    /**
     * Handles the scroll step event for the terminal
     * @param {MouseEvent} event - The mouse event
     * @param {number} scrollStep - The scroll step
     */
    handleScrollStep(event, scrollStep) {
        this._context.textViewport.scrollY(scrollStep);
        const scrollPosition = this._context.scrollBoundsProvider.getScrollPositionFromOffsetLine(this._context.textViewport.getOffsetLine());
        this._context.terminalViewport.setScrollThumbPosition(scrollPosition);
        this._context.terminalApi.render();
        this._context.terminalApi.renderCursor();
    }

    /**
     * Handles the scroll event for the terminal
     * @param {MouseEvent} event - The mouse event
     * @param {number} scrollPosition - The scroll position
     */
    handleScroll(event, scrollPosition) {
        const newOffsetLine = this._context.scrollBoundsProvider.getOffsetLineFromScrollPosition(scrollPosition);
        const currentOffsetLine = this._context.textViewport.getOffsetLine();
        if (newOffsetLine === currentOffsetLine) return;
        this._context.textViewport.setOffsetLine(newOffsetLine);
        this._context.terminalApi.render();
        this._context.terminalApi.renderCursor();
    }

    /**
     * Handles the click event for the terminal
     * @param {MouseEvent} event - The click event
     * @param {object} position - The position of the click
     */
    handleClick(event, position) {
        const mouseCombination = this._getMouseCombinationFromEvent(event);
        const action = MOUSE_BINDINGS[mouseCombination];
        if (!action) return;
        const command = COMMANDS[action];
        if (!command) return;
        command.execute(this._context, { event, position });
    }

    /**
     * Handles the selection start event for the terminal
     * @param {MouseEvent} event - The selection start event
     * @param {object} start - The start position of the selection
     * @param {object} end - The end position of the selection
     */
    handleSelectionStart(event, start, end) {
        if (event.altKey) {
            this._context.textSelection.setModeBlock();
        } else {
            this._context.textSelection.setModeLine();
        }
        const absolutePosition = this._context.textViewport.getAbsolutePositionFromCoordinates(start.x, start.y);
        this._context.textSelection.setActive();
        this._context.textSelection.setStart(absolutePosition.line, absolutePosition.column);
    }

    /**
     * Handles the selection update event for the terminal
     * @param {MouseEvent} event - The selection update event
     * @param {object} start - The start position of the selection
     * @param {object} end - The end position of the selection
     */
    handleSelectionUpdate(event, start, end) {
        const absolutePosition = this._context.textViewport.getAbsolutePositionFromCoordinates(end.x, end.y);
        this._context.textSelection.setEnd(absolutePosition.line, absolutePosition.column);
        this._context.terminalApi.render();
    }

    /**
     * Handles the selection end event for the terminal
     * @param {MouseEvent} event - The selection end event
     * @param {object} start - The start position of the selection
     * @param {object} end - The end position of the selection
     */
    handleSelectionEnd(event, start, end) {
        const absolutePosition = this._context.textViewport.getAbsolutePositionFromCoordinates(end.x, end.y);
        this._context.textSelection.setEnd(absolutePosition.line, absolutePosition.column);
        this._context.terminalApi.render();
    }

    /**
     * Handles the key down event
     * @param {KeyboardEvent} event - The key down event
     */
    handleKeyDown(event) {
        const keyCombination = this._getKeyCombinationFromEvent(event);
        const action = KEY_BINDINGS[keyCombination] || (event.key.length === 1 ? ACTIONS.INSERT_CHAR : null);
        const command = COMMANDS[action];
        if (!command) return;
        event.preventDefault();
        command.execute(this._context, { event });
    }

    /**
     * Handles the theme change event
     * @param {object} theme - The theme
     */
    handleThemeChange(theme) {
        this._context.textRenderer.resetCache();
        this._context.terminalViewport.applyTheme(theme);
        this._context.cursorRenderer.applyTheme(theme);
    }
}

export default TerminalEventHandler