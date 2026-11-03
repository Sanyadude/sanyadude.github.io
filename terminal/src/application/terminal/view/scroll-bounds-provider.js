import { LayoutProvider } from '../layout/layout-provider.js'
import { TextBufferProvider } from '../buffer/text-buffer-provider.js'

/**
 * ScrollBoundsProvider class - represents a provider for the scroll bounds
 */
export class ScrollBoundsProvider {
    /**
     * Creates a new ScrollBoundsProvider instance
     * @param {LayoutProvider} layoutProvider The layout provider
     * @param {TextBufferProvider} textBufferProvider The text buffer provider
     */
    constructor(layoutProvider, textBufferProvider) {
        this._layoutProvider = layoutProvider;
        this._textBufferProvider = textBufferProvider;
    }

    /**
     * Returns the minimum scroll row offset
     * @returns {number} The minimum scroll row offset
     */
    getMinOffsetRow() {
        return 0;
    }

    /**
     * Returns the maximum scroll row offset
     * @returns {number} The maximum scroll row offset
     */
    getMaxOffsetRow() {
        const textBuffer = this._textBufferProvider.getTextBuffer();
        const rowsCount = textBuffer.getScrollbackRowCount();
        const maxOffsetY = Math.max(0, rowsCount);
        return maxOffsetY;
    }

    /**
     * Returns the minimum scroll column offset
     * @returns {number} The minimum scroll column offset
     */
    getMinOffsetColumn() {
        return 0;
    }

    /**
     * Returns the maximum scroll column offset
     * @returns {number} The maximum scroll column offset
     */
    getMaxOffsetColumn() {
        return 0;
    }

    /**
     * Returns the scroll row offset from the scroll position
     * @param {number} scrollPosition The scroll position
     * @returns {number} The scroll row offset
     */
    getOffsetRowFromScrollPosition(scrollPosition) {
        return Math.round((this.getMaxOffsetRow() * scrollPosition) / 100);
    }

    /**
     * Returns the scroll position from the scroll row offset
     * @param {number} offsetRow The scroll row offset
     * @returns {number} The scroll position
     */
    getScrollPositionFromOffsetRow(offsetRow) {
        const maxOffsetRow = this.getMaxOffsetRow();
        if (!maxOffsetRow) return 0;
        return (offsetRow / maxOffsetRow) * 100;
    }
}

export default ScrollBoundsProvider