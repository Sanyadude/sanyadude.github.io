import { LayoutProvider } from './layout-provider.js'
import { ScrollBoundsProvider } from './scroll-bounds-provider.js'

/**
 * TextViewport class - represents a viewport for the text
 */
export class TextViewport {
    /**
     * Creates a new TextViewport instance
     * @param {LayoutProvider} layoutProvider - The layout provider
     * @param {ScrollBoundsProvider} boundsProvider - The bounds provider
     */
    constructor(layoutProvider, boundsProvider) {
        this._layoutProvider = layoutProvider;
        this._boundsProvider = boundsProvider;
        this._offset = { line: 0, column: 0 };
    }

    /**
     * Sets the offset of the viewport
     * @param {number} line - The line of the offset
     * @param {number} column - The column of the offset
     * @returns {TextViewport} - The instance of the TextViewport
     */
    setOffset(line = 0, column = 0) {
        this.setOffsetLine(line);
        this.setOffsetColumn(column);
        return this;
    }

    /**
     * Sets the line offset of the viewport
     * @param {number} line - The line of the offset
     * @returns {TextViewport} - The instance of the TextViewport
     */
    setOffsetLine(line = 0) {
        this._offset.line = Math.max(this._boundsProvider.getMinOffsetLine(), Math.min(line, this._boundsProvider.getMaxOffsetLine()));
        return this;
    }

    /**
     * Sets the column offset of the viewport
     * @param {number} column - The column of the offset
     * @returns {TextViewport} - The instance of the TextViewport
     */
    setOffsetColumn(column = 0) {
        this._offset.column = Math.max(this._boundsProvider.getMinOffsetColumn(), Math.min(column, this._boundsProvider.getMaxOffsetColumn()));
        return this;
    }

    /**
     * Returns the offset of the viewport
     * @returns {object} - The offset of the viewport
     */
    getOffset() {
        return this._offset;
    }

    /**
     * Returns the vertical offset line of the viewport
     * @returns {number} - The vertical offset line of the viewport
     */
    getOffsetLine() {
        return this._offset.line;
    }

    /**
     * Returns the horizontal offset column of the viewport
     * @returns {number} - The horizontal offset column of the viewport
     */
    getOffsetColumn() {
        return this._offset.column;
    }

    /**
     * Returns the size of the viewport
     * @returns {object} - The size of the viewport
     */
    getViewport() {
        const layout = this._layoutProvider.getLayout();
        return {
            lines: layout.lines,
            columns: layout.columns
        };
    }

    /**
     * Returns the limits of the viewport
     * @returns {object} - The limits of the viewport
     */
    getLimits() {
        const layout = this._layoutProvider.getLayout();
        return {
            minLine: 0,
            maxLine: this._boundsProvider.getMaxOffsetLine() + layout.lines,
            minColumn: 0,
            maxColumn: this._boundsProvider.getMaxOffsetColumn() + layout.columns
        };
    }

    /**
     * Scrolls the viewport vertically
     * @param {number} lines - The number of lines to scroll the viewport
     * @returns {TextViewport} - The instance of the TextViewport
     */
    scrollY(lines = 0) {
        this._offset.line = Math.max(this._boundsProvider.getMinOffsetLine(), Math.min(this._offset.line + lines, this._boundsProvider.getMaxOffsetLine()));
        return this;
    }

    /**
     * Scrolls the viewport horizontally
     * @param {number} lines - The number of lines to scroll the viewport
     * @returns {TextViewport} - The instance of the TextViewport
     */
    scrollX(columns = 0) {
        this._offset.column = Math.max(this._boundsProvider.getMinOffsetX(), Math.min(this._offset.column + columns, this._boundsProvider.getMaxOffsetX()));
        return this;
    }

    /**
     * Returns the position of the character from the coordinates
     * @param {number} x - The x coordinate of the character
     * @param {number} y - The y coordinate of the character
     * @returns {object} - The position of the character from the coordinates
     */
    getPositionFromCoordinates(x = 0, y = 0) {
        const layout = this._layoutProvider.getLayout();
        const line = Math.floor(y / layout.charHeight);
        const column = Math.round(x / layout.charWidth);
        return { line, column };
    }

    /**
     * Returns the coordinates of the character from the position
     * @param {number} line - The line of the character
     * @param {number} column - The column of the character
     * @returns {object} - The coordinates of the character from the position
     */
    getCoordinatesFromPosition(line = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        const x = column * layout.charWidth;
        const y = line * layout.charHeight;
        return { x, y };
    }

    /**
     * Returns the position of the character from index
     * @param {number} index - The index of the character
     * @returns {object} - The position of the character
     */
    getPositionFromIndex(index = 0) {
        const layout = this._layoutProvider.getLayout();
        const line = Math.floor(index / layout.columns);
        const column = index % layout.columns;
        return { line, column };
    }

    /**
     * Returns the index of the character from position
     * @param {number} line - The line of the character
     * @param {number} column - The column of the character
     * @returns {number} - The index of the character
     */
    getIndexFromPosition(line = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        return line * layout.columns + column;
    }

    /**
     * Returns the viewport position from the coordinates
     * @param {number} x - The x coordinate of the position
     * @param {number} y - The y coordinate of the position
     * @returns {object} - The viewport position from the coordinates
     */
    getViewportPositionFromCoordinates(x = 0, y = 0) {
        const layout = this._layoutProvider.getLayout();
        const { line, column } = this.getPositionFromCoordinates(x, y);
        const viewportLine = Math.max(0, Math.min(line, layout.lines - 1));
        const viewportColumn = Math.max(0, Math.min(column, layout.columns));
        return { line: viewportLine, column: viewportColumn };
    }

    /**
     * Returns the absolute position from the coordinates using the viewport offset
     * @param {number} x - The x coordinate of the position
     * @param {number} y - The y coordinate of the position
     * @returns {object} - The absolute position from the coordinates using the viewport offset
     */
    getAbsolutePositionFromCoordinates(x = 0, y = 0) {
        const { line, column } = this.getViewportPositionFromCoordinates(x, y);
        return { line: line + this._offset.line, column: column + this._offset.column };
    }

    /**
     * Checks if the position is inside the viewport
     * @param {number} line - The line of the position
     * @param {number} column - The column of the position
     * @returns {boolean} - True if the position is inside the viewport, false otherwise
     */
    isPositionInViewport(line = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        const viewportLine = line - this._offset.line;
        const viewportColumn = column - this._offset.column;
        return viewportLine >= 0 && viewportLine < layout.lines 
            && viewportColumn >= 0 && viewportColumn < layout.columns;
    }

    /**
     * Converts the absolute position to the viewport position
     * @param {number} line - The line of the position
     * @param {number} column - The column of the position
     * @returns {object} - The viewport position
     */
    toViewportPosition(line = 0, column = 0) {
        return { line: line - this._offset.line, column: column - this._offset.column };
    }

    /**
     * Converts the viewport position to the absolute position
     * @param {number} line - The line of the position
     * @param {number} column - The column of the position
     * @returns {object} - The absolute position
     */
    toAbsolutePosition(line = 0, column = 0) {
        return { line: line + this._offset.line, column: column + this._offset.column };
    }
}

export default TextViewport