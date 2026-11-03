import { LayoutProvider } from '../layout/layout-provider.js'
import { ScrollBoundsProvider } from './scroll-bounds-provider.js'

/**
 * TextViewport class - represents a viewport for the text
 */
export class TextViewport {
    /**
     * Creates a new TextViewport instance
     * @param {LayoutProvider} layoutProvider The layout provider
     * @param {ScrollBoundsProvider} boundsProvider The bounds provider
     */
    constructor(layoutProvider, boundsProvider) {
        this._layoutProvider = layoutProvider;
        this._boundsProvider = boundsProvider;
        this._offset = { row: 0, column: 0 };
        this._offsetChangeListeners = new Set();
    }

    /**
     * Adds a listener for viewport offset changes
     * @param {Function} listener The listener to add. It receives `{ row, column }`
     * @returns {Function} A function to remove the listener
     */
    onOffsetChange(listener) {
        this._offsetChangeListeners.add(listener);
        return () => this._offsetChangeListeners.delete(listener);
    }

    /**
     * Emits the offset change event
     * @param {object} event The event object
     */
    _emitOffsetChange(event) {
        this._offsetChangeListeners.forEach(listener => listener(event));
    }

    /**
     * Sets the offset of the viewport
     * @param {number} row The row of the offset
     * @param {number} column The column of the offset
     * @returns {TextViewport} The instance of the TextViewport
     */
    setOffset(row = 0, column = 0) {
        const oldOffset = this.getOffset();
        this._offset.row = Math.max(this._boundsProvider.getMinOffsetRow(), Math.min(row, this._boundsProvider.getMaxOffsetRow()));
        this._offset.column = Math.max(this._boundsProvider.getMinOffsetColumn(), Math.min(column, this._boundsProvider.getMaxOffsetColumn()));
        if (oldOffset.row !== this._offset.row || oldOffset.column !== this._offset.column) {
            this._emitOffsetChange({ offset: this.getOffset() });
        }
        return this;
    }

    /**
     * Sets the row offset of the viewport
     * @param {number} row The row of the offset
     * @returns {TextViewport} The instance of the TextViewport
     */
    setOffsetRow(row = 0) {
        this.setOffset(row, this._offset.column);
        return this;
    }

    /**
     * Sets the column offset of the viewport
     * @param {number} column The column of the offset
     * @returns {TextViewport} The instance of the TextViewport
     */
    setOffsetColumn(column = 0) {
        this.setOffset(this._offset.row, column);
        return this;
    }

    /**
     * Returns the offset of the viewport
     * @returns {object} The offset of the viewport
     */
    getOffset() {
        return { row: this._offset.row, column: this._offset.column };
    }

    /**
     * Returns the vertical offset row of the viewport
     * @returns {number} The vertical offset row of the viewport
     */
    getOffsetRow() {
        return this._offset.row;
    }

    /**
     * Returns the horizontal offset column of the viewport
     * @returns {number} The horizontal offset column of the viewport
     */
    getOffsetColumn() {
        return this._offset.column;
    }

    /**
     * Returns the size of the viewport
     * @returns {object} The size of the viewport
     */
    getViewport() {
        const layout = this._layoutProvider.getLayout();
        return {
            rows: layout.rows,
            columns: layout.columns
        };
    }

    /**
     * Returns the limits of the viewport
     * @returns {object} The limits of the viewport
     */
    getLimits() {
        const layout = this._layoutProvider.getLayout();
        return {
            minRow: 0,
            maxRow: this._boundsProvider.getMaxOffsetRow() + layout.rows,
            minColumn: 0,
            maxColumn: this._boundsProvider.getMaxOffsetColumn() + layout.columns
        };
    }

    /**
     * Scrolls the viewport vertically
     * @param {number} rows The number of rows to scroll the viewport
     * @returns {TextViewport} The instance of the TextViewport
     */
    scrollY(rows = 0) {
        this.setOffsetRow(this._offset.row + rows);
        return this;
    }

    /**
     * Scrolls the viewport horizontally
     * @param {number} columns The number of columns to scroll the viewport
     * @returns {TextViewport} The instance of the TextViewport
     */
    scrollX(columns = 0) {
        this.setOffsetColumn(this._offset.column + columns);
        return this;
    }

    /**
     * Scrolls so the row stays inside the viewport, with padding from the edges.
     * Padding 0 places the row on the first or last viewport row.
     * A larger padding places it that many rows below the first row, or that many rows above the last row
     * @param {number} row The absolute row to keep in view
     * @param {number} column The absolute column, used only to skip scrolling when the position is already visible
     * @param {number} padding The rows to keep between the row and the near edge of the viewport
     * @returns {TextViewport} The instance of the TextViewport
     */
    ensureRowInViewport(row = 0, column = 0, padding = 0) {
        if (this.isPositionInViewport(row, column)) return this;
        const viewportRows = this.getViewport().rows;
        if (viewportRows <= 0) return this;
        const relativeRow = row - this._offset.row;
        const topRow = Math.min(Math.max(0, padding), viewportRows - 1);
        const bottomRow = Math.max(topRow, viewportRows - 1 - Math.max(0, padding));
        if (relativeRow < 0) {
            this.scrollY(relativeRow - topRow);
        } else if (relativeRow >= viewportRows) {
            this.scrollY(relativeRow - bottomRow);
        }
        return this;
    }

    /**
     * Scrolls so the row sits on the top row of the viewport
     * @param {number} row The absolute row to place at the top
     * @returns {TextViewport} The instance of the TextViewport
     */
    scrollRowToTop(row = 0) {
        this.scrollY(row - this._offset.row);
        return this;
    }

    /**
     * Returns the scroll Y position of the viewport as a percentage
     * @returns {number} The scroll Y position of the viewport as a percentage
     */
    getScrollYPercentage() {
        const maxOffsetRow = this._boundsProvider.getMaxOffsetRow();
        if (!maxOffsetRow) return 0;
        return (this._offset.row / maxOffsetRow) * 100;
    }

    /**
     * Returns the scroll X position of the viewport as a percentage
     * @returns {number} The scroll X position of the viewport as a percentage
     */
    getScrollXPercentage() {
        const maxOffsetColumn = this._boundsProvider.getMaxOffsetColumn();
        if (!maxOffsetColumn) return 0;
        return (this._offset.column / maxOffsetColumn) * 100;
    }

    /**
     * Returns the position of the character from the coordinates
     * @param {number} x The x coordinate of the character
     * @param {number} y The y coordinate of the character
     * @returns {object} The position of the character from the coordinates
     */
    getPositionFromCoordinates(x = 0, y = 0) {
        const layout = this._layoutProvider.getLayout();
        const row = Math.floor(y / layout.charHeight);
        const column = Math.round(x / layout.charWidth);
        return { row, column };
    }

    /**
     * Returns the coordinates of the character from the position
     * @param {number} row The row of the character
     * @param {number} column The column of the character
     * @returns {object} The coordinates of the character from the position
     */
    getCoordinatesFromPosition(row = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        const x = column * layout.charWidth;
        const y = row * layout.charHeight;
        return { x, y };
    }

    /**
     * Returns the position of the character from index
     * @param {number} index The index of the character
     * @returns {object} The position of the character
     */
    getPositionFromIndex(index = 0) {
        const layout = this._layoutProvider.getLayout();
        const row = Math.floor(index / layout.columns);
        const column = index % layout.columns;
        return { row, column };
    }

    /**
     * Returns the index of the character from position
     * @param {number} row The row of the character
     * @param {number} column The column of the character
     * @returns {number} The index of the character
     */
    getIndexFromPosition(row = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        return row * layout.columns + column;
    }

    /**
     * Returns the viewport position from the coordinates
     * @param {number} x The x coordinate of the position
     * @param {number} y The y coordinate of the position
     * @returns {object} The viewport position from the coordinates
     */
    getViewportPositionFromCoordinates(x = 0, y = 0) {
        const layout = this._layoutProvider.getLayout();
        const { row, column } = this.getPositionFromCoordinates(x, y);
        const viewportRow = Math.max(0, Math.min(row, layout.rows - 1));
        const viewportColumn = Math.max(0, Math.min(column, layout.columns));
        return { row: viewportRow, column: viewportColumn };
    }

    /**
     * Returns the absolute position from the coordinates using the viewport offset
     * @param {number} x The x coordinate of the position
     * @param {number} y The y coordinate of the position
     * @returns {object} The absolute position from the coordinates using the viewport offset
     */
    getAbsolutePositionFromCoordinates(x = 0, y = 0) {
        const { row, column } = this.getViewportPositionFromCoordinates(x, y);
        return { row: row + this._offset.row, column: column + this._offset.column };
    }

    /**
     * Checks if the position is inside the viewport. 
     * A column equal to the width is the pending wrap and still belongs to this row
     * @param {number} row The row of the position
     * @param {number} column The column of the position
     * @returns {boolean} True if the position is inside the viewport, false otherwise
     */
    isPositionInViewport(row = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        const viewportRow = row - this._offset.row;
        const displayColumn = layout.columns > 0 ? Math.min(column, layout.columns - 1) : column;
        const viewportColumn = displayColumn - this._offset.column;
        return viewportRow >= 0 && viewportRow < layout.rows
            && viewportColumn >= 0 && viewportColumn < layout.columns;
    }

    /**
     * Converts the absolute position to the viewport position
     * @param {number} row The row of the position
     * @param {number} column The column of the position
     * @returns {object} The viewport position
     */
    toViewportPosition(row = 0, column = 0) {
        return { row: row - this._offset.row, column: column - this._offset.column };
    }

    /**
     * Converts the viewport position to the absolute position
     * @param {number} row The row of the position
     * @param {number} column The column of the position
     * @returns {object} The absolute position
     */
    toAbsolutePosition(row = 0, column = 0) {
        return { row: row + this._offset.row, column: column + this._offset.column };
    }

    /**
     * Refreshes the viewport
     */
    refresh() {
        this._emitOffsetChange({ offset: this.getOffset() });
        return this;
    }

    /**
     * Releases offset change listeners
     * @returns {TextViewport} The instance of the TextViewport
     */
    dispose() {
        this._offsetChangeListeners.clear();
        return this;
    }
}

export default TextViewport