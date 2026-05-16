import { SELECTION_MODE } from './selection-mode.js'
import { LayoutProvider } from './layout-provider.js'
import { ScrollBoundsProvider } from './scroll-bounds-provider.js'

/**
 * TextSelection class - represents a selection of text
 */
export class TextSelection {
    /**
     * Creates a new TextSelection instance
     * @param {LayoutProvider} layoutProvider - The layout provider
     * @param {ScrollBoundsProvider} boundsProvider - The bounds provider
     */
    constructor(layoutProvider, boundsProvider) {
        this._layoutProvider = layoutProvider;
        this._boundsProvider = boundsProvider;
        this._active = false;
        this._start = { line: 0, column: 0 };
        this._end = { line: 0, column: 0 };
        this._mode = SELECTION_MODE.LINE;
    }

    /**
     * Sets the mode of the selection
     * @param {string} mode - The mode of the selection
     * @returns {TextSelection} - The instance of the TextSelection
     */
    setMode(mode = SELECTION_MODE.LINE) {
        this._mode = mode;
        return this;
    }

    /**
     * Sets the mode of the selection to line
     * @returns {TextSelection} - The instance of the TextSelection
     */
    setModeLine() {
        this.setMode(SELECTION_MODE.LINE);
        return this;
    }

    /**
     * Sets the mode of the selection to block
     * @returns {TextSelection} - The instance of the TextSelection
     */
    setModeBlock() {
        this.setMode(SELECTION_MODE.BLOCK);
        return this;
    }

    /**
     * Sets the start of the selection
     * @param {number} line - The line of the start
     * @param {number} column - The column of the start
     * @returns {TextSelection} - The instance of the TextSelection
     */
    setStart(line = 0, column = 0) {
        const newLine = Math.max(0, line);
        const newColumn = Math.max(0, column);
        this._start.line = newLine;
        this._start.column = newColumn;
        this._end.line = newLine;
        this._end.column = newColumn;
        return this;
    }

    /**
     * Sets the end of the selection
     * @param {number} line - The line of the end
     * @param {number} column - The column of the end
     * @returns {TextSelection} - The instance of the TextSelection
     */
    setEnd(line = 0, column = 0) {
        const newLine = Math.max(0, line);
        const newColumn = Math.max(0, column);
        this._end.line = newLine;
        this._end.column = newColumn;
        return this;
    }

    /**
     * Moves the end of the selection
     * @param {number} line - The line to move the end to
     * @param {number} column - The column to move the end to
     * @returns {TextSelection} - The instance of the TextSelection
     */
    moveEnd(line = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        const maxLine = this._boundsProvider.getMaxOffsetLine() + layout.lines;
        const maxColumn = this._boundsProvider.getMaxOffsetColumn() + layout.columns;
        if (this._mode === SELECTION_MODE.BLOCK) {
            this._end.line = Math.max(0, Math.min(this._end.line + line, maxLine));
            this._end.column = Math.max(0, Math.min(this._end.column + column, maxColumn));
            return this;
        }
        const totalColumns = maxLine * maxColumn;
        let newOffset = (this._end.line + line) * maxColumn + (this._end.column + column);
        let clampedOffset = Math.max(0, Math.min(totalColumns, newOffset));
        this._end.line = Math.floor(clampedOffset / maxColumn);
        this._end.column = clampedOffset % maxColumn;
        return this;
    }

    /**
     * Sets the active state of the selection
     * @param {boolean} active - The active state of the selection
     * @returns {TextSelection} - The instance of the TextSelection
     */
    setActive(active = true) {
        this._active = active;
        return this;
    }

    /**
     * Checks if the selection is active
     * @returns {boolean} - The active state of the selection
     */
    isActive() {
        return this._active;
    }

    /**
     * Checks if the selection has a range
     * @returns {boolean} - True if the selection has a range, false otherwise
     */
    hasRange() {
        return this._start.line !== this._end.line || this._start.column !== this._end.column;
    }

    /**
     * Gets the start of the selection
     * @returns {object} - The start of the selection
     */
    getStart() {
        return this._start;
    }

    /**
     * Gets the end of the selection
     * @returns {object} - The end of the selection
     */
    getEnd() {
        return this._end;
    }

    /**
     * Gets the selection
     * @returns {object} - The selection start and end positions
     */
    getSelection() {
        if (this._mode === SELECTION_MODE.BLOCK) {
            return {
                mode: this._mode,
                start: {
                    line: Math.min(this._start.line, this._end.line),
                    column: Math.min(this._start.column, this._end.column),
                },
                end: {
                    line: Math.max(this._start.line, this._end.line),
                    column: Math.max(this._start.column, this._end.column),
                }
            };
        }
        if (this._end.line < this._start.line || (this._end.line === this._start.line && this._end.column < this._start.column)) {
            return { 
                mode: this._mode, 
                start: this._end, 
                end: this._start
            };
        }
        return { 
            mode: this._mode, 
            start: this._start, 
            end: this._end 
        };
    }

    /**
     * Gets selection ranges
     * @returns {object[]} - The selection ranges for lines
     */
    getSelectionRanges() {
        const selection = this.getSelection();
        const selections = [];
        if (!selection) return selections;
        const layout = this._layoutProvider.getLayout();
        const maxLine = this._boundsProvider.getMaxOffsetLine() + layout.lines;
        const selectionStartLine = selection.start.line;
        const selectionEndLine = selection.end.line;
        const selectionStartColumn = selection.start.column;
        const selectionEndColumn = selection.end.column;
        for (let i = 0; i < maxLine; i++) {
            if (i < selectionStartLine || i > selectionEndLine) continue;
            let startColumn = selection.mode === SELECTION_MODE.BLOCK ? selectionStartColumn : 0;
            let endColumn = selection.mode === SELECTION_MODE.BLOCK ? selectionEndColumn : layout.columns;
            if (i === selectionStartLine) {
                startColumn = selectionStartColumn;
            }
            if (i === selectionEndLine) {
                endColumn = selectionEndColumn;
            }
            if (startColumn < endColumn) {
                selections[i] = { start: startColumn, end: endColumn };
            }
        }
        return selections;
    }

    /**
     * Resets the selection
     */
    reset() {
        this._active = false;
        this._start = { line: 0, column: 0 };
        this._end = { line: 0, column: 0 };
        return this;
    }
}

export default TextSelection