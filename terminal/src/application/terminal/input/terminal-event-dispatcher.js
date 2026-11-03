import { TerminalEvent } from './terminal-event.js'
import { TERMINAL_EVENT_TYPE } from './terminal-event-type.js'
import { BufferPosition } from '../buffer/buffer-position.js'

/**
 * TerminalEventDispatcher - Listens to UI events and dispatches TerminalEvents
 */
export class TerminalEventDispatcher {
    /**
     * Creates a new TerminalEventDispatcher instance
     * @param {object} context The context of the terminal
     */
    constructor(context) {
        this._context = context;
        this._unsubscribers = [];
    }

    /**
     * Adds the listeners for the terminal
     */
    addListeners() {
        this.removeListeners();
        const dom = this._context.dom;
        const themeProvider = this._context.themeProvider;
        this._unsubscribers = [
            dom.onPress((event) => {
                this._dispatchPress(event.uiEvent, event.point);
            }),
            dom.onRelease((event) => {
                this._dispatchRelease(event.uiEvent, event.point);
            }),
            dom.onClick((event) => {
                this._dispatchClick(event.uiEvent, event.point, event.count);
            }),
            dom.onSelection((event) => {
                this._dispatchSelection(event.uiEvent, event.start, event.end, event.phase);
            }),
            dom.onScrollStep((event) => {
                this._dispatchScrollStep(event.uiEvent, event.scrollStep);
            }),
            dom.onScroll((event) => {
                this._dispatchScroll(event.uiEvent, event.scrollPosition);
            }),
            dom.onResize((event) => {
                this._dispatchResize(event.uiEvent, event.layout);
            }),
            dom.onMousePress((event) => {
                this._dispatchMouse(event.uiEvent, event.point, 'press');
            }),
            dom.onMouseMove((event) => {
                this._dispatchMouse(event.uiEvent, event.point, 'move');
            }),
            dom.onMouseRelease((event) => {
                this._dispatchMouse(event.uiEvent, event.point, 'release');
            }),
            dom.onKey((event) => {
                this._dispatchKey(event.uiEvent);
            }),
            themeProvider.onThemeChange((event) => {
                this._dispatchThemeChange(event.theme);
            }),
        ];
    }

    /**
     * Removes the listeners added by addListeners
     */
    removeListeners() {
        for (const unsubscribe of this._unsubscribers) {
            unsubscribe();
        }
        this._unsubscribers = [];
    }

    /**
     * Gets the mouse combination from the event
     * Returns a lowercase combination so every consumer can look it up directly, with no normalization of its own
     * @param {MouseEvent} event The mouse event
     * @param {string} kind The action name, Press, Release, or Click
     * @returns {string} The mouse combination
     */
    _getMouseCombinationFromEvent(event, kind) {
        const parts = [];
        if (event.button === 0) parts.push(`Left${kind}`);
        if (event.button === 1) parts.push(`Middle${kind}`);
        if (event.button === 2) parts.push(`Right${kind}`);
        return parts.join('+').toLowerCase();
    }

    /**
     * Gets the key combination from the event
     * Returns a lowercase combination so every consumer can look it up directly, with no normalization of its own
     * @param {KeyboardEvent} event The keyboard event
     * @returns {string} The key combination
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
        return parts.join('+').toLowerCase();
    }

    /**
     * Dispatches a terminal event to the terminal
     * @param {TerminalEvent} terminalEvent The terminal event
     */
    _dispatch(terminalEvent) {
        this._context.eventHandler.handle(terminalEvent);
    }

    /**
     * Dispatches a resize event
     * @param {object} event The resize event
     * @param {TerminalLayout} layout The layout of the terminal
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
     * @param {MouseEvent} event The mouse event
     * @param {number} scrollStep The scroll step
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
     * @param {MouseEvent} event The mouse event
     * @param {number} scrollPosition The scroll position
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
     * Returns the document position of the cell under a viewport point
     * @param {object} point The viewport point in pixels
     * @returns {BufferPosition} The document position
     */
    _cellPosition(point = {}) {
        const { row, column } = this._context.textViewport.getAbsolutePositionFromCoordinates(point.x, point.y);
        return new BufferPosition(row, column);
    }

    /**
     * Builds the pointer payload for a terminal event
     * @param {object} point The viewport point in pixels
     * @returns {object} The pointer payload
     */
    _pointerData(point) {
        return {
            point,
            cell: this._cellPosition(point),
        };
    }

    /**
     * Dispatches a press event
     * @param {MouseEvent} event The press event
     * @param {object} point The viewport point in pixels
     */
    _dispatchPress(event, point) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.PRESS,
            name: this._getMouseCombinationFromEvent(event, 'Press'),
            data: this._pointerData(point),
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a release event
     * @param {MouseEvent} event The release event
     * @param {object} point The viewport point in pixels
     */
    _dispatchRelease(event, point) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.RELEASE,
            name: this._getMouseCombinationFromEvent(event, 'Release'),
            data: this._pointerData(point),
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a click event
     * @param {MouseEvent} event The click event
     * @param {object} point The viewport point in pixels
     * @param {number} count The click count
     */
    _dispatchClick(event, point, count) {
        const clickCount = count === 2 || count === 3 ? count : 1;
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.CLICK,
            name: this._getMouseCombinationFromEvent(event, `${clickCount}Click`),
            data: this._pointerData(point),
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a selection start event
     * @param {MouseEvent} event The selection start event
     * @param {object} start The start position of the selection
     * @param {object} end The end position of the selection
     * @param {string} phase The phase of the selection
     */
    _dispatchSelection(event, start, end, phase) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.SELECTION,
            name: 'selection',
            data: {
                start,
                end,
                startCell: this._cellPosition(start),
                endCell: this._cellPosition(end),
                phase,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                shift: event.shiftKey,
                meta: event.metaKey,
            },
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a mouse event
     * @param {MouseEvent} event The mouse event
     * @param {object} point The viewport point in pixels
     * @param {string} type The type of the mouse event
     */
    _dispatchMouse(event, point, type) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.MOUSE,
            name: `mouse${type}`,
            data: this._pointerData(point),
            originalEvent: event,
        }));
    }

    /**
     * Dispatches a key event
     * @param {KeyboardEvent} event The keyboard event
     */
    _dispatchKey(event) {
        this._dispatch(new TerminalEvent({
            type: TERMINAL_EVENT_TYPE.KEY,
            name: this._getKeyCombinationFromEvent(event),
            data: {
                key: event.key,
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
     * @param {object} theme The theme
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