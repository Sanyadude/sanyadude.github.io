import { CharacterMeasurement } from './character-measurement.js'
import { OffsetMeasurement } from './offset-measurement.js'
import { TerminalLayout } from './terminal-layout.js'
import { TextFormat } from './text-format.js'
import { LayoutProvider } from './layout-provider.js'
import { VirtualKeyboard } from './virtual-keyboard.js'
import { 
    TERMINAL_DEFAULT_COLORS,
    TERMINAL_ARROW_SCROLL_LINES_AMOUNT, TERMINAL_WHEEL_SCROLL_LINES_AMOUNT,
    TERMINAL_CLICK_DETECTION_TIME_THRESHOLD, TERMINAL_CLICK_DETECTION_MOVE_THRESHOLD,
    TERMINAL_TAP_DETECTION_MOVE_THRESHOLD,
    TERMINAL_DEFAULT_FONT_SIZE, TERMINAL_DEFAULT_PADDING, TERMINAL_DEFAULT_SCROLL_BAR_SIZE,
    TERMINAL_CONFIG_FONT_SIZE_KEY, TERMINAL_CONFIG_PADDING_KEY, TERMINAL_CONFIG_SCROLL_BAR_SIZE_KEY 
} from '../config/config.js'

/**
 * TerminalViewport class - represents a terminal UI for the terminal
 */
export class TerminalViewport {
    /**
     * Creates a new TerminalViewport instance
     * @param {HTMLElement} container - The container element for the terminal
     * @param {ConfigProvider} configProvider - The config provider
     */
    constructor(container, configProvider) {
        this._container = container;
        this._configProvider = configProvider;
        this._layoutProvider = new LayoutProvider();
        this._virtualKeyboard = new VirtualKeyboard();

        this._fontSize = TERMINAL_DEFAULT_FONT_SIZE;
        this._padding = TERMINAL_DEFAULT_PADDING;
        this._scrollBarSize = TERMINAL_DEFAULT_SCROLL_BAR_SIZE;
        this._arrowScrollLinesAmount = TERMINAL_ARROW_SCROLL_LINES_AMOUNT;
        this._wheelScrollLinesAmount = TERMINAL_WHEEL_SCROLL_LINES_AMOUNT;

        this._clickingState = null;
        this._clickDetectionTimeThreshold = TERMINAL_CLICK_DETECTION_TIME_THRESHOLD;
        this._clickDetectionMoveThreshold = TERMINAL_CLICK_DETECTION_MOVE_THRESHOLD;
        this._touchingState = null;
        this._tapDetectionMoveThreshold = TERMINAL_TAP_DETECTION_MOVE_THRESHOLD;

        this._isScrolling = false;
        this._scrollingState = null;

        this._isSelecting = false;
        this._selectionState = null;

        this._applyThemeToScrollContainer = false;

        this._charSizeCache = new Map();

        this._dropListeners = new Set();
        this._resizeListeners = new Set();
        this._clickListeners = new Set();
        this._keyDownListeners = new Set();
        this._selectionStartListeners = new Set();
        this._selectionEndListeners = new Set();
        this._selectionUpdateListeners = new Set();
        this._scrollStepListeners = new Set();
        this._scrollListeners = new Set();

        this._init();
        this._initListeners();
    }

    /**
     * Initializes the terminal UI
     */
    _init() {
        this._applyConfig();
        // Add style element
        this._addStyleElement();
        // Create container
        this._containerElement = this._createContainer();
        this._container.appendChild(this._containerElement);
        this._containerElement.focus();
        // Create scroll container
        this._scrollContainerElement = this._createScrollContainer();
        this._scrollArrowUpElement = this._createScrollArrowUp();
        this._scrollContainerElement.appendChild(this._scrollArrowUpElement);
        this._scrollArrowDownElement = this._createScrollArrowDown();
        this._scrollContainerElement.appendChild(this._scrollArrowDownElement);
        this._scrollThumbElement = this._createScrollThumb();
        this._scrollContainerElement.appendChild(this._scrollThumbElement);
        this._containerElement.appendChild(this._scrollContainerElement);
        // Create viewport container
        this._viewportContainerElement = this._createViewportContainer();
        this._containerElement.appendChild(this._viewportContainerElement);
        // Create input element
        this._inputElement = this._virtualKeyboard.getInput();
        this._containerElement.appendChild(this._inputElement);
        this._virtualKeyboard.focus();
        // Compute the layout
        this._layoutProvider.setLayout(this.computeLayout());
    }

    /**
     * Applies the config to the terminal
     */
    _applyConfig() {
        const fontSize = this._configProvider.get(TERMINAL_CONFIG_FONT_SIZE_KEY);
        if (fontSize && !isNaN(fontSize)) {
            this._fontSize = Number(fontSize);
        }
        const padding = this._configProvider.get(TERMINAL_CONFIG_PADDING_KEY);
        if (padding && !isNaN(padding)) {
            this._padding = Number(padding);
        }
        const scrollBarSize = this._configProvider.get(TERMINAL_CONFIG_SCROLL_BAR_SIZE_KEY);
        if (scrollBarSize && !isNaN(scrollBarSize)) {
            this._scrollBarSize = Number(scrollBarSize);
        }
    }

    /**
     * Creates the style element for the terminal and adds it to the head of the document
     */
    _addStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.textContent = TextFormat.getStyles();
        document.head.appendChild(styleElement);
    }

    /**
     * Creates the container for the terminal
     */
    _createContainer() {
        const containerElement = document.createElement('div');
        Object.assign(containerElement.style, {
            position: 'relative',
            fontFamily: 'Consolas, monospace',
            fontSize: `${this._fontSize}px`,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
            cursor: 'default',
            userSelect: 'none',
            padding: `${this._padding}px`,
            paddingRight: `${this._scrollBarSize + this._padding}px`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            outline: 'none',
            touchAction: 'none',
        });
        containerElement.setAttribute('tabindex', '0');
        return containerElement;
    }

    /**
     * Creates the viewport container for the terminal
     */
    _createViewportContainer() {
        const viewportContainerElement = document.createElement('div');
        Object.assign(viewportContainerElement.style, {
            width: '100%',
            height: '100%',
        });
        return viewportContainerElement;
    }

    /**
     * Creates the scroll container for the terminal
     */
    _createScrollContainer() {
        const scrollContainerElement = document.createElement('div');
        Object.assign(scrollContainerElement.style, {
            position: 'absolute',
            top: '0',
            right: '0',
            width: `${this._scrollBarSize}px`,
            height: '100%',
            backgroundColor: TERMINAL_DEFAULT_COLORS.PRIMARY,
        });
        return scrollContainerElement;
    }

    /**
     * Creates the scroll thumb for the terminal
     */
    _createScrollThumb() {
        const scrollThumbElement = document.createElement('div');
        Object.assign(scrollThumbElement.style, {
            position: 'absolute',
            top: `${this._scrollBarSize}px`,
            left: '0px',
            width: `${this._scrollBarSize}px`,
            height: `${this._scrollBarSize + 2}px`,
            backgroundColor: TERMINAL_DEFAULT_COLORS.SECONDARY,
            border: `1px solid ${TERMINAL_DEFAULT_COLORS.PRIMARY}`,
            boxSizing: 'border-box',
            cursor: 'pointer',
        });
        return scrollThumbElement;
    }

    /**
     * Creates the scroll arrow up element for the terminal
     */
    _createScrollArrowUp() {
        const scrollArrowUpElement = document.createElement('div');
        Object.assign(scrollArrowUpElement.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: `${this._scrollBarSize}px`,
            height: `${this._scrollBarSize}px`,
            fontSize: `${this._scrollBarSize}px`,
            lineHeight: `${this._scrollBarSize}px`,
            color: TERMINAL_DEFAULT_COLORS.ACCENT,
            backgroundColor: TERMINAL_DEFAULT_COLORS.PRIMARY,
            border: `1px solid ${TERMINAL_DEFAULT_COLORS.PRIMARY}`,
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
        });
        scrollArrowUpElement.textContent = '▲';
        return scrollArrowUpElement;
    }

    /**
     * Creates the scroll arrow down element for the terminal
     */
    _createScrollArrowDown() {
        const scrollArrowDownElement = document.createElement('div');
        Object.assign(scrollArrowDownElement.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: `${this._scrollBarSize}px`,
            height: `${this._scrollBarSize}px`,
            fontSize: `${this._scrollBarSize}px`,
            lineHeight: `${this._scrollBarSize}px`,
            color: TERMINAL_DEFAULT_COLORS.ACCENT,
            backgroundColor: TERMINAL_DEFAULT_COLORS.PRIMARY,
            border: `1px solid ${TERMINAL_DEFAULT_COLORS.PRIMARY}`,
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
        });
        scrollArrowDownElement.textContent = '▼';
        return scrollArrowDownElement;
    }

    /**
     * Initializes the listeners for the terminal
     */
    _initListeners() {
        this._containerElement.addEventListener('contextmenu', (event) => {
            this._handleContextMenu(event);
        });
        this._containerElement.addEventListener('dragover', (event) => {
            this._handleDragOver(event);
        });
        this._containerElement.addEventListener('drop', (event) => {
            this._handleDrop(event);
        });
        this._containerElement.addEventListener('mousedown', (event) => {
            this._handleMouseDown(event);
        });
        this._containerElement.addEventListener('mousemove', (event) => {
            this._handleMouseMove(event);
        });
        this._containerElement.addEventListener('mouseup', (event) => {
            this._handleMouseUp(event);
        });
        const touchOptions = { passive: false };
        this._containerElement.addEventListener('touchstart', (event) => {
            this._handleTouchStart(event);
        }, touchOptions);
        this._containerElement.addEventListener('touchmove', (event) => {
            this._handleTouchMove(event);
        }, touchOptions);
        this._containerElement.addEventListener('touchend', (event) => {
            this._handleTouchEnd(event);
        }, touchOptions);
        this._containerElement.addEventListener('touchcancel', (event) => {
            this._handleTouchCancel(event);
        }, touchOptions);
        this._containerElement.addEventListener('wheel', (event) => {
            this._handleWheel(event);
        });
        this._containerElement.addEventListener('keydown', (event) => {
            this._handleKeyDown(event);
        });
        this._virtualKeyboard.onKey((event) => {
            this._emitKeyDown({
                uiEvent: event
            });
        });
        const resizeObserver = new ResizeObserver((entries) => {
            this._handleResize();
        });
        resizeObserver.observe(this._containerElement);
    }

    /**
     * Handles the context menu event for container
     * @param {MouseEvent} event - The context menu event
     */
    _handleContextMenu(event) {
        event.preventDefault();
    }

    /**
     * Handles the drag over event for container
     * @param {DragEvent} event - The drag over event
     */
    _handleDragOver(event) {
        event.preventDefault();
    }

    /**
     * Handles the drop event for container
     * @param {DragEvent} event - The drop event
     */
    _handleDrop(event) {
        event.preventDefault();
        this._emitDrop({
            uiEvent: event,
            position: this._getViewportPosition(event)
        });
    }

    /**
     * Handles the resize event for container
     */
    _handleResize() {
        const layout = this.computeLayout();
        this._layoutProvider.setLayout(layout);
        this._emitResize({
            uiEvent: null,
            layout: layout
        });
    }

    /**
     * Handles the mouse down event for container
     * @param {MouseEvent} event - The mouse down event
     */
    _handleMouseDown(event) {
        if (event.target === this._scrollContainerElement) {
            this._scrollToClick(event);
            return;
        }
        if (event.button === 0 && event.target === this._scrollArrowUpElement) {
            this._scrollStep(event, -this._arrowScrollLinesAmount);
            return;
        }
        if (event.button === 0 && event.target === this._scrollArrowDownElement) {
            this._scrollStep(event, this._arrowScrollLinesAmount);
            return;
        }
        if (event.button === 0 && event.target === this._scrollThumbElement) {
            this._startScrolling(event);
            return;
        }
        this._clickingState = {
            event: event,
            timestamp: Date.now()
        };
    }

    /**
     * Handles the mouse move event for container
     * @param {MouseEvent} event - The mouse move event
     */
    _handleMouseMove(event) {
        if (this._isScrolling) {
            this._scrollingUpdate(event);
            return;
        }
        if (this._clickingState) {
            const dx = event.clientX - this._clickingState.event.clientX;
            const dy = event.clientY - this._clickingState.event.clientY;
            if (dx * dx + dy * dy > this._clickDetectionMoveThreshold ** 2) {
                if (this._clickingState.event.button === 0) {
                    this._selectionStart(this._clickingState.event);
                }
                this._clickingState = null;
            }
        }
        if (this._isSelecting) {
            this._selectionUpdate(event);
        }
    }

    /**
     * Handles the mouse up event for container
     * @param {MouseEvent} event - The mouse up event
     */
    _handleMouseUp(event) {
        if (event.button === 0 && this._isScrolling) {
            this._stopScrolling();
            return;
        }
        if (event.button === 0 && this._isSelecting) {
            this._selectionEnd(event);
            return;
        }
        if (this._clickingState) {
            const elapsedTime = Date.now() - this._clickingState.timestamp;
            const sameButton = this._clickingState.event.button === event.button;
            if (elapsedTime <= this._clickDetectionTimeThreshold && sameButton) {
                this._emitClick({
                    uiEvent: event,
                    position: this._getViewportPosition(event)
                });
            }
            this._clickingState = null;
            this._virtualKeyboard.focus();
        }
    }

    /**
     * Handles the wheel event for container
     * @param {WheelEvent} event - The wheel event
     */
    _handleWheel(event) {
        this._scrollStep(event, event.deltaY < 0 ? -this._wheelScrollLinesAmount : this._wheelScrollLinesAmount);
    }

    /**
     * Handles the touch start event for container
     * @param {TouchEvent} event - The touch start event
     */
    _handleTouchStart(event) {
        if (event.touches.length !== 1) return;
        if (this._isScrollControlTarget(event.target)) return;
        const point = this._getEventPoint(event);
        event.preventDefault();
        this._touchingState = {
            identifier: point.identifier,
            startX: point.clientX,
            startY: point.clientY,
            lastY: point.clientY,
            accumulatedY: 0,
            scrolling: false,
            timestamp: Date.now()
        };
    }

    /**
     * Handles the touch move event for container
     * @param {TouchEvent} event - The touch move event
     */
    _handleTouchMove(event) {
        if (!this._touchingState) return;
        const point = this._getTouchById(event, this._touchingState.identifier);
        if (!point) return;
        if (!this._touchingState.scrolling) {
            const dx = point.clientX - this._touchingState.startX;
            const dy = point.clientY - this._touchingState.startY;
            if (dx * dx + dy * dy <= this._tapDetectionMoveThreshold ** 2) return;
            this._touchingState.scrolling = true;
        }
        event.preventDefault();
        this._touchingState.accumulatedY += point.clientY - this._touchingState.lastY;
        this._touchingState.lastY = point.clientY;
        const layout = this._layoutProvider.getLayout();
        const lineHeight = layout.charHeight > 0 ? layout.charHeight : this._fontSize;
        const lines = Math.trunc(this._touchingState.accumulatedY / lineHeight);
        if (lines === 0) return;
        this._touchingState.accumulatedY -= lines * lineHeight;
        this._scrollStep(event, -lines);
    }

    /**
     * Handles the touch end event for container
     * @param {TouchEvent} event - The touch end event
     */
    _handleTouchEnd(event) {
        if (!this._touchingState) return;
        const point = this._getTouchById(event, this._touchingState.identifier);
        if (!point) return;
        const wasScrolling = this._touchingState.scrolling;
        this._touchingState = null;
        if (wasScrolling) return;
        const clickEvent = this._transformTapToLeftClick(event, point);
        this._emitClick({
            uiEvent: clickEvent,
            position: this._getViewportPosition(clickEvent)
        });
        this._virtualKeyboard.focus();
    }

    /**
     * Handles the touch cancel event for container
     */
    _handleTouchCancel() {
        this._touchingState = null;
    }

    /**
     * Handles the key down event for container
     * @param {KeyboardEvent} event - The key down event
     */
    _handleKeyDown(event) {
        const keyEvent = this._virtualKeyboard.consumeKeyDown(event);
        if (!keyEvent) return;
        this._emitKeyDown({
            uiEvent: keyEvent
        });
    }

    /**
     * Handles the selection start event for container
     * @param {MouseEvent} event - The selection start event
     */
    _selectionStart(event) {
        this._isSelecting = true;
        this._selectionState = {
            start: this._getViewportPosition(event),
            end: this._getViewportPosition(event),
            timestamp: Date.now(),
        };
        this._emitSelectionStart({
            uiEvent: event,
            start: this._selectionState.start,
            end: this._selectionState.end
        });
    }

    /**
     * Handles the selection update event for container
     * @param {MouseEvent} event - The selection update event
     */
    _selectionUpdate(event) {
        if (!this._isSelecting) return;
        this._selectionState.end = this._getViewportPosition(event);
        this._emitSelectionUpdate({
            uiEvent: event,
            start: this._selectionState.start,
            end: this._selectionState.end
        });
    }

    /**
     * Handles the selection end event for container
     * @param {MouseEvent} event - The selection end event
     */
    _selectionEnd(event) {
        this._isSelecting = false;
        this._emitSelectionEnd({
            uiEvent: event,
            start: this._selectionState.start,
            end: this._selectionState.end
        });
        this._selectionState = null;
    }

    /**
     * Handles the scroll step event for container
     * @param {MouseEvent|TouchEvent} event - The UI event
     * @param {number} scrollStep - The scroll step
     */
    _scrollStep(event, scrollStep) {
        this._emitScrollStep({
            uiEvent: event,
            scrollStep: scrollStep
        });
    }

    /**
     * Handles the scroll to click event
     * @param {MouseEvent} event - The mouse event
     */
    _scrollToClick(event) {
        const scrollContainerRect = this._scrollContainerElement.getBoundingClientRect();
        const scrollThumbRect = this._scrollThumbElement.getBoundingClientRect();
        const maxScrollHeight = scrollContainerRect.height - scrollThumbRect.height - 2 * this._scrollBarSize;
        const scrollThumbPosition = (event.clientY - scrollThumbRect.height / 2 - scrollContainerRect.top - this._scrollBarSize) * 100 / maxScrollHeight;
        this.setScrollThumbPosition(scrollThumbPosition);
        this._emitScroll({
            uiEvent: event,
            scrollPosition: scrollThumbPosition
        });
    }

    /**
     * Starts the scrolling
     * @param {MouseEvent} event - The mouse event
     */
    _startScrolling(event) {
        this._isScrolling = true;
        const scrollThumbRect = this._scrollThumbElement.getBoundingClientRect();
        this._scrollingState = {
            containerRect: this._scrollContainerElement.getBoundingClientRect(),
            thumbRect: scrollThumbRect,
            arrowUpRect: this._scrollArrowUpElement.getBoundingClientRect(),
            arrowDownRect: this._scrollArrowDownElement.getBoundingClientRect(),
            offset: event.clientY - scrollThumbRect.top,
            timestamp: Date.now()
        }
    }

    /**
     * Handles the scrolling
     * @param {MouseEvent} event - The mouse event
     */
    _scrollingUpdate(event) {
        const thumbPositionTop = event.clientY - this._scrollingState.containerRect.top - this._scrollingState.offset;
        const minTopPosition = this._scrollingState.arrowUpRect.height;
        const maxTopPosition = this._scrollingState.containerRect.height - this._scrollingState.thumbRect.height - this._scrollingState.arrowDownRect.height;
        const clampedThumbPositionTop = Math.max(minTopPosition, Math.min(thumbPositionTop, maxTopPosition));
        const maxScrollHeight = this._scrollingState.containerRect.height - this._scrollingState.thumbRect.height - this._scrollingState.arrowDownRect.height - this._scrollingState.arrowUpRect.height;
        const scrollThumbPosition = (clampedThumbPositionTop - this._scrollingState.arrowDownRect.height) * 100 / maxScrollHeight;
        this.setScrollThumbPosition(scrollThumbPosition);
        this._emitScroll({
            uiEvent: event,
            scrollPosition: scrollThumbPosition
        });
    }

    /**
     * Stops the scrolling
     */
    _stopScrolling() {
        this._isScrolling = false;
        this._scrollingState = null;
    }

    /**
     * Checks if the event target is a scroll control
     * @param {EventTarget} target - The event target
     * @returns {boolean} - True if the target is a scroll control
     */
    _isScrollControlTarget(target) {
        return target === this._scrollContainerElement
            || target === this._scrollThumbElement
            || target === this._scrollArrowUpElement
            || target === this._scrollArrowDownElement;
    }

    /**
     * Returns the pointer or touch point from an event
     * @param {MouseEvent|TouchEvent} event - The event
     * @returns {MouseEvent|Touch} - The event point
     */
    _getEventPoint(event) {
        if (event.touches && event.touches.length > 0) {
            return event.touches[0];
        }
        if (event.changedTouches && event.changedTouches.length > 0) {
            return event.changedTouches[0];
        }
        return event;
    }

    /**
     * Returns the touch with the given identifier
     * @param {TouchEvent} event - The touch event
     * @param {number} identifier - The touch identifier
     * @returns {Touch|null} - The matching touch or null
     */
    _getTouchById(event, identifier) {
        const lists = [event.changedTouches, event.touches];
        for (const list of lists) {
            if (!list) continue;
            for (let i = 0; i < list.length; i++) {
                if (list[i].identifier === identifier) {
                    return list[i];
                }
            }
        }
        return null;
    }

    /**
     * Wraps a touch point as a left-click-like event for click dispatch
     * @param {TouchEvent} event - The touch event
     * @param {Touch} point - The touch point
     * @returns {object} - A left-click-like event
     */
    _transformTapToLeftClick(event, point) {
        return {
            button: 0,
            clientX: point.clientX,
            clientY: point.clientY,
            target: event.target,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
        };
    }

    /**
     * Returns the coordinates of the event in the viewport container
     * @param {MouseEvent|TouchEvent|object} event - The event
     * @returns {object} - The coordinates of the event in the viewport container
     */
    _getViewportPosition(event) {
        const point = this._getEventPoint(event);
        const rect = this._viewportContainerElement.getBoundingClientRect();
        return {
            x: point.clientX - rect.left,
            y: point.clientY - rect.top
        };
    }

    /**
     * Adds a listener for the drop event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onDrop(listener) {
        this._dropListeners.add(listener);
        return () => this._dropListeners.delete(listener);
    }

    /**
     * Emits the drop event
     * @param {object} event - The event object
     */
    _emitDrop(event) {
        this._dropListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the resize event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onResize(listener) {
        this._resizeListeners.add(listener);
        return () => this._resizeListeners.delete(listener);
    }

    /**
     * Emits the resize event
     * @param {object} event - The event object
     */
    _emitResize(event) {
        this._resizeListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the click event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onClick(listener) { 
        this._clickListeners.add(listener);
        return () => this._clickListeners.delete(listener);
    }

    /**
     * Emits the click event
     * @param {object} event - The event object
     */
    _emitClick(event) {
        this._clickListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the key down event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onKeyDown(listener) { 
        this._keyDownListeners.add(listener);
        return () => this._keyDownListeners.delete(listener);
    }

    /**
     * Emits the key down event
     * @param {object} event - The event object
     */
    _emitKeyDown(event) {
        this._keyDownListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the selection start event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onSelectionStart(listener) { 
        this._selectionStartListeners.add(listener);
        return () => this._selectionStartListeners.delete(listener);
    }

    /**
     * Emits the selection start event
     * @param {object} event - The event object
     */
    _emitSelectionStart(event) {
        this._selectionStartListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the selection end event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onSelectionEnd(listener) { 
        this._selectionEndListeners.add(listener);
        return () => this._selectionEndListeners.delete(listener);
    }

    /**
     * Emits the selection end event
     * @param {object} event - The event object
     */
    _emitSelectionEnd(event) {
        this._selectionEndListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the selection update event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onSelectionUpdate(listener) { 
        this._selectionUpdateListeners.add(listener);
        return () => this._selectionUpdateListeners.delete(listener);
    }

    /**
     * Emits the selection update event
     * @param {object} event - The event object
     */
    _emitSelectionUpdate(event) {
        this._selectionUpdateListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the scroll step event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onScrollStep(listener) { 
        this._scrollStepListeners.add(listener);
        return () => this._scrollStepListeners.delete(listener);
    }

    /**
     * Emits the scroll step event
     * @param {object} event - The event object
     */
    _emitScrollStep(event) {
        this._scrollStepListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the scroll event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onScroll(listener) { 
        this._scrollListeners.add(listener);
        return () => this._scrollListeners.delete(listener);
    }

    /**
     * Emits the scroll event
     * @param {object} event - The event object
     */
    _emitScroll(event) {
        this._scrollListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the key down event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onKeyDown(listener) {
        this._keyDownListeners.add(listener);
        return () => this._keyDownListeners.delete(listener);
    }

    /**
     * Emits the key down event
     * @param {object} event - The event object
     */
    _emitKeyDown(event) {
        this._keyDownListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the selection start event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onSelectionStart(listener) {
        this._selectionStartListeners.add(listener);
        return () => this._selectionStartListeners.delete(listener);
    }

    /**
     * Emits the selection start event
     * @param {object} event - The event object
     */
    _emitSelectionStart(event) {
        this._selectionStartListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the selection end event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onSelectionEnd(listener) {
        this._selectionEndListeners.add(listener);
        return () => this._selectionEndListeners.delete(listener);
    }

    /**
     * Emits the selection end event
     * @param {object} event - The event object
     */
    _emitSelectionEnd(event) {
        this._selectionEndListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the selection update event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onSelectionUpdate(listener) {
        this._selectionUpdateListeners.add(listener);
        return () => this._selectionUpdateListeners.delete(listener);
    }

    /**
     * Emits the selection update event
     * @param {object} event - The event object
     */
    _emitSelectionUpdate(event) {
        this._selectionUpdateListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the scroll step event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onScrollStep(listener) {
        this._scrollStepListeners.add(listener);
        return () => this._scrollStepListeners.delete(listener);
    }

    /**
     * Emits the scroll step event
     * @param {object} event - The event object
     */
    _emitScrollStep(event) {
        this._scrollStepListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for the scroll event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onScroll(listener) {
        this._scrollListeners.add(listener);
        return () => this._scrollListeners.delete(listener);
    }

    /**
     * Emits the scroll event
     * @param {object} event - The event object
     */
    _emitScroll(event) {
        this._scrollListeners.forEach(listener => listener(event));
    }

    /**
     * Returns the container for the terminal
     * @returns {HTMLElement} - The container element for the terminal
     */
    getContainer() {
        return this._containerElement;
    }

    /**
     * Returns the viewport container for the terminal
     * @returns {HTMLElement} - The viewport container element for the terminal
     */
    getViewportContainer() {
        return this._viewportContainerElement;
    }

    /**
     * Returns the debug element for the terminal
     * @returns {HTMLElement} - The debug element for the terminal
     */
    getDebugElement() {
        return this._debugElement;
    }

    /**
     * Returns the font size for the terminal
     * @returns {number} - The font size for the terminal
     */
    getFontSize() {
        return this._fontSize;
    }

    /**
     * Applies the theme for the terminal UI
     * @param {object} theme - The theme
     * @returns {TerminalViewport} - The instance of the TerminalViewport
     */
    applyTheme(theme) {
        if (theme.background) {
            this._containerElement.style.backgroundColor = theme.background;
        }
        if (theme.foreground) {
            this._containerElement.style.color = theme.foreground;
        }
        if (this._applyThemeToScrollContainer && theme.selectionBackground && theme.background && theme.foreground) {
            this._scrollContainerElement.style.backgroundColor = theme.selectionBackground;
            this._scrollThumbElement.style.backgroundColor = theme.background;
            this._scrollThumbElement.style.borderColor = theme.selectionBackground;
            this._scrollArrowUpElement.style.color = theme.foreground;
            this._scrollArrowUpElement.style.borderColor = theme.selectionBackground;
            this._scrollArrowUpElement.style.backgroundColor = theme.background;
            this._scrollArrowDownElement.style.color = theme.foreground;
            this._scrollArrowDownElement.style.borderColor = theme.selectionBackground;
            this._scrollArrowDownElement.style.backgroundColor = theme.background;
        } else {
            this._scrollContainerElement.style.backgroundColor = TERMINAL_DEFAULT_COLORS.PRIMARY;
            this._scrollThumbElement.style.backgroundColor = TERMINAL_DEFAULT_COLORS.SECONDARY;
            this._scrollThumbElement.style.borderColor = TERMINAL_DEFAULT_COLORS.PRIMARY;
            this._scrollArrowUpElement.style.color = TERMINAL_DEFAULT_COLORS.ACCENT;
            this._scrollArrowUpElement.style.borderColor = TERMINAL_DEFAULT_COLORS.PRIMARY;
            this._scrollArrowUpElement.style.backgroundColor = TERMINAL_DEFAULT_COLORS.PRIMARY;
            this._scrollArrowDownElement.style.color = TERMINAL_DEFAULT_COLORS.ACCENT;
            this._scrollArrowDownElement.style.borderColor = TERMINAL_DEFAULT_COLORS.PRIMARY;
            this._scrollArrowDownElement.style.backgroundColor = TERMINAL_DEFAULT_COLORS.PRIMARY;
        }
        return this;
    }

    /**
     * Sets the position of the scroll thumb
     * @param {number} position - The position of the scroll thumb (0 - 100)
     */
    setScrollThumbPosition(position) {
        const scrollContainerRect = this._scrollContainerElement.getBoundingClientRect();
        const scrollThumbRect = this._scrollThumbElement.getBoundingClientRect();
        const maxScrollHeight = scrollContainerRect.height - scrollThumbRect.height - 2 * this._scrollBarSize;
        const thumbPositionTop = this._scrollBarSize + Math.round(position * maxScrollHeight / 100);
        const clampedThumbPositionTop = Math.max(this._scrollBarSize, Math.min(thumbPositionTop, maxScrollHeight + this._scrollBarSize));
        this._scrollThumbElement.style.top = `${clampedThumbPositionTop}px`;
    }

    /**
     * Returns the position of the scroll thumb
     * @returns {number} - The position of the scroll thumb (0 - 100)
     */
    getScrollThumbPosition() {
        const scrollContainerRect = this._scrollContainerElement.getBoundingClientRect();
        const scrollThumbRect = this._scrollThumbElement.getBoundingClientRect();
        const scrollThumbTop = scrollThumbRect.top - scrollContainerRect.top - this._scrollBarSize;
        const maxScrollHeight = scrollContainerRect.height - scrollThumbRect.height - 2 * this._scrollBarSize;
        const scrollThumbPosition = scrollThumbTop * 100 / maxScrollHeight;
        return scrollThumbPosition;
    }

    /**
     * Sets the scroll container to use theme or not
     * @param {boolean} useTheme - Whether to use the theme for the scroll container
     * @returns {TerminalViewport} - The instance of the TerminalViewport
     */
    setScrollContainerUseTheme(useTheme = false) {
        this._applyThemeToScrollContainer = useTheme;
        return this;
    }

    /**
     * Checks if the theme is used for the scroll container
     * @returns {boolean} - True if the theme is used for the scroll container, false otherwise
     */
    isScrollContainerUsesTheme() {
        return this._applyThemeToScrollContainer;
    }
    
    /**
     * Returns the layout provider for the terminal
     * @returns {LayoutProvider} - The layout provider for the terminal
     */
    getLayoutProvider() {
        return this._layoutProvider;
    }

    /**
     * Computes the layout of the terminal
     * @returns {TerminalLayout} - The computed layout
     */
    computeLayout() {
        let charSize = this._charSizeCache.get(this._fontSize);
        if (!charSize) {
            charSize = CharacterMeasurement.measure(this._containerElement);
            this._charSizeCache.set(this._fontSize, charSize);
        }
        const offset = OffsetMeasurement.measure(this._containerElement, this._viewportContainerElement);
        const viewportContainerRect = this._viewportContainerElement.getBoundingClientRect();
        const lines = charSize.height > 0 ? Math.floor(viewportContainerRect.height / charSize.height) : 0;
        const columns = charSize.width > 0 ? Math.floor(viewportContainerRect.width / charSize.width) : 0;
        return new TerminalLayout(lines, columns, charSize, viewportContainerRect, offset);
    }
}

export default TerminalViewport