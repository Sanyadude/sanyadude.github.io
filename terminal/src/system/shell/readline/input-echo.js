/**
 * InputEcho - writes input edits and caret moves through the terminal
 * Masking replaces input characters with asterisks. Erase padding and cursor sequences stay unchanged.
 */
export class InputEcho {
    /**
     * Creates a new InputEcho instance
     */
    constructor() {
        this._terminal = null;
        this._enabled = true;
        this._mask = false;
        this._promptLength = 0;
    }

    /**
     * Sets the terminal that receives edits
     * @param {object|null} terminal The terminal. Uses write and getSize
     * @returns {InputEcho} The instance of the InputEcho
     */
    setTerminal(terminal = null) {
        this._terminal = terminal;
        return this;
    }

    /**
     * Sets whether edits are written to the terminal
     * @param {boolean} enabled Whether edits are written
     * @returns {InputEcho} The instance of the InputEcho
     */
    setEnabled(enabled = true) {
        this._enabled = Boolean(enabled);
        return this;
    }

    /**
     * Returns whether edits are written to the terminal
     * @returns {boolean} True when edits are written
     */
    isEnabled() {
        return this._enabled;
    }

    /**
     * Sets whether each input character is shown as *
     * @param {boolean} mask Whether input characters are masked
     * @returns {InputEcho} The instance of the InputEcho
     */
    setMask(mask = false) {
        this._mask = Boolean(mask);
        return this;
    }

    /**
     * Sets the visible width of the prompt that owns the input line
     * @param {number} length The prompt length in cells
     * @returns {InputEcho} The instance of the InputEcho
     */
    setPromptLength(length = 0) {
        this._promptLength = length > 0 ? length : 0;
        return this;
    }

    /**
     * Returns the visible width of the prompt that owns the input line
     * @returns {number} The prompt length in cells
     */
    getPromptLength() {
        return this._promptLength;
    }

    /**
     * Echoes a full replacement of the input text
     * @param {number} previousCursor The cursor index before the replacement
     * @param {string} previousText The input text before the replacement
     * @param {number} cursor The cursor index after the replacement
     * @param {string} text The input text after the replacement
     * @returns {InputEcho} The instance of the InputEcho
     */
    replace(previousCursor = 0, previousText = '', cursor = 0, text = '') {
        const previousLength = previousText.length;
        const pad = Math.max(0, previousLength - text.length);
        const written = this._maskText(text) + ' '.repeat(pad);
        const toStart = this._moveCommand(previousCursor, 0, previousLength);
        const toCursor = this._moveCommand(written.length, cursor, written.length);
        return this._write(toStart + written + toCursor);
    }

    /**
     * Echoes text inserted at the cursor
     * @param {number} previousCursor The cursor index before the insert
     * @param {string} previousText The input text before the insert
     * @param {number} cursor The cursor index after the insert
     * @param {string} text The input text after the insert
     * @returns {InputEcho} The instance of the InputEcho
     */
    insert(previousCursor = 0, previousText = '', cursor = 0, text = '') {
        const inserted = text.slice(previousCursor, cursor);
        const tail = previousText.slice(previousCursor);
        return this._write(this._maskText(inserted) + this._maskText(tail) + this._moveCommand(text.length, cursor, text.length));
    }

    /**
     * Echoes a deletion to the left of the cursor
     * @param {number} previousCursor The cursor index before the deletion
     * @param {string} previousText The input text before the deletion
     * @param {number} cursor The cursor index after the deletion
     * @param {string} text The input text after the deletion
     * @returns {InputEcho} The instance of the InputEcho
     */
    deleteBackward(previousCursor = 0, previousText = '', cursor = 0, text = '') {
        const removed = previousCursor - cursor;
        if (removed <= 0) return this;
        const previousLength = previousText.length;
        const tail = text.slice(cursor);
        const toStart = this._moveCommand(previousCursor, cursor, previousLength);
        const toCursor = this._moveCommand(previousLength, cursor, previousLength);
        return this._write(toStart + this._maskText(tail) + ' '.repeat(removed) + toCursor);
    }

    /**
     * Echoes a deletion to the right of the cursor
     * @param {number} previousCursor The cursor index before the deletion
     * @param {string} previousText The input text before the deletion
     * @param {number} cursor The cursor index after the deletion
     * @param {string} text The input text after the deletion
     * @returns {InputEcho} The instance of the InputEcho
     */
    deleteForward(previousCursor = 0, previousText = '', cursor = 0, text = '') {
        const previousLength = previousText.length;
        const removed = previousLength - text.length;
        if (removed <= 0) return this;
        const tail = text.slice(cursor);
        return this._write(this._maskText(tail) + ' '.repeat(removed) + this._moveCommand(previousLength, previousCursor, previousLength));
    }

    /**
     * Echoes a cursor move
     * @param {number} previousCursor The cursor index before the move
     * @param {string} previousText The input text before the move
     * @param {number} cursor The cursor index after the move
     * @param {string} text The input text after the move
     * @returns {InputEcho} The instance of the InputEcho
     */
    move(previousCursor = 0, previousText = '', cursor = 0, text = '') {
        const length = text.length;
        return this._write(this._moveCommand(previousCursor, cursor, length));
    }

    /**
     * Replaces input characters with asterisks when masking is on
     * @param {string} text The input text to show
     * @returns {string} The text to write
     */
    _maskText(text = '') {
        if (!this._mask || !text) return text;
        return '*'.repeat(text.length);
    }

    /**
     * Writes a line break through the terminal
     * A committed line breaks even when character echo is off
     * @returns {InputEcho} The instance of the InputEcho
     */
    breakLine() {
        if (!this._terminal) return this;
        this._terminal.write('\n');
        return this;
    }

    /**
     * Writes an edit through the terminal
     * @param {string} command The write and cursor-move command
     * @returns {InputEcho} The instance of the InputEcho
     */
    _write(command = '') {
        if (!this._enabled || !command || !this._terminal) return this;
        this._terminal.write(command);
        return this;
    }

    /**
     * Builds cursor-move sequences from one input index to another.
     * A wrap is a row change plus a column change, measured from the start of the prompt.
     * @param {number} fromIndex The index the screen cursor is on
     * @param {number} toIndex The index to move to
     * @param {number} length The length of the text currently on screen
     * @returns {string} The command, or an empty string when the cursor does not move
     */
    _moveCommand(fromIndex = 0, toIndex = 0, length = 0) {
        if (!this._terminal || fromIndex === toIndex) return '';
        const from = this._caretOffset(fromIndex, length);
        const to = this._caretOffset(toIndex, length);
        const columnDelta = to.column - from.column;
        const rowDelta = to.rowDelta - from.rowDelta;
        let command = '';
        if (columnDelta < 0) command += `\x1b[${-columnDelta}D`;
        else if (columnDelta > 0) command += `\x1b[${columnDelta}C`;
        if (rowDelta < 0) command += `\x1b[${-rowDelta}A`;
        else if (rowDelta > 0) command += `\x1b[${rowDelta}B`;
        return command;
    }

    /**
     * Returns how far an input index sits from the start of the prompt
     * @param {number} index The index inside the input text
     * @param {number} length The length of the text currently on screen
     * @returns {object} The row delta and the column on that row
     */
    _caretOffset(index = 0, length = 0) {
        const columns = this._getColumns();
        const offset = this._promptLength + index;
        if (columns <= 0) return { rowDelta: 0, column: offset };
        let rowDelta = Math.floor(offset / columns);
        let column = offset % columns;
        if (index === length && offset > 0 && column === 0) {
            rowDelta -= 1;
            column = columns;
        }
        return { rowDelta, column };
    }

    /**
     * Returns the terminal width in cells
     * @returns {number} The column count, or 0 when the terminal has no size
     */
    _getColumns() {
        if (!this._terminal) return 0;
        const size = this._terminal.getSize();
        return size && size.columns > 0 ? size.columns : 0;
    }
}

export default InputEcho