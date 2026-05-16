import { CharacterMeasurement } from './character-measurement.js'
import { OffsetMeasurement } from './offset-measurement.js'
import { TerminalLayout } from './terminal-layout.js'
import { TextFormat } from './text-format.js'
import { LayoutProvider } from './layout-provider.js'

/**
 * TerminalViewport class - represents a terminal UI for the terminal
 */
export class TerminalViewport {
    /**
     * Creates a new TerminalViewport instance
     * @param {HTMLElement} container - The container element for the terminal
     */
    constructor(container) {
        this._container = container;
        this._layoutProvider = new LayoutProvider();

        this._fontSize = 16;
        this._padding = 10;
        this._scrollBarWidth = 16;
        this._arrowScrollLinesAmount = 1;
        this._wheelScrollLinesAmount = 4;

        this._clickingState = null;
        this._clickDetectionTimeThreshold = 200;
        this._clickDetectionMoveThreshold = 5;

        this._isScrolling = false;
        this._scrollingState = null;

        this._isSelecting = false;
        this._selectionState = null;

        this._applyThemeToScrollContainer = false;

        this._defaultColors = {
            primary: '#eee',
            secondary: '#ccc',
            accent: '#666',
        }

        this._charSizeCache = new Map();

        this._init();
        this._initListeners();
    }

    /**
     * Initializes the terminal UI
     */
    _init() {
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
        // Compute the layout
        this._layoutProvider.setLayout(this.computeLayout());
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
            paddingRight: `${this._scrollBarWidth + this._padding}px`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            outline: 'none',
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
            width: `${this._scrollBarWidth}px`,
            height: '100%',
            backgroundColor: this._defaultColors.primary,
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
            top: `${this._scrollBarWidth}px`,
            left: '0px',
            width: `${this._scrollBarWidth}px`,
            height: `${this._scrollBarWidth + 2}px`,
            backgroundColor: this._defaultColors.secondary,
            border: `1px solid ${this._defaultColors.primary}`,
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
            width: `${this._scrollBarWidth}px`,
            height: `${this._scrollBarWidth}px`,
            fontSize: `${this._scrollBarWidth}px`,
            lineHeight: `${this._scrollBarWidth}px`,
            color: this._defaultColors.accent,
            backgroundColor: this._defaultColors.primary,
            border: `1px solid ${this._defaultColors.primary}`,
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
            width: `${this._scrollBarWidth}px`,
            height: `${this._scrollBarWidth}px`,
            fontSize: `${this._scrollBarWidth}px`,
            lineHeight: `${this._scrollBarWidth}px`,
            color: this._defaultColors.accent,
            backgroundColor: this._defaultColors.primary,
            border: `1px solid ${this._defaultColors.primary}`,
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
        this._containerElement.addEventListener('wheel', (event) => {
            this._handleWheel(event);
        });
        this._containerElement.addEventListener('keydown', (event) => {
            this._handleKeyDown(event);
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
        this.onDrop?.({
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
        this.onResize?.({
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
                this.onClick?.({
                    uiEvent: event,
                    position: this._getViewportPosition(event)
                });
            }
            this._clickingState = null;
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
     * Handles the key down event for container
     * @param {KeyboardEvent|MouseEvent} event - The key down event
     */
    _handleKeyDown(event) {
        this.onKeyDown?.({
            uiEvent: event
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
        this.onSelectionStart?.({
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
        this.onSelectionUpdate?.({
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
        this.onSelectionEnd?.({
            uiEvent: event,
            start: this._selectionState.start,
            end: this._selectionState.end
        });
        this._selectionState = null;
    }

    /**
     * Handles the scroll step event for container
     * @param {MouseEvent} event - The mouse event
     * @param {number} scrollStep - The scroll step
     */
    _scrollStep(event, scrollStep) {
        this.onScrollStep?.({
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
        const maxScrollHeight = scrollContainerRect.height - scrollThumbRect.height - 2 * this._scrollBarWidth;
        const scrollThumbPosition = (event.clientY - scrollThumbRect.height / 2 - scrollContainerRect.top - this._scrollBarWidth) * 100 / maxScrollHeight;
        this.setScrollThumbPosition(scrollThumbPosition);
        this.onScroll?.({
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
            timestamp: Date.now(),
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
        this.onScroll?.({
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
     * Returns the coordinates of the event in the viewport container
     * @param {MouseEvent} event - The event
     * @returns {object} - The coordinates of the event in the viewport container
     */
    _getViewportPosition(event) {
        const rect = this._viewportContainerElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    // Event handlers
    onDrop() { }
    onResize() { }
    onClick() { }
    onKeyDown() { }
    onSelectionStart() { }
    onSelectionEnd() { }
    onSelectionUpdate() { }
    onScrollStep() { }
    onScroll() { }

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
            this._scrollContainerElement.style.backgroundColor = this._defaultColors.primary;
            this._scrollThumbElement.style.backgroundColor = this._defaultColors.secondary;
            this._scrollThumbElement.style.borderColor = this._defaultColors.primary;
            this._scrollArrowUpElement.style.color = this._defaultColors.accent;
            this._scrollArrowUpElement.style.borderColor = this._defaultColors.primary;
            this._scrollArrowUpElement.style.backgroundColor = this._defaultColors.primary;
            this._scrollArrowDownElement.style.color = this._defaultColors.accent;
            this._scrollArrowDownElement.style.borderColor = this._defaultColors.primary;
            this._scrollArrowDownElement.style.backgroundColor = this._defaultColors.primary;
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
        const maxScrollHeight = scrollContainerRect.height - scrollThumbRect.height - 2 * this._scrollBarWidth;
        const thumbPositionTop = this._scrollBarWidth + Math.round(position * maxScrollHeight / 100);
        const clampedThumbPositionTop = Math.max(this._scrollBarWidth, Math.min(thumbPositionTop, maxScrollHeight + this._scrollBarWidth));
        this._scrollThumbElement.style.top = `${clampedThumbPositionTop}px`;
    }

    /**
     * Returns the position of the scroll thumb
     * @returns {number} - The position of the scroll thumb (0 - 100)
     */
    getScrollThumbPosition() {
        const scrollContainerRect = this._scrollContainerElement.getBoundingClientRect();
        const scrollThumbRect = this._scrollThumbElement.getBoundingClientRect();
        const scrollThumbTop = scrollThumbRect.top - scrollContainerRect.top - this._scrollBarWidth;
        const maxScrollHeight = scrollContainerRect.height - scrollThumbRect.height - 2 * this._scrollBarWidth;
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