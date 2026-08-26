import TerminalEvent from './terminal-event.js'
import TERMINAL_EVENT_TYPE from './terminal-event-type.js'

/**
 * TerminalEventDispatcher - Listens to UI events and dispatches TerminalEvents
 */
export class TerminalEventDispatcher {
    /**
     * Creates a new TerminalEventDispatcher instance
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
            this._dispatchDrop(event.uiEvent);
        };
        terminalViewport.onClick = (event) => {
            this._dispatchClick(event.uiEvent, event.position);
        };
        terminalViewport.onSelectionStart = (event) => {
            this._dispatchSelectionStart(event.uiEvent, event.start, event.end);
        };
        terminalViewport.onSelectionUpdate = (event) => {
            this._dispatchSelectionUpdate(event.uiEvent, event.start, event.end);
        };
        terminalViewport.onSelectionEnd = (event) => {
            this._dispatchSelectionEnd(event.uiEvent, event.start, event.end);
        };
        terminalViewport.onScrollStep = (event) => {
            this._dispatchScrollStep(event.uiEvent, event.scrollStep);
        };
        terminalViewport.onScroll = (event) => {
            this._dispatchScroll(event.uiEvent, event.scrollPosition);
        };
        terminalViewport.onResize = (event) => {
            this._dispatchResize(event.uiEvent, event.layout);
        };
        terminalViewport.onKeyDown = (event) => {
            this._dispatchKeyDown(event.uiEvent);
        };
        themeProvider.onThemeChange = (event) => {
            this._dispatchThemeChange(event.theme);
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
        if (event.key === '\n') {
            parts.push('Enter');
        } else {
            parts.push(event.key);
        }
        return parts.join('+');
    }

    /**
     * Dispatches a terminal event to the terminal
     * @param {TerminalEvent} terminalEvent - The terminal event
     */
    _dispatch(terminalEvent) {
        this._context.dispatch(terminalEvent);
    }

    /**
     * Dispatches a drop event
     * @param {DragEvent} event - The drop event
     */
    _dispatchDrop(event) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.DROP,
            name: 'drop',
            data: {
                files: Array.from(event.dataTransfer?.files || []),
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a resize event
     * @param {object} event - The resize event
     * @param {TerminalLayout} layout - The layout of the terminal
     */
    _dispatchResize(event, layout) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.RESIZE,
            name: 'resize',
            data: { layout },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a scroll step event
     * @param {MouseEvent} event - The mouse event
     * @param {number} scrollStep - The scroll step
     */
    _dispatchScrollStep(event, scrollStep) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.SCROLL_STEP,
            name: 'scrollStep',
            data: {
                scrollStep,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a scroll event
     * @param {MouseEvent} event - The mouse event
     * @param {number} scrollPosition - The scroll position
     */
    _dispatchScroll(event, scrollPosition) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.SCROLL,
            name: 'scroll',
            data: {
                scrollPosition,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a click event
     * @param {MouseEvent} event - The click event
     * @param {object} position - The position of the click
     */
    _dispatchClick(event, position) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.MOUSE,
            name: this._getMouseCombinationFromEvent(event),
            data: {
                position,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a selection start event
     * @param {MouseEvent} event - The selection start event
     * @param {object} start - The start position of the selection
     * @param {object} end - The end position of the selection
     */
    _dispatchSelectionStart(event, start, end) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.SELECTION_START,
            name: 'selectionStart',
            data: {
                start,
                end,
                altKey: event.altKey,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a selection update event
     * @param {MouseEvent} event - The selection update event
     * @param {object} start - The start position of the selection
     * @param {object} end - The end position of the selection
     */
    _dispatchSelectionUpdate(event, start, end) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.SELECTION_UPDATE,
            name: 'selectionUpdate',
            data: {
                start,
                end,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a selection end event
     * @param {MouseEvent} event - The selection end event
     * @param {object} start - The start position of the selection
     * @param {object} end - The end position of the selection
     */
    _dispatchSelectionEnd(event, start, end) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.SELECTION_END,
            name: 'selectionEnd',
            data: {
                start,
                end,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a key down event
     * @param {KeyboardEvent} event - The keyboard event
     */
    _dispatchKeyDown(event) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.KEY,
            name: this._getKeyCombinationFromEvent(event),
            data: {
                key: event.key,
                keyCode: event.keyCode,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                shift: event.shiftKey,
                meta: event.metaKey,
                printable: event.key.length === 1,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a theme change event
     * @param {object} theme - The theme
     */
    _dispatchThemeChange(theme) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.THEME,
            name: 'themeChange',
            data: {
                theme,
            },
        }));
    }
}

export default TerminalEventDispatcher
