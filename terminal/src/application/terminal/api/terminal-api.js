import { TerminalSession } from '../components/terminal-session.js'
import { TERMINAL_CONFIG_THEME_KEY, TERMINAL_CONFIG_PROMPT_KEY, TERMINAL_CONFIG_CURSOR_KEY, TERMINAL_CONFIG_SYNTAX_KEY } from '../config/config.js'

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
     * Creates a terminal session
     * @param {number} processId - The id of the owning process
     * @returns {TerminalSession} - The terminal session
     */
    createSession(processId) {
        return new TerminalSession(this, processId);
    }

    /**
     * Applies the config to the terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    applyConfig() {
        const themeName = this._context.configProvider.get(TERMINAL_CONFIG_THEME_KEY);
        if (themeName) {
            this.setTheme(themeName);
        }
        const promptType = this._context.configProvider.get(TERMINAL_CONFIG_PROMPT_KEY);
        if (promptType === 'linux') {
            this.setLinuxPrompt();
        } else if (promptType === 'windows') {
            this.setWindowsPrompt();
        }
        const cursorStyle = this._context.configProvider.get(TERMINAL_CONFIG_CURSOR_KEY);
        if (cursorStyle === 'caret') {
            this.setCursorStyleCaret();
        } else if (cursorStyle === 'underline') {
            this.setCursorStyleUnderline();
        }
        const syntax = this._context.configProvider.get(TERMINAL_CONFIG_SYNTAX_KEY);
        if (syntax === 'posix') {
            this.setShellSyntaxPosix();
        } else if (syntax === 'dos') {
            this.setShellSyntaxDos();
        }
        return this;
    }

    /**
     * Sets the theme of the terminal
     * @param {string} themeName - The name of the theme to set
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setTheme(themeName) {
        this._context.themeProvider.setTheme(themeName);
        if (themeName) {
            this._context.configProvider.set(TERMINAL_CONFIG_THEME_KEY, themeName);
        }
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
        const themeName = this._context.themeProvider.getTheme().name;
        if (themeName) {
            this._context.configProvider.set(TERMINAL_CONFIG_THEME_KEY, themeName);
        }
        return this;
    }

    /**
     * Sets the next theme
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setNextTheme() {
        this._context.themeProvider.setNextTheme();
        const themeName = this._context.themeProvider.getTheme().name;
        if (themeName) {
            this._context.configProvider.set(TERMINAL_CONFIG_THEME_KEY, themeName);
        }
        return this;
    }

    /**
     * Sets the prompt formatting similar to linux terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setLinuxPrompt() {
        this._context.inputPrompt.setPromptTypeLinux();
        this._context.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'linux');
        return this.refreshPrompt();
    }

    /**
     * Sets the prompt formatting similar to windows terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setWindowsPrompt() {
        this._context.inputPrompt.setPromptTypeWindows();
        this._context.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'windows');
        return this.refreshPrompt();
    }

    /**
     * Sets the style of the cursor to caret
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setCursorStyleCaret() {
        this._context.cursorRenderer.setCursorStyleCaret();
        this._context.configProvider.set(TERMINAL_CONFIG_CURSOR_KEY, 'caret');
        return this;
    }

    /**
     * Sets the style of the cursor to underline
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setCursorStyleUnderline() {
        this._context.cursorRenderer.setCursorStyleUnderline();
        this._context.configProvider.set(TERMINAL_CONFIG_CURSOR_KEY, 'underline');
        return this;
    }

    /**
     * Sets the shell syntax to POSIX/Unix
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setShellSyntaxPosix() {
        this._context.shell.usePosixSyntax();
        this._context.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'posix');
        return this;
    }

    /**
     * Sets the shell syntax to Windows/DOS
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setShellSyntaxDos() {
        this._context.shell.useDosSyntax();
        this._context.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'dos');
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
     * Clears the terminal (scrollback + input) and shows a fresh prompt
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    clear() {
        this._context.inputHistoryNavigation.clear();
        this._context.textBuffer.clear();
        return this.showPrompt();
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
     * Writes text to scrollback without updating the prompt/input line
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    writeOutput(text = '') {
        this._context.textBuffer.addToLine(text);
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Writes a line to scrollback without updating the prompt/input line
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    writeOutputLine(text = '') {
        this._context.textBuffer.addNewLine(text);
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Removes a scrollback line without updating the prompt/input line
     * @param {number|null} index - The index of the line to remove
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    removeOutputLine(index = null) {
        this._context.textBuffer.removeLine(index);
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Clears scrollback without updating the prompt/input line
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    clearOutput() {
        this._context.textBuffer.clearLines();
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Updates prompt text from the shell without clearing typed input
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    refreshPrompt() {
        const prompt = this._context.shell.getPrompt();
        const promptText = this._context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.setPromptText(promptText);
        this.ensureInputIsInViewport();
        this.render();
        this.renderCursor();
        return this;
    }

    /**
     * Shows a fresh shell prompt and clears the input line
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    showPrompt() {
        this._context.inputCompletion.reset();
        this._context.inputCompletion.setOptions(this._context.shell.getCwdCompletionList());
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
     * Writes text then shows a fresh shell prompt
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    write(text = '') {
        this.writeOutput(text);
        return this.showPrompt();
    }

    /**
     * Writes a line then shows a fresh shell prompt
     * @param {string} text - The text to write
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    writeLine(text = '') {
        this.writeOutputLine(text);
        return this.showPrompt();
    }

    /**
     * Removes a line then shows a fresh shell prompt
     * @param {number|null} index - The index of the line to remove
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    removeLine(index = null) {
        this.removeOutputLine(index);
        return this.showPrompt();
    }

    /**
     * Writes a submitted prompt line into scrollback, then shows a fresh prompt
     * @param {string} user - The user of the prompt
     * @param {string} host - The host of the prompt
     * @param {string} cwd - The current working directory of the prompt
     * @param {string} text - The submitted command text
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    writePrompt(user, host, cwd, text = '') {
        const promptText = this._context.inputPrompt.formatPromptText(user, host, cwd);
        this.writeOutputLine(promptText + text);
        return this.showPrompt();
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
     * Outputs text into the terminal (scrollback only, no prompt refresh)
     * @param {string} text - The text to output
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    output(text = '') {
        return this.writeOutputLine(text);
    }
}

export default TerminalApi