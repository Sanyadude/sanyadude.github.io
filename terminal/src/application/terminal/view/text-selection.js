import { SELECTION_MODE } from './selection-mode.js'
import { LayoutProvider } from '../layout/layout-provider.js'
import { ScrollBoundsProvider } from './scroll-bounds-provider.js'

/**
 * TextSelection class - represents a selection of text
 */
export class TextSelection {
    /**
     * Creates a new TextSelection instance
     * @param {LayoutProvider} layoutProvider The layout provider
     * @param {ScrollBoundsProvider} boundsProvider The bounds provider
     */
    constructor(layoutProvider, boundsProvider) {
        this._layoutProvider = layoutProvider;
        this._boundsProvider = boundsProvider;
        this._active = false;
        this._start = { row: 0, column: 0 };
        this._end = { row: 0, column: 0 };
        this._mode = SELECTION_MODE.LINE;
        this._selectionChangeListeners = new Set();
    }

    /**
     * Adds a listener for selection change
     * @param {Function} listener The listener to add
     * @returns {Function} A function to remove the listener
     */
    onSelectionChange(listener) {
        this._selectionChangeListeners.add(listener);
        return () => this._selectionChangeListeners.delete(listener);
    }

    /**
     * Emits a selection change event
     */
    _emitSelectionChange() {
        this._selectionChangeListeners.forEach(listener => listener());
    }

    /**
     * Sets the mode of the selection
     * @param {string} mode The mode of the selection
     * @returns {TextSelection} The instance of the TextSelection
     */
    setMode(mode = SELECTION_MODE.LINE) {
        this._mode = mode;
        this._emitSelectionChange();
        return this;
    }

    /**
     * Sets the mode of the selection to line
     * @returns {TextSelection} The instance of the TextSelection
     */
    setModeLine() {
        this.setMode(SELECTION_MODE.LINE);
        return this;
    }

    /**
     * Sets the mode of the selection to block
     * @returns {TextSelection} The instance of the TextSelection
     */
    setModeBlock() {
        this.setMode(SELECTION_MODE.BLOCK);
        return this;
    }

    /**
     * Sets the start of the selection
     * @param {number} row The row of the start
     * @param {number} column The column of the start
     * @returns {TextSelection} The instance of the TextSelection
     */
    setStart(row = 0, column = 0) {
        const newRow = Math.max(0, row);
        const newColumn = Math.max(0, column);
        this._start.row = newRow;
        this._start.column = newColumn;
        this._end.row = newRow;
        this._end.column = newColumn;
        this._emitSelectionChange();
        return this;
    }

    /**
     * Sets the end of the selection
     * @param {number} row The row of the end
     * @param {number} column The column of the end
     * @returns {TextSelection} The instance of the TextSelection
     */
    setEnd(row = 0, column = 0) {
        const newRow = Math.max(0, row);
        const newColumn = Math.max(0, column);
        this._end.row = newRow;
        this._end.column = newColumn;
        this._emitSelectionChange();
        return this;
    }

    /**
     * Selects the word at the position. Word characters match word navigation.
     * Spaces and each punctuation mark select their own run
     * @param {number} row The document row of the position
     * @param {number} column The column of the position
     * @param {BufferRow|null} line The clicked row
     * @returns {TextSelection} The instance of the TextSelection
     */
    selectWord(row = 0, column = 0, line = null) {
        const length = line ? (line.isWrapped() ? line.getColumns() : line.getContentLength()) : 0;
        const text = Array.from({ length }, (_, i) => line.getCell(i).text || '').join('');
        const index = text[column] ? column : column - 1;
        const matchAll = text.matchAll(/[^\s\-_/=.,:;!?()[\]{}]+|\s+|(.)\1*/g);
        const match = text[index] && [...matchAll]
            .find(part => part.index <= index && index < part.index + part[0].length);
        if (!match) {
            this.reset();
            return this;
        }
        this.setModeLine();
        this.setActive();
        this.setStart(row, match.index);
        this.setEnd(row, match.index + match[0].length);
        return this;
    }

    /**
     * Selects the line at the position
     * @param {number} row The document row of the position
     * @returns {TextSelection} The instance of the TextSelection
     */
    selectLine(row = 0) {
        const columns = this._layoutProvider.getLayout().columns;
        if (columns <= 0) return this;
        this.setModeLine();
        this.setActive();
        this.setStart(row, 0);
        this.setEnd(row, columns);
        return this;
    }

    /**
     * Moves the end of the selection
     * @param {number} row The row to move the end by
     * @param {number} column The column to move the end by
     * @returns {TextSelection} The instance of the TextSelection
     */
    moveEnd(row = 0, column = 0) {
        const layout = this._layoutProvider.getLayout();
        const maxRow = this._boundsProvider.getMaxOffsetRow() + layout.rows;
        const maxColumn = this._boundsProvider.getMaxOffsetColumn() + layout.columns;
        if (this._mode === SELECTION_MODE.BLOCK) {
            this._end.row = Math.max(0, Math.min(this._end.row + row, maxRow));
            this._end.column = Math.max(0, Math.min(this._end.column + column, maxColumn));
        } else {
            const totalColumns = maxRow * maxColumn;
            let newOffset = (this._end.row + row) * maxColumn + (this._end.column + column);
            let clampedOffset = Math.max(0, Math.min(totalColumns, newOffset));
            this._end.row = Math.floor(clampedOffset / maxColumn);
            this._end.column = clampedOffset % maxColumn;
        }
        this._emitSelectionChange();
        return this;
    }

    /**
     * Sets the active state of the selection
     * @param {boolean} active The active state of the selection
     * @returns {TextSelection} The instance of the TextSelection
     */
    setActive(active = true) {
        this._active = active;
        return this;
    }

    /**
     * Checks if the selection is active
     * @returns {boolean} The active state of the selection
     */
    isActive() {
        return this._active;
    }

    /**
     * Checks if the selection has a range
     * @returns {boolean} True if the selection has a range, false otherwise
     */
    hasRange() {
        return this._start.row !== this._end.row || this._start.column !== this._end.column;
    }

    /**
     * Gets the start of the selection
     * @returns {object} The start of the selection
     */
    getStart() {
        return this._start;
    }

    /**
     * Gets the end of the selection
     * @returns {object} The end of the selection
     */
    getEnd() {
        return this._end;
    }

    /**
     * Gets the selection
     * @returns {object} The selection start and end positions
     */
    getSelection() {
        if (this._mode === SELECTION_MODE.BLOCK) {
            return {
                mode: this._mode,
                start: {
                    row: Math.min(this._start.row, this._end.row),
                    column: Math.min(this._start.column, this._end.column),
                },
                end: {
                    row: Math.max(this._start.row, this._end.row),
                    column: Math.max(this._start.column, this._end.column),
                }
            };
        }
        if (this._end.row < this._start.row || (this._end.row === this._start.row && this._end.column < this._start.column)) {
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
     * @returns {object[]} The selection ranges for rows
     */
    getSelectionRanges() {
        const selection = this.getSelection();
        const selections = [];
        if (!selection) return selections;
        const layout = this._layoutProvider.getLayout();
        const maxRow = this._boundsProvider.getMaxOffsetRow() + layout.rows;
        const selectionStartRow = selection.start.row;
        const selectionEndRow = selection.end.row;
        const selectionStartColumn = selection.start.column;
        const selectionEndColumn = selection.end.column;
        for (let i = 0; i < maxRow; i++) {
            if (i < selectionStartRow || i > selectionEndRow) continue;
            let startColumn = selection.mode === SELECTION_MODE.BLOCK ? selectionStartColumn : 0;
            let endColumn = selection.mode === SELECTION_MODE.BLOCK ? selectionEndColumn : layout.columns;
            if (i === selectionStartRow) {
                startColumn = selectionStartColumn;
            }
            if (i === selectionEndRow) {
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
     * @returns {TextSelection} The instance of the TextSelection
     */
    reset() {
        this._active = false;
        this._start = { row: 0, column: 0 };
        this._end = { row: 0, column: 0 };
        this._emitSelectionChange();
        return this;
    }
}

export default TextSelection