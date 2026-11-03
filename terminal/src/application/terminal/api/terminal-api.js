import { TERMINAL_CONFIG_THEME_KEY, TERMINAL_CONFIG_PROMPT_KEY, TERMINAL_CONFIG_CURSOR_KEY, TERMINAL_CONFIG_SYNTAX_KEY, TERMINAL_CONFIG_DEBUG_KEY } from '../config/config.js'

/**
 * Terminal API class - represents a API for the terminal
 */
export class TerminalApi {
    /**
     * Creates a new TerminalApi instance
     * @param {object} context The context of the terminal
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Gets the terminal info
     * @returns {TerminalInfo} The terminal info
     */
    getInfo() {
        return this._context.info;
    }

    /**
     * Applies the config to the terminal
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    applyConfig() {
        const themeName = this._context.configProvider.get(TERMINAL_CONFIG_THEME_KEY);
        this.setTheme(themeName);
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
        } else if (cursorStyle === 'block') {
            this.setCursorStyleBlock();
        }
        const syntax = this._context.configProvider.get(TERMINAL_CONFIG_SYNTAX_KEY);
        if (syntax === 'posix') {
            this.setShellSyntaxPosix();
        } else if (syntax === 'dos') {
            this.setShellSyntaxDos();
        }
        const debugEnabled = this._context.configProvider.get(TERMINAL_CONFIG_DEBUG_KEY) === 'true';
        if (debugEnabled) {
            this.enableDebug();
        } else {
            this.disableDebug();
        }
        return this;
    }

    /**
     * Sets the theme of the terminal
     * @param {string} themeName The name of the theme to set
     * @returns {TerminalApi} The instance of the TerminalApi
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
     * @returns {object} The current theme
     */
    getTheme() {
        return this._context.themeProvider.getTheme();
    }

    /**
     * Gets the themes of the terminal
     * @returns {object[]} The themes of the terminal
     */
    getThemes() {
        return Object.values(this._context.themeProvider.getThemes());
    }

    /**
     * Sets the previous theme
     * @returns {TerminalApi} The instance of the TerminalApi
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
     * @returns {TerminalApi} The instance of the TerminalApi
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
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setLinuxPrompt() {
        this._context.readline.setLinuxPrompt();
        this._context.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'linux');
        return this;
    }

    /**
     * Sets the prompt formatting similar to windows terminal
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setWindowsPrompt() {
        this._context.readline.setWindowsPrompt();
        this._context.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'windows');
        return this;
    }

    /**
     * Sets the style of the cursor to caret
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setCursorStyleCaret() {
        this._context.cursorRenderer.setCursorStyleCaret();
        this._context.configProvider.set(TERMINAL_CONFIG_CURSOR_KEY, 'caret');
        return this;
    }

    /**
     * Sets the style of the cursor to underline
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setCursorStyleUnderline() {
        this._context.cursorRenderer.setCursorStyleUnderline();
        this._context.configProvider.set(TERMINAL_CONFIG_CURSOR_KEY, 'underline');
        return this;
    }

    /**
     * Sets the style of the cursor to a solid character cell
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setCursorStyleBlock() {
        this._context.cursorRenderer.setCursorStyleBlock();
        this._context.configProvider.set(TERMINAL_CONFIG_CURSOR_KEY, 'block');
        return this;
    }

    /**
     * Sets the shell syntax to POSIX/Unix
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setShellSyntaxPosix() {
        this._context.shell.usePosixSyntax();
        this._context.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'posix');
        return this;
    }

    /**
     * Sets the shell syntax to Windows/DOS
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setShellSyntaxDos() {
        this._context.shell.useDosSyntax();
        this._context.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'dos');
        return this;
    }

    /**
     * Toggles the scrollbar to use the theme colors
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    toggleScrollbarTheme() {
        const isScrollbarThemeEnabled = this._context.dom.isScrollbarThemeEnabled();
        if (isScrollbarThemeEnabled) {
            this._context.dom.disableScrollbarTheme();
        } else {
            this._context.dom.enableScrollbarTheme();
        }
        this._context.dom.applyTheme(this._context.themeProvider.getTheme());
        return this;
    }

    /**
     * Checks if the scrollbar using the theme colors
     * @returns {boolean} True if the scrollbar using the theme colors, false otherwise
     */
    isScrollbarThemeEnabled() {
        return this._context.dom.isScrollbarThemeEnabled();
    }

    /**
     * Toggles the debug
     * @returns {TerminalApi} The instance of the TerminalApi
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
     * @returns {boolean} True if the debug is enabled, false otherwise
     */
    isDebugEnabled() {
        return this._context.terminalDebug.isEnabled();
    }

    /**
     * Enables the debug
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    enableDebug() {
        this._context.terminalDebug.enable();
        return this;
    }

    /**
     * Disables the debug
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    disableDebug() {
        this._context.terminalDebug.disable();
        return this;
    }

    /**
     * Gets the size of the terminal
     * @returns {object} The size of the terminal
     */
    getSize() {
        return this._context.textViewport.getViewport();
    }

    /**
     * Returns the screen cursor in the visual document
     * @returns {object} The cursor position
     */
    getCursorPosition() {
        return this._context.textBuffer.getCursorPosition();
    }

    /**
     * Returns the current clipboard text
     * @returns {Promise<string>} The clipboard text
     */
    readClipboard() {
        return this._context.clipboard.paste();
    }

    /**
     * Shows the alternate text buffer
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    useAlternateBuffer() {
        const bufferChanged = this._context.textBufferProvider.useAlternateBuffer();
        if (!bufferChanged) return this;
        this._context.textBuffer = this._context.textBufferProvider.getTextBuffer();
        this._context.textBuffer.clear();
        this._context.textSelection.reset();
        this._context.textViewport.setOffset(0, 0);
        return this;
    }

    /**
     * Shows the primary text buffer again
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    usePrimaryBuffer() {
        const bufferChanged = this._context.textBufferProvider.usePrimaryBuffer();
        if (!bufferChanged) return this;
        this._context.textBuffer = this._context.textBufferProvider.getTextBuffer();
        this._context.textSelection.reset();
        const cursorPosition = this._context.textBuffer.getCursorPosition();
        this._context.textViewport.ensureRowInViewport(cursorPosition.row, cursorPosition.column);
        return this;
    }

    /**
     * Clears the terminal (scrollback + input) and shows a fresh prompt
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    clear() {
        this._context.readline.clearHistory();
        this._context.readline.discard();
        this._context.textBuffer.clear();
        return this;
    }

    /**
     * Scrolls the screen cursor toward the top of the viewport
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    scrollInputToTop() {
        const cursorPosition = this._context.textBuffer.getCursorPosition();
        this._context.textViewport.scrollRowToTop(cursorPosition.row);
        return this;
    }

    /**
     * Writes the prompt to the screen
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    writePrompt() {
        const readline = this._context.readline;
        readline.resetCompletion();
        readline.setCompletionOptions(this._context.shell.getCwdCompletionList());
        const prompt = this._context.shell.getPrompt();
        readline.setPrompt(prompt.user, prompt.host, prompt.cwd);
        this._context.textBuffer.resetFormat();
        this.write(readline.getPromptText());
        const cursorPosition = this._context.textBuffer.getCursorPosition();
        this._context.textViewport.ensureRowInViewport(cursorPosition.row, cursorPosition.column);
        return this;
    }

    /**
     * Writes text at the screen cursor, including CSI and SGR sequences
     * @param {string} text The text to write
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    write(text = '') {
        this._context.textBuffer.write(text);
        return this;
    }

    /**
     * Writes a line at the screen cursor and advances to the next row
     * @param {string} text The text to write
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    writeLine(text = '') {
        return this.write(`${text}\n`);
    }

    /**
     * Gets the input history
     * @returns {string[]} The input history
     */
    getInputHistory() {
        return this._context.readline.getHistory();
    }

    /**
     * Inputs command into the terminal and executes it
     * @param {string} text The text to input
     */
    async input(text = '') {
        this._context.readline.addHistory(text);
        this._context.readline.clear();
        this.writeLine(text);
        await this._context.shell.input(text);
    }

    /**
     * Attaches the input handler that receives keys and pointer events the terminal did not handle
     * Keeps earlier handlers so they can be restored
     * @param {object} handler The input handler. Uses handleInput
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setInputHandler(handler) {
        this._context.inputHandlerController.setInputHandler(handler);
        return this;
    }

    /**
     * Restores the input handler replaced by the last setInputHandler call
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    restoreInputHandler() {
        this._context.inputHandlerController.restoreInputHandler();
        return this;
    }

    /**
     * Checks if the terminal supports cursor addressing
     * @returns {boolean} True if the terminal supports cursor addressing, false otherwise
     */
    isCursorAddressingSupported() {
        return true;
    }

    /**
     * Releases the terminal. Later writes are ignored.
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    dispose() {
        this._context.dispose();
        return this;
    }
}

export default TerminalApi