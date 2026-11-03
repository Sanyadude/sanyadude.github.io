import { InputBuffer } from './input-buffer.js'
import { InputCompletion } from './input-completion.js'
import { InputEcho } from './input-echo.js'
import { InputHistory } from './input-history.js'
import { InputPrompt } from './input-prompt.js'
import { ReadPrompt } from './read-prompt.js'

/**
 * ShellReadline - line editor for shell input and prompt interaction
 * Applies edits to the input buffer and echoes them through the terminal
 */
export class ShellReadline {
    /**
     * Creates a new ShellReadline instance
     */
    constructor() {
        this._inputBuffer = new InputBuffer();
        this._completion = new InputCompletion();
        this._history = new InputHistory();
        this._prompt = new InputPrompt();
        this._readPrompt = new ReadPrompt();
        this._inputEcho = new InputEcho();
        this._reading = false;
    }

    /**
     * Starts an application line read
     * The shell prompt is left unchanged. Caret placement uses the read prompt width.
     * @param {string} prompt The prompt text written on the terminal for this read
     * @param {object} options The readline options for this read
     * @param {boolean} [options.history] Whether the committed line is stored in history
     * @param {boolean} [options.echo] Whether edits are written to the terminal
     * @param {boolean} [options.mask] Whether each input character is shown as *
     * @returns {ShellReadline} The readline instance
     */
    startRead(prompt = '', { history = false, echo = true, mask = false } = {}) {
        this._history.setEnabled(history);
        this._inputEcho.setEnabled(echo);
        this._inputEcho.setMask(mask);
        this._reading = true;
        this._readPrompt.setText(prompt);
        this._inputEcho.setPromptLength(this._readPrompt.getLength());
        this.discard();
        this._completion.reset();
        this._history.reset();
        return this;
    }

    /**
     * Ends an application line read and restores shell history, echo, and mask
     * @returns {ShellReadline} The readline instance
     */
    stopRead() {
        if (!this._reading) return this;
        this._reading = false;
        this._readPrompt.setText('');
        this._inputEcho.setPromptLength(this._prompt.getLength());
        this.discard();
        this._completion.reset();
        this._history.reset();
        this._history.setEnabled(true);
        this._inputEcho.setEnabled(true);
        this._inputEcho.setMask(false);
        return this;
    }

    /**
     * Cancels an application line read
     * Moves the caret to the end of an echoed line before restoring shell input
     * @returns {ShellReadline} The readline instance
     */
    cancelRead() {
        if (this._inputEcho.isEnabled()) {
            this.moveCursorToEnd();
        }
        return this.stopRead();
    }

    /**
     * Sets the terminal that echoes input edits
     * @param {object|null} terminal The terminal. Uses write and getSize
     * @returns {ShellReadline} The readline instance
     */
    setTerminal(terminal = null) {
        this._inputEcho.setTerminal(terminal);
        return this;
    }

    /**
     * Sets the prompt formatting similar to a linux terminal
     * @returns {ShellReadline} The readline instance
     */
    setLinuxPrompt() {
        this._prompt.setPromptTypeLinux();
        return this;
    }

    /**
     * Sets the prompt formatting similar to a windows terminal
     * @returns {ShellReadline} The readline instance
     */
    setWindowsPrompt() {
        this._prompt.setPromptTypeWindows();
        return this;
    }

    /**
     * Sets the prompt text
     * @param {string} user The user name
     * @param {string} host The host name
     * @param {string} cwd The current working directory
     * @returns {ShellReadline} The readline instance
     */
    setPrompt(user, host, cwd) {
        this._prompt.setPrompt(user, host, cwd);
        if (this._reading) return this;
        this._inputEcho.setPromptLength(this._prompt.getLength());
        return this;
    }

    /**
     * Returns the last generated prompt, including color codes
     * @returns {string} The prompt text
     */
    getPromptText() {
        return this._prompt.getText();
    }

    /**
     * Returns the visible length of the last generated prompt
     * @returns {number} The prompt length in cells
     */
    getPromptLength() {
        return this._prompt.getLength();
    }

    /**
     * Returns the input text
     * @returns {string} The input text
     */
    getText() {
        return this._inputBuffer.getText();
    }

    /**
     * Sets the input text
     * @param {string} text The input text
     * @returns {ShellReadline} The readline instance
     */
    setText(text = '') {
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        this._inputBuffer.setText(text);
        this._inputEcho.replace(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }

    /**
     * Returns the length of the input text
     * @returns {number} The length of the input text
     */
    getLength() {
        return this._inputBuffer.getLength();
    }

    /**
     * Returns the index of the cursor inside the input text
     * @returns {number} The index of the cursor
     */
    getCursorIndex() {
        return this._inputBuffer.getCursorIndex();
    }

    /**
     * Inserts text at the cursor and ends an active completion
     * @param {string} text The text to insert
     * @returns {ShellReadline} The readline instance
     */
    insert(text = '') {
        this._completion.reset();
        if (!text) return this;
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        this._inputBuffer.insertAtCursor(text);
        this._inputEcho.insert(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }

    /**
     * Deletes the character backward from the cursor
     * @returns {ShellReadline} The readline instance
     */
    deleteBackward() {
        this._completion.reset();
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        this._inputBuffer.deleteAtCursorBackward();
        this._inputEcho.deleteBackward(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }

    /**
     * Deletes backward from the cursor to the word boundary used by word navigation
     * @returns {ShellReadline} The readline instance
     */
    deleteWordBackward() {
        this._completion.reset();
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        this._inputBuffer.deleteWordBackward();
        this._inputEcho.deleteBackward(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }

    /**
     * Deletes the character forward from the cursor
     * @returns {ShellReadline} The readline instance
     */
    deleteForward() {
        this._completion.reset();
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        this._inputBuffer.deleteAtCursorForward();
        this._inputEcho.deleteForward(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }

    /**
     * Moves the cursor to the given index
     * @param {number} index The index of the cursor
     * @returns {ShellReadline} The readline instance
     */
    moveCursorTo(index = 0) {
        return this._moveCursor(() => this._inputBuffer.moveCursorTo(index));
    }

    /**
     * Moves the cursor backward
     * @param {number} columns The number of characters to move the cursor backward
     * @returns {ShellReadline} The readline instance
     */
    moveCursorBackward(columns = 1) {
        return this.moveCursorTo(this._inputBuffer.getCursorIndex() - columns);
    }

    /**
     * Moves the cursor forward
     * @param {number} columns The number of characters to move the cursor forward
     * @returns {ShellReadline} The readline instance
     */
    moveCursorForward(columns = 1) {
        return this.moveCursorTo(this._inputBuffer.getCursorIndex() + columns);
    }

    /**
     * Moves the cursor to the start of the input
     * @returns {ShellReadline} The readline instance
     */
    moveCursorToStart() {
        return this.moveCursorTo(0);
    }

    /**
     * Moves the cursor to the end of the input
     * @returns {ShellReadline} The readline instance
     */
    moveCursorToEnd() {
        return this.moveCursorTo(this._inputBuffer.getLength());
    }

    /**
     * Moves the cursor to the start of the word backward
     * @returns {ShellReadline} The readline instance
     */
    moveCursorWordBackward() {
        return this._moveCursor(() => this._inputBuffer.moveCursorToWordStartBackward());
    }

    /**
     * Moves the cursor to the start of the word forward
     * @returns {ShellReadline} The readline instance
     */
    moveCursorWordForward() {
        return this._moveCursor(() => this._inputBuffer.moveCursorToWordStartForward());
    }

    /**
     * Clears the input text
     * @returns {ShellReadline} The readline instance
     */
    clear() {
        return this.setText('');
    }

    /**
     * Drops the line without changing the screen
     * @returns {ShellReadline} The readline instance
     */
    discard() {
        this._inputBuffer.discard();
        return this;
    }

    /**
     * Sets the completion options
     * @param {string[]} options The completion options
     * @returns {ShellReadline} The readline instance
     */
    setCompletionOptions(options = []) {
        this._completion.setOptions(options);
        return this;
    }

    /**
     * Completes the token at the cursor and writes the result into the input buffer
     * @param {boolean} reverse Whether to cycle through matches in reverse
     * @returns {ShellReadline} The readline instance
     */
    complete(reverse = false) {
        if (this._reading) return this;
        const completion = this._completion.complete(
            this._inputBuffer.getText(),
            this._inputBuffer.getCursorIndex(),
            reverse
        );
        return this._replaceText(completion.text, completion.index);
    }

    /**
     * Resets the active completion cycle
     * @returns {ShellReadline} The readline instance
     */
    resetCompletion() {
        this._completion.reset();
        return this;
    }

    /**
     * Returns the input history
     * @returns {string[]} The input history
     */
    getHistory() {
        return this._history.getHistory();
    }

    /**
     * Adds a line to the history
     * @param {string} input The input text
     * @returns {ShellReadline} The readline instance
     */
    addHistory(input = '') {
        this._history.push(input);
        return this;
    }

    /**
     * Replaces the input with the previous history entry
     * @returns {ShellReadline} The readline instance
     */
    historyBackward() {
        if (this._reading) return this;
        this.resetCompletion();
        const current = this._inputBuffer.getText();
        const wasActive = this._history.isActive();
        const text = this._history.navigateBackward(current);
        if (!wasActive && text === current) return this;
        return this._replaceText(text, text.length);
    }

    /**
     * Replaces the input with the next history entry, or the saved draft
     * @returns {ShellReadline} The readline instance
     */
    historyForward() {
        if (this._reading) return this;
        this.resetCompletion();
        const current = this._inputBuffer.getText();
        const wasActive = this._history.isActive();
        const text = this._history.navigateForward(current);
        if (!wasActive && text === current) return this;
        return this._replaceText(text, text.length);
    }

    /**
     * Clears the input history
     * @returns {ShellReadline} The readline instance
     */
    clearHistory() {
        this._history.clear();
        return this;
    }

    /**
     * Commits the current line and clears the buffer
     * Stores the line in history
     * @returns {string} The accepted line
     */
    commitLine() {
        const text = this._inputBuffer.getText();
        this._history.push(text);
        this.moveCursorToEnd();
        this._inputEcho.breakLine();
        this.discard();
        this._completion.reset();
        return text;
    }

    /**
     * Clears the current line
     * @returns {string} The text that was cancelled
     */
    cancelLine() {
        const text = this._inputBuffer.getText();
        this.clear();
        this._completion.reset();
        this._history.reset();
        return text;
    }

    /**
     * Moves the cursor and echoes the move
     * @param {function} apply Updates the input buffer cursor
     * @returns {ShellReadline} The readline instance
     */
    _moveCursor(apply) {
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        apply();
        this._inputEcho.move(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }

    /**
     * Replaces the input text, places the cursor, and echoes once
     * @param {string} text The input text
     * @param {number} cursorIndex The cursor index
     * @returns {ShellReadline} The readline instance
     */
    _replaceText(text = '', cursorIndex = 0) {
        const previousCursor = this._inputBuffer.getCursorIndex();
        const previousText = this._inputBuffer.getText();
        this._inputBuffer.setText(text);
        this._inputBuffer.moveCursorTo(cursorIndex);
        this._inputEcho.replace(previousCursor, previousText, this._inputBuffer.getCursorIndex(), this._inputBuffer.getText());
        return this;
    }
}

export default ShellReadline