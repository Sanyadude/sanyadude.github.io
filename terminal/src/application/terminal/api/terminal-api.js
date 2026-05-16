/**
 * Terminal API class - represents a API for the terminal
 */
export class TerminalApi {
    /**
     * Creates a new TerminalApi instance
     * @param {object} context - The context of the terminal
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Gets the terminal info
     * @returns {object} - The terminal info
     */
    getTerminalInfo() {
        return this._context._info;
    }

    /**
     * Sets the theme of the terminal
     * @param {string} themeName - The name of the theme to set
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setTheme(themeName) {
        this._context.themeProvider.setTheme(themeName);
        return this;
    }

    /**
     * Gets the current theme of the terminal
     * @returns {object} - The current theme
     */
    getTheme() {
        return this._context.themeProvider.getTheme();
    }

    /**
     * Gets the themes of the terminal
     * @returns {object} - The themes of the terminal
     */
    getThemes() {
        return Object.values(this._context.themeProvider.getThemes());
    }

    /**
     * Sets the previous theme
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setPreviousTheme() {
        this._context.themeProvider.setPreviousTheme();
        return this;
    }

    /**
     * Sets the next theme
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setNextTheme() {
        this._context.themeProvider.setNextTheme();
        return this;
    }

    /**
     * Sets the prompt formatting similar to linux terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setLinuxPrompt() {
        this._context.inputPrompt.setPromptTypeLinux();
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Sets the prompt formatting similar to windows terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setWindowsPrompt() {
        this._context.inputPrompt.setPromptTypeWindows();
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Sets the style of the cursor to caret
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setCursorStyleCaret() {
        this._context.cursorRenderer.setCursorStyleCaret();
        return this;
    }

    /**
     * Sets the style of the cursor to underline
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setCursorStyleUnderline() {
        this._context.cursorRenderer.setCursorStyleUnderline();
        return this;
    }

    /**
     * Toggles the scrollbar use theme
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    toggleScrollbarUseTheme() {
        this._context.terminalViewport.setScrollContainerUseTheme(!this._context.terminalViewport.isScrollContainerUsesTheme());
        this._context.terminalViewport.applyTheme(this._context.themeProvider.getTheme());
        return this;
    }

    /**
     * Checks if the scrollbar use theme is enabled
     * @returns {boolean} - True if the scrollbar use theme is enabled, false otherwise
     */
    isScrollbarUseThemeEnabled() {
        return this._context.terminalViewport._applyThemeToScrollContainer;
    }

    /**
     * Toggles the debug
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    toggleDebug() {
        if (this._context.terminalDebug.isEnabled()) {
            this._context.terminalDebug.disable();
        } else {
            this._context.terminalDebug.enable();
        }
        return this;
    }

    /**
     * Checks if the debug is enabled
     * @returns {boolean} - True if the debug is enabled, false otherwise
     */
    isDebugEnabled() {
        return this._context.terminalDebug.isEnabled();
    }

    /**
     * Enables the debug
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    enableDebug() {
        this._context.terminalDebug.enable();
        return this;
    }

    /**
     * Disables the debug
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    disableDebug() {
        this._context.terminalDebug.disable();
        return this;
    }

    /**
     * Gets the size of the terminal
     * @returns {object} - The size of the terminal
     */
    getSize() {
        return this._context.textViewport.getViewport();
    }

    /**
     * Clears the terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    clear() {
        this._context.inputHistoryNavigation.clear();
        this._context.textBuffer.clear();
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Renders entries into the lines container
     */
    render() {
        const lines = this._context.textBuffer.getWrappedLines(this._context.textViewport.getOffsetLine(), this._context.textViewport.getViewport().lines);
        const selectionRanges = this._context.textSelection.getSelectionRanges();
        const linesSelectionRanges = lines.map(line => selectionRanges[line.wrapIndex] || null);
        this._context.textRenderer.renderLines(lines, linesSelectionRanges);
    }

    /**
     * Renders the cursor
     */
    renderCursor() {
        const cursorPosition = this._context.textBuffer.getCursorPosition();
        if (!this._context.textViewport.isPositionInViewport(cursorPosition.line, cursorPosition.column)) {
            this._context.cursorRenderer.hide();
            return;
        }
        const { line, column } = this._context.textViewport.toViewportPosition(cursorPosition.line, cursorPosition.column);
        this._context.cursorRenderer.show();
        this._context.cursorRenderer.renderCursor(line, column);
        this._context.cursorRenderer.resetAnimation();
    }

    /**
     * Ensures the input is in the viewport
     */
    ensureInputIsInViewport() {
        const inputTextStartPosition = this._context.textBuffer.getInputTextStartPosition();
        const inputIsInViewport = this._context.textViewport.isPositionInViewport(inputTextStartPosition.line, inputTextStartPosition.column);
        if (!inputIsInViewport) {
            const offsetLine = this._context.textViewport.getOffset().line;
            const inputTextLine = inputTextStartPosition.line;
            const viewportLines = this._context.textViewport.getViewport().lines;
            const linePadding = 2;
            if (inputTextLine - offsetLine < 0) {
                this._context.textViewport.scrollY(inputTextLine - offsetLine - linePadding);
            }
            if (inputTextLine - offsetLine + linePadding >= viewportLines) {
                this._context.textViewport.scrollY(inputTextLine - offsetLine - viewportLines + linePadding);
            }
        }
        this._context.terminalViewport.setScrollThumbPosition((this._context.textViewport.getOffsetLine() / this._context.scrollBoundsProvider.getMaxOffsetLine()) * 100);
    }

    /**
     * Writes text to the terminal
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    write(text = '') {
        this._context.inputCompletion.reset();
        this._context.inputCompletion.setOptions(this._context.shell.getCwdCompletionList());
        this._context.textBuffer.addToLine(text);
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this._context.textBuffer.setInputText();
        this._context.textBuffer.moveCursorTo();
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Writes a line to the terminal
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    writeLine(text = '') {
        this._context.inputCompletion.reset();
        this._context.inputCompletion.setOptions(this._context.shell.getCwdCompletionList());
        this._context.textBuffer.addNewLine(text);
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this._context.textBuffer.setInputText();
        this._context.textBuffer.moveCursorTo();
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Removes a line from the terminal
     * @param {number} index - The index of the line to remove
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    removeLine(index = null) {
        this._context.textBuffer.removeLine(index);
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this._context.textBuffer.setInputText();
        this._context.textBuffer.moveCursorTo();
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Writes the prompt to the terminal
     * @param {string} user - The user of the prompt
     * @param {string} host - The host of the prompt
     * @param {string} cwd - The current working directory of the prompt
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    writePrompt(user, host, cwd, text = '') {
        const promptText = this._context.inputPrompt.formatPromptText(user, host, cwd);
        this.writeLine(promptText + text);
        return this;
    }

    /**
     * Gets the input history
     * @returns {string[]} - The input history
     */
    getInputHistory() {
        return this._context.inputHistoryNavigation.getHistory();
    }

    /**
     * Inputs command into the terminal and executes it
     * @param {string} text - The text to input
     */
    input(text = '') {
        this._context.inputHistoryNavigation.addInput(text);
        this._context.shell.input(text);
    }

    /**
     * Outputs text into the terminal
     * @param {string} text - The text to output
     */
    output(text = '') {
        this.writeLine(text);
    }
}

export default TerminalApi