/**
 * RenderController class - controls the rendering of the terminal
 */
export class RenderController {
    /**
     * Creates a new RenderController instance
     * @param {TextBufferProvider} textBufferProvider The text buffer provider
     * @param {TextViewport} textViewport The text viewport instance
     * @param {TextSelection} textSelection The text selection instance
     * @param {TextRenderer} textRenderer The text renderer instance
     * @param {CursorRenderer} cursorRenderer The cursor renderer instance
     */
    constructor(textBufferProvider, textViewport, textSelection, textRenderer, cursorRenderer) {
        this._textBufferProvider = textBufferProvider;
        this._textViewport = textViewport;
        this._textSelection = textSelection;
        this._textRenderer = textRenderer;
        this._cursorRenderer = cursorRenderer;
        this._unsubscribers = [];
        this._renderScheduled = false;
        this._cursorRenderScheduled = false;
        this._disposed = false;
        this._init();
    }

    /**
     * Initializes the render controller
     */
    _init() {
        const primaryBuffer = this._textBufferProvider.getPrimaryBuffer();
        const alternateBuffer = this._textBufferProvider.getAlternateBuffer();
        this._unsubscribers = [
            this._textViewport.onOffsetChange(() => {
                this._scheduleRender();
                this._scheduleRenderCursor();
            }),
            this._textSelection.onSelectionChange(() => {
                this._scheduleRender();
            }),
            primaryBuffer.onBufferChange(() => {
                this._scheduleRender();
                this._scheduleRenderCursor();
            }),
            alternateBuffer.onBufferChange(() => {
                this._scheduleRender();
                this._scheduleRenderCursor();
            }),
            this._textBufferProvider.onBufferChange(() => {
                this._scheduleRender();
                this._scheduleRenderCursor();
            }),
        ];
    }

    /**
     * Schedules one text paint after the current turn so later edits in that turn are included
     */
    _scheduleRender() {
        if (this._renderScheduled || this._disposed) return;
        this._renderScheduled = true;
        Promise.resolve().then(() => {
            this._renderScheduled = false;
            if (this._disposed) return;
            this.render();
        });
    }

    /**
     * Schedules one cursor paint after the current turn so later edits in that turn are included
     */
    _scheduleRenderCursor() {
        if (this._cursorRenderScheduled || this._disposed) return;
        this._cursorRenderScheduled = true;
        Promise.resolve().then(() => {
            this._cursorRenderScheduled = false;
            if (this._disposed) return;
            this.renderCursor();
        });
    }

    /**
     * Renders entries into the rows container
     * @returns {RenderController} The instance of the RenderController
     */
    render() {
        const textBuffer = this._textBufferProvider.getTextBuffer();
        const offsetRow = this._textViewport.getOffsetRow();
        const viewportRows = this._textViewport.getViewport().rows;
        const rows = textBuffer.getRows(offsetRow, viewportRows);
        const selectionRanges = this._textSelection.getSelectionRanges();
        const rowSelections = rows.map((_, index) => selectionRanges[offsetRow + index] || null);
        this._textRenderer.scheduleRender(rows, rowSelections, offsetRow);
        return this;
    }

    /**
     * Renders the cursor
     * @returns {RenderController} The instance of the RenderController
     */
    renderCursor() {
        const cursorPosition = this._textBufferProvider.getTextBuffer().getCursorPosition();
        const columns = this._textViewport.getViewport().columns;
        const column = columns > 0 ? Math.min(cursorPosition.column, columns - 1) : cursorPosition.column;
        if (!this._textViewport.isPositionInViewport(cursorPosition.row, column)) {
            this._cursorRenderer.hide();
            return this;
        }
        const position = this._textViewport.toViewportPosition(cursorPosition.row, column);
        this._cursorRenderer.show();
        this._cursorRenderer.renderCursor(position.row, position.column);
        this._cursorRenderer.resetAnimation();
        return this;
    }

    /**
     * Disposes the render controller
     * @returns {RenderController} The instance of the RenderController
     */
    dispose() {
        this._disposed = true;
        this._unsubscribers.forEach(unsubscriber => unsubscriber());
        this._unsubscribers = [];
        return this;
    }
}

export default RenderController