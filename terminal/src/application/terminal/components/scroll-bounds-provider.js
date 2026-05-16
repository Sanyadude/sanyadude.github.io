import { LayoutProvider } from './layout-provider.js'
import { TextBuffer } from './text-buffer.js'

/**
 * ScrollBoundsProvider class - represents a provider for the scroll bounds
 */
export class ScrollBoundsProvider {
    /**
     * Creates a new ScrollBoundsProvider instance
     * @param {LayoutProvider} layoutProvider - The layout provider
     * @param {TextBuffer} textBuffer - The text buffer
     */
    constructor(layoutProvider, textBuffer) {
        this._layoutProvider = layoutProvider;
        this._textBuffer = textBuffer;
    }

    /**
     * Returns the minimum scroll line offset
     * @returns {number} - The minimum scroll line offset
     */
    getMinOffsetLine() {
        return 0;
    }

    /**
     * Returns the maximum scroll line offset
     * @returns {number} - The maximum scroll line offset
     */
    getMaxOffsetLine() {
        const wrappedLinesCount = this._textBuffer.getWrappedLinesCount();
        const maxOffsetY = Math.max(0, wrappedLinesCount);
        return maxOffsetY;
    }

    /**
     * Returns the minimum scroll column offset
     * @returns {number} - The minimum scroll column offset
     */
    getMinOffsetColumn() {
        return 0;
    }

    /**
     * Returns the maximum scroll column offset
     * @returns {number} - The maximum scroll column offset
     */
    getMaxOffsetColumn() {
        return 0;
    }

    /**
     * Returns the scroll line offset from the scroll position
     * @param {number} scrollPosition - The scroll position
     * @returns {number} - The scroll line offset
     */
    getOffsetLineFromScrollPosition(scrollPosition) {
        return Math.round((this.getMaxOffsetLine() * scrollPosition) / 100);
    }

    /**
     * Returns the scroll position from the scroll line offset
     * @param {number} offsetLine - The scroll line offset
     * @returns {number} - The scroll position
     */
    getScrollPositionFromOffsetLine(offsetLine) {
        return (offsetLine / this.getMaxOffsetLine()) * 100;
    }
}

export default ScrollBoundsProvider