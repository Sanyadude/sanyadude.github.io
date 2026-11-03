import { BufferCell } from './buffer-cell.js'
import { BufferRow } from './buffer-row.js'
import { AnsiParser } from '../ansi/ansi-parser.js'
import { TextFormat } from '../ansi/text-format.js'
import { TERMINAL_DEFAULT_TAB_SIZE } from '../config/config.js'

const ERASE_MODE_CURSOR_TO_END = 0;
const ERASE_MODE_START_TO_CURSOR = 1;
const ERASE_MODE_WHOLE_SCREEN = 2;
const ERASE_MODE_SCROLLBACK = 3;
const MODE_NEWLINE = 20;
const DEFAULT_SCROLL_COUNT = 1;
const CONTROL_CHARACTER_METHODS = new Map([
    ['\n', 'lineFeed'],
    ['\r', 'carriageReturn'],
    ['\b', 'backspace'],
    ['\t', 'tab'],
]);

/**
 * ScreenBuffer class - the active rows x columns grid where the cursor lives
 */
export class ScreenBuffer {
    /**
     * Creates a new ScreenBuffer instance
     * @param {LayoutProvider} layoutProvider The layout provider
     */
    constructor(layoutProvider) {
        this._layoutProvider = layoutProvider;
        this._rows = [];
        this._cursor = { x: 0, y: 0 };
        this._format = null;
        this._usedRowCount = 0;
        this._newlineMode = true;
        this._scrollTop = 0;
        this._scrollBottom = 0;
        this._ansiParser = new AnsiParser();
        this._scrollbackAddRowListeners = new Set();
        this._scrollbackClearListeners = new Set();
        this._csiHandlers = this._createCsiHandlers();
        this._initGrid();
    }

    /**
     * Returns the current screen size
     * @returns {object} The rows and columns of the screen
     */
    getSize() {
        const layout = this._layoutProvider.getLayout();
        if (!layout) return { rows: 0, columns: 0 };
        return {
            rows: layout.rows,
            columns: layout.columns,
        };
    }

    /**
     * Returns the current cursor position on the screen
     * @returns {object} The cursor position {x, y}
     */
    getCursor() {
        return { x: this._cursor.x, y: this._cursor.y };
    }

    /**
     * Adds a listener for a row leaving the top of the screen into scrollback
     * @param {Function} listener The listener to add. It receives an event whose row left the screen
     * @returns {Function} A function to remove the listener
     */
    onScrollbackAddRow(listener) {
        this._scrollbackAddRowListeners.add(listener);
        return () => this._scrollbackAddRowListeners.delete(listener);
    }

    /**
     * Emits the scrollback add row event
     * @param {object} event The event object. event.row is the row that left the top of the screen
     */
    _emitScrollbackAddRow(event) {
        this._scrollbackAddRowListeners.forEach(listener => listener(event));
    }

    /**
     * Adds a listener for a scrollback clear
     * @param {Function} listener The listener to add
     * @returns {Function} A function to remove the listener
     */
    onScrollbackClear(listener) {
        this._scrollbackClearListeners.add(listener);
        return () => this._scrollbackClearListeners.delete(listener);
    }

    /**
     * Emits the scrollback clear event
     */
    _emitScrollbackClear() {
        this._scrollbackClearListeners.forEach(listener => listener());
    }

    /**
     * Returns the current SGR format used for new cells
     * @returns {string|null} The current format
     */
    getFormat() {
        return this._format;
    }

    /**
     * Sets the current SGR format used for new cells
     * @param {string|null} format The format to use
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    setFormat(format = null) {
        this._format = format;
        return this;
    }

    /**
     * Drops an unfinished escape sequence and clears the SGR format.
     * Command output must not keep coloring the prompt or typed text.
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    resetFormat() {
        this._ansiParser.reset();
        this._format = null;
        return this;
    }

    /**
     * Returns the screen rows
     * @returns {BufferRow[]} The screen rows
     */
    getRows() {
        return this._rows.slice();
    }

    /**
     * Returns the row at the given screen index
     * @param {number} index The row index
     * @returns {BufferRow|null} The row or null
     */
    getRow(index = 0) {
        if (index < 0 || index >= this._rows.length) return null;
        return this._rows[index];
    }

    /**
     * Replaces a screen row
     * @param {number} index The row index
     * @param {BufferRow} row The row to set
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    setRow(index, row) {
        if (index < 0 || index >= this._rows.length || !row) return this;
        this._rows[index] = row;
        this.markRowUsed(index);
        return this;
    }

    /**
     * Returns the cell at the given screen position
     * @param {number} column The column index
     * @param {number} row The row index
     * @returns {BufferCell|null} The cell or null
     */
    getCell(column = 0, row = 0) {
        const bufferRow = this.getRow(row);
        if (!bufferRow) return null;
        return bufferRow.getCell(column);
    }

    /**
     * Sets the cell at the given screen position
     * @param {number} column The column index
     * @param {number} row The row index
     * @param {string} text The text to set
     * @param {string|null} format The format to set
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    setCell(column, row, text = ' ', format = null) {
        const bufferRow = this.getRow(row);
        if (!bufferRow) return this;
        const cell = new BufferCell(text, format, 1);
        bufferRow.setCell(column, cell);
        this.markRowUsed(row);
        return this;
    }

    /**
     * Returns the number of used output rows on the screen
     * @returns {number} The used row count
     */
    getUsedRowCount() {
        return this._usedRowCount;
    }

    /**
     * Returns the used output rows on the screen
     * @returns {BufferRow[]} The used rows
     */
    getUsedRows() {
        const count = this.getUsedRowCount();
        if (count <= 0) return [];
        return this._rows.slice(0, Math.min(count, this._rows.length));
    }

    /**
     * Returns a used output row by index
     * @param {number} index The used row index
     * @returns {BufferRow|null} The row or null
     */
    getUsedRow(index = 0) {
        if (index < 0 || index >= this.getUsedRowCount()) return null;
        return this.getRow(index);
    }

    /**
     * Marks the given row as used output. A row outside the grid is ignored
     * @param {number} row The row index
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    markRowUsed(row = 0) {
        if (row < 0 || this._rows.length === 0) return this;
        const usedRow = Math.min(row, this._rows.length - 1);
        this._usedRowCount = Math.max(this._usedRowCount, usedRow + 1);
        return this;
    }

    /**
     * Drops trailing blank rows from the used output
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    trimUsedRows() {
        while (this._usedRowCount > 0) {
            const row = this._rows[this._usedRowCount - 1];
            if (row && !row.isEmpty()) break;
            this._usedRowCount--;
        }
        return this;
    }

    /**
     * Moves the cursor to the given screen position
     * @param {number} column The column index
     * @param {number} row The row index
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    moveCursor(column = 0, row = 0) {
        const { rows, columns } = this.getSize();
        if (rows <= 0 || columns <= 0) return this;
        this._cursor.y = Math.max(0, Math.min(row, rows - 1));
        this._cursor.x = Math.max(0, Math.min(column, columns));
        return this;
    }

    /**
     * Writes text at the cursor, applying SGR and CSI sequences and control characters
     * @param {string} text The text to write
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    write(text = '') {
        if (text == null || text === '') return this;
        this._ansiParser.push(text, {
            onSgr: (params) => {
                this.setFormat(TextFormat.mergeSgrFormat(this._format, params));
            },
            onChar: (character) => {
                this.writeChar(character);
            },
            onCsi: (params, command) => {
                this._handleCsi(params, command);
            }
        });
        return this;
    }

    /**
     * Writes a single character at the cursor
     * @param {string} character The character to write
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    writeChar(character = '') {
        if (!character) return this;
        const controlMethod = CONTROL_CHARACTER_METHODS.get(character);
        if (controlMethod) {
            this[controlMethod]();
            return this;
        }
        const code = character.charCodeAt(0);
        if (code < 32 || code === 127) return this;
        const { columns } = this.getSize();
        if (columns <= 0) return this;
        if (this._cursor.x >= columns) {
            this._wrapToNextRow();
        }
        const row = this._rows[this._cursor.y];
        if (!row) return this;
        row.setCell(this._cursor.x, new BufferCell(character, this._format, 1));
        this.markRowUsed(this._cursor.y);
        this._cursor.x++;
        return this;
    }

    /**
     * Moves the cursor to column 0 of the current row
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    carriageReturn() {
        this._cursor.x = 0;
        return this;
    }

    /**
     * Moves the cursor to the next row, scrolling the scrolling region when it is on the bottom margin.
     * Newline mode also returns the cursor to column 0.
     * After a scroll, the cursor row stays part of the used output
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    lineFeed() {
        this.markRowUsed(this._cursor.y);
        if (this._newlineMode) this._cursor.x = 0;
        const { rows } = this.getSize();
        if (rows <= 0) return this;
        const { bottom } = this._regionBounds();
        if (this._cursor.y === bottom) {
            this.scrollUp(1);
            this.markRowUsed(this._cursor.y);
            return this;
        }
        if (this._cursor.y + 1 < rows) this._cursor.y++;
        return this;
    }

    /**
     * Moves the cursor one column left without changing the cell
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    backspace() {
        if (this._cursor.x > 0) this._cursor.x--;
        return this;
    }

    /**
     * Advances the cursor to the next tab stop, stopping at the last column.
     * A cursor waiting to wrap stays where it is and does not wrap
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    tab() {
        const { columns } = this.getSize();
        if (columns <= 0 || this._cursor.x >= columns) return this;
        const nextTab = this._cursor.x + (TERMINAL_DEFAULT_TAB_SIZE - (this._cursor.x % TERMINAL_DEFAULT_TAB_SIZE));
        this._cursor.x = Math.min(nextTab, columns - 1);
        return this;
    }

    /**
     * Erases cells on the current row
     * @param {number} mode 0 = cursor to end, 1 = start to cursor, 2 = whole row
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    eraseInLine(mode = ERASE_MODE_CURSOR_TO_END) {
        const row = this._rows[this._cursor.y];
        if (!row || mode < ERASE_MODE_CURSOR_TO_END || mode > ERASE_MODE_WHOLE_SCREEN) return this;
        const { columns } = this.getSize();
        let start = 0;
        let end = columns;
        if (mode === ERASE_MODE_CURSOR_TO_END) {
            start = this._cursor.x;
        } else if (mode === ERASE_MODE_START_TO_CURSOR) {
            end = Math.min(this._cursor.x + 1, columns);
        }
        for (let x = start; x < end; x++) {
            row.setCell(x, BufferCell.blank());
        }
        return this;
    }

    /**
     * Erases cells on the screen
     * @param {number} mode 0 = cursor to end, 1 = start to cursor, 2 = whole screen into scrollback, 3 = scrollback only
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    eraseInDisplay(mode = ERASE_MODE_CURSOR_TO_END) {
        const { rows } = this.getSize();
        if (mode === ERASE_MODE_SCROLLBACK) {
            this._emitScrollbackClear();
            return this;
        }
        if (mode === ERASE_MODE_WHOLE_SCREEN) {
            const used = this.getUsedRows();
            for (let i = 0; i < used.length; i++) {
                this._emitScrollbackAddRow({ row: used[i] });
            }
            this._fillBlankRows(0, rows);
            this._usedRowCount = 0;
            return this;
        }
        if (mode === ERASE_MODE_CURSOR_TO_END) {
            this.eraseInLine(ERASE_MODE_CURSOR_TO_END);
            this._fillBlankRows(this._cursor.y + 1, rows);
            this._usedRowCount = Math.min(this._usedRowCount, this._cursor.y + 1);
            return this;
        }
        if (mode === ERASE_MODE_START_TO_CURSOR) {
            this._fillBlankRows(0, this._cursor.y);
            this.eraseInLine(ERASE_MODE_START_TO_CURSOR);
            this._usedRowCount = Math.max(this._usedRowCount, this._cursor.y + 1);
            return this;
        }
        return this;
    }

    /**
     * Scrolls the screen up, pushing top rows into scrollback
     * @param {number} count The number of rows to scroll
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    scrollUp(count = DEFAULT_SCROLL_COUNT) {
        const { columns } = this.getSize();
        const { top, bottom, rows } = this._regionBounds();
        const amount = Math.min(Math.max(0, count), bottom - top + 1);
        if (amount === 0 || rows === 0) return this;
        for (let n = 0; n < amount; n++) {
            const leaving = this._rows[top];
            if (top === 0 && leaving) this._emitScrollbackAddRow({ row: leaving });
            for (let y = top; y < bottom; y++) {
                this._rows[y] = this._rows[y + 1];
            }
            this._rows[bottom] = BufferRow.blank(columns);
        }
        if (top === 0 && bottom === rows - 1) {
            this._usedRowCount = Math.max(0, this._usedRowCount - amount);
        }
        return this;
    }

    /**
     * Scrolls the screen down inside the scrolling region, discarding rows that leave the bottom
     * @param {number} count The number of rows to scroll
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    scrollDown(count = DEFAULT_SCROLL_COUNT) {
        const { columns } = this.getSize();
        const { top, bottom, rows } = this._regionBounds();
        const amount = Math.min(Math.max(0, count), bottom - top + 1);
        if (amount === 0 || rows === 0) return this;
        for (let n = 0; n < amount; n++) {
            for (let y = bottom; y > top; y--) {
                this._rows[y] = this._rows[y - 1];
            }
            this._rows[top] = BufferRow.blank(columns);
        }
        if (top === 0 && bottom === rows - 1) {
            this._usedRowCount = Math.min(rows, this._usedRowCount + amount);
        }
        return this;
    }

    /**
     * Recreates the screen grid at the given size
     * @param {number} rows The number of rows
     * @param {number} columns The number of columns
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    resize(rows = 0, columns = 0) {
        this._rows = [];
        for (let y = 0; y < rows; y++) {
            this._rows.push(BufferRow.blank(columns));
        }
        this._cursor = { x: 0, y: 0 };
        this._usedRowCount = 0;
        this._scrollTop = 0;
        this._scrollBottom = Math.max(0, rows - 1);
        return this;
    }

    /**
     * Clears the screen grid without touching scrollback
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    clear() {
        const { rows, columns } = this.getSize();
        this._ansiParser.reset();
        this.resize(rows, columns);
        this._format = null;
        return this;
    }

    /**
     * Applies a CSI command to the screen cursor and grid
     * @param {string} params The raw CSI parameter string
     * @param {string} command The CSI final byte
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    _handleCsi(params = '', command = '') {
        const parsed = this._parseCsiParams(params);
        const count = Math.max(1, this._csiParam(parsed, 0, 1));
        const handler = this._csiHandlers.get(command);
        if (handler) handler(parsed, count);
        return this;
    }

    /**
     * Creates the CSI handlers by final byte. Each handler receives the parsed parameters
     * and the first parameter as a count of at least 1
     * @returns {Map<string, function((number|null)[], number): void>} The handlers by CSI final byte
     */
    _createCsiHandlers() {
        return new Map([
            ['A', (parsed, count) => this.moveCursor(this._cursor.x, this._cursor.y - count)],
            ['B', (parsed, count) => this.moveCursor(this._cursor.x, this._cursor.y + count)],
            ['C', (parsed, count) => this.moveCursor(this._cursor.x + count, this._cursor.y)],
            ['D', (parsed, count) => this.moveCursor(this._cursor.x - count, this._cursor.y)],
            ['E', (parsed, count) => this.moveCursor(0, this._cursor.y + count)],
            ['F', (parsed, count) => this.moveCursor(0, this._cursor.y - count)],
            ['G', (parsed, count) => this.moveCursor(count - 1, this._cursor.y)],
            ['H', (parsed) => this.moveCursor(
                Math.max(1, this._csiParam(parsed, 1, 1)) - 1,
                Math.max(1, this._csiParam(parsed, 0, 1)) - 1
            )],
            ['f', (parsed) => this.moveCursor(
                Math.max(1, this._csiParam(parsed, 1, 1)) - 1,
                Math.max(1, this._csiParam(parsed, 0, 1)) - 1
            )],
            ['J', (parsed) => this.eraseInDisplay(this._csiParam(parsed, 0, 0))],
            ['K', (parsed) => this.eraseInLine(this._csiParam(parsed, 0, 0))],
            ['S', (parsed, count) => this.scrollUp(count)],
            ['T', (parsed, count) => {
                if (parsed.length > 1) return;
                this.scrollDown(count);
            }],
            ['r', (parsed) => this._setScrollRegion(parsed)],
            ['h', (parsed) => this._setMode(parsed, true)],
            ['l', (parsed) => this._setMode(parsed, false)],
        ]);
    }

    /**
     * Returns the inclusive scrolling region in screen rows
     * @returns {object} The top, bottom, and screen row count
     */
    _regionBounds() {
        const rows = this._rows.length;
        if (rows <= 0) return { top: 0, bottom: 0, rows: 0 };
        const top = Math.max(0, Math.min(this._scrollTop, rows - 1));
        const bottom = Math.max(top, Math.min(this._scrollBottom, rows - 1));
        return { top, bottom, rows };
    }

    /**
     * Sets the scrolling region from a DECSTBM sequence and homes the cursor
     * @param {(number|null)[]} parsed The parsed CSI parameters
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    _setScrollRegion(parsed = []) {
        const { rows } = this.getSize();
        if (rows <= 0) return this;
        const top = Math.max(1, this._csiParam(parsed, 0, 1));
        const bottom = Math.max(1, this._csiParam(parsed, 1, rows));
        if (top >= bottom) return this;
        this._scrollTop = Math.min(top, rows) - 1;
        this._scrollBottom = Math.min(bottom, rows) - 1;
        this.moveCursor(0, 0);
        return this;
    }

    /**
     * Sets a terminal mode. Mode 20 is newline mode, where line feed also returns the cursor
     * @param {(number|null)[]} parsed The parsed CSI parameters
     * @param {boolean} enabled True to set the mode
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    _setMode(parsed = [], enabled = true) {
        const mode = this._csiParam(parsed, 0, 0);
        if (mode === MODE_NEWLINE) this._newlineMode = enabled;
        return this;
    }

    /**
     * Parses a CSI parameter string into numbers
     * @param {string} params The raw CSI parameter string
     * @returns {(number|null)[]} The parsed parameters
     */
    _parseCsiParams(params = '') {
        if (params == null || params === '') return [];
        return params.split(';').map((part) => {
            if (part === '') return null;
            const value = Number(part);
            return Number.isFinite(value) ? value : null;
        });
    }

    /**
     * Returns a CSI parameter or its default
     * @param {(number|null)[]} params The parsed parameters
     * @param {number} index The parameter index
     * @param {number} defaultValue The default value
     * @returns {number} The parameter value
     */
    _csiParam(params = [], index = 0, defaultValue = 1) {
        const value = params[index];
        if (value == null) return defaultValue;
        return value;
    }

    /**
     * Wraps from the end of the current row onto the next row
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    _wrapToNextRow() {
        const row = this._rows[this._cursor.y];
        if (row) row.setWrapped(true);
        this.lineFeed();
        this._cursor.x = 0;
        return this;
    }

    /**
     * Fills screen rows with blank cells
     * @param {number} startRow The first row to fill
     * @param {number} endRow The exclusive last row
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    _fillBlankRows(startRow, endRow) {
        const { columns } = this.getSize();
        for (let y = startRow; y < endRow; y++) {
            if (this._rows[y]) {
                this._rows[y] = BufferRow.blank(columns);
            }
        }
        return this;
    }

    /**
     * Creates the grid when it has not been initialized yet
     * @returns {ScreenBuffer} The instance of the ScreenBuffer
     */
    _initGrid() {
        if (this._rows.length > 0) return this;
        const { rows, columns } = this.getSize();
        if (rows <= 0 || columns <= 0) return this;
        this.resize(rows, columns);
        return this;
    }
}

export default ScreenBuffer