import { TerminalInfo } from './terminal-info.js'
import { TextFormat } from './ansi/text-format.js'
import { BufferCell } from './buffer/buffer-cell.js'
import { AnsiParser } from './ansi/ansi-parser.js'
import { CharacterMeasurement } from './layout/character-measurement.js'
import { ThemeProvider } from './theme/theme-provider.js'
import { CLI_APPS } from './config/cli-apps.js'
import { 
    TERMINAL_DEFAULT_FONT_SIZE, TERMINAL_DEFAULT_PADDING,
    TERMINAL_CONFIG_THEME_KEY, TERMINAL_CONFIG_SYNTAX_KEY, TERMINAL_CONFIG_PROMPT_KEY
} from './config/config.js'

/**
 * Terminal class - represents an interface for the shell
 */
export class Terminal {
    /**
     * Creates a new Terminal instance
     * @param {HTMLElement} container The container element for the terminal
     * @param {ServiceProvider} serviceProvider The service provider instance
     */
    constructor(container, serviceProvider) {
        this.container = container;
        this.serviceProvider = serviceProvider;

        // Services
        this.shell = this.serviceProvider.get('shell');
        this.configProvider = this.serviceProvider.get('configProvider');

        this.info = new TerminalInfo();

        this.fontSize = TERMINAL_DEFAULT_FONT_SIZE;
        this.padding = TERMINAL_DEFAULT_PADDING;

        this.charSize = { width: 0, height: 0 };

        this._init();
    }

    /**
     * Returns the terminal info
     * @returns {TerminalInfo} The terminal info
     */
    getInfo() {
        return this.info;
    }

    /**
     * Gets the CLI programs
     * @returns {Application[]} The CLI programs
     */
    getCliApplications() {
        return Object.values(CLI_APPS);
    }

    /**
     * Initializes the Terminal interface
     */
    _init() {
        this.info.version = '0.1.0m';
        this._createContainer();
        this._createScrollbackContainer();
        this.charSize = CharacterMeasurement.pixelSize(this.scrollbackContainerElement);
        this._createInput();
        this.themeProvider = new ThemeProvider();
        this.inputHistoryNavigation = this.shell.getReadline()._history;
        this.inputCompletion = this.shell.getReadline()._completion;
        this.inputPrompt = this.shell.getReadline()._prompt;
        this.api = this;

        this._initListeners();

        this._renderPrompt();
        this._scrollToBottom();

        this.setTheme();
        this.applyConfig();
    }

    /**
     * Creates the container for the terminal
     */
    _createContainer() {
        this.containerElement = document.createElement('div');
        this.containerElement.style.display = 'flex';
        this.containerElement.style.flexDirection = 'column';
        this.containerElement.style.fontFamily = 'Consolas, monospace';
        this.containerElement.style.fontSize = `${this.fontSize}px`;
        this.containerElement.style.width = '100%';
        this.containerElement.style.height = '100%';
        this.containerElement.style.overflow = 'auto';
        this.containerElement.style.scrollbarGutter = 'stable';
        this.containerElement.style.boxSizing = 'border-box';
        this.containerElement.style.padding = `${this.padding}px`;
        this.container.appendChild(this.containerElement);
        // Create style element
        this.containerStyleElement = document.createElement('style');
        this.containerStyleElement.textContent = TextFormat.getStyles();
        document.head.appendChild(this.containerStyleElement);
    }

    /**
     * Creates the scrollback container for the terminal
     */
    _createScrollbackContainer() {
        this.scrollbackContainerElement = document.createElement('div');
        this.scrollbackContainerElement.style.whiteSpace = 'pre-wrap';
        this.scrollbackContainerElement.style.wordBreak = 'break-all';
        this.containerElement.appendChild(this.scrollbackContainerElement);
    }

    /**
     * Creates the input for the terminal
     */
    _createInput() {
        // Create input container
        this.inputContainerElement = document.createElement('div');
        this.inputContainerElement.style.display = 'inline-block';
        this.inputContainerElement.style.position = 'relative';
        this.inputContainerElement.style.marginBottom = `${this.charSize.height * 10}px`;
        this.containerElement.appendChild(this.inputContainerElement);
        // Create prompt
        this.promptElement = document.createElement('span');
        this.promptElement.style.userSelect = 'none';
        this.promptElement.style.whiteSpace = 'pre-wrap';
        this.promptElement.style.wordBreak = 'break-all';
        this.inputContainerElement.appendChild(this.promptElement);
        // Create input
        this.inputElement = document.createElement('span');
        this.inputElement.style.outline = 'none';
        this.inputElement.style.border = 'none';
        this.inputElement.style.wordBreak = 'break-all';
        this.inputElement.setAttribute('contenteditable', 'true');
        this.inputElement.setAttribute('spellcheck', 'false');
        this.inputElement.setAttribute('placeholder', 'Enter command');
        this.inputElement.setAttribute('autocomplete', 'off');
        this.inputContainerElement.appendChild(this.inputElement);
    }

    /**
     * Initializes the listeners for the terminal
     */
    _initListeners() {
        this.inputContainerElement.addEventListener('click', (event) => {
            this._handleClick(event);
        });
        this.inputElement.addEventListener('keydown', (event) => {
            this._handleInputKeyDown(event);
        });
        this.inputContainerElement.addEventListener('contextmenu', (event) => {
            this._handleContextMenu(event);
        });
        this.inputElement.addEventListener('input', (event) => {
            this._handleInput(event);
        });
        this._removeThemeListener = this.themeProvider.onThemeChange((event) => {
            this._handleThemeChange(event.theme);
        });
    }

    /**
     * Moves the caret to the end of the input element
     */
    _moveCaretToEnd() {
        const range = document.createRange();
        const selection = window.getSelection();
        const lastChild = this.inputElement.lastChild || this.inputElement;
        range.selectNodeContents(lastChild);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Handles the click event for the terminal
     * @param {MouseEvent} event The click event
     */
    _handleClick(event) {
        this.inputElement.focus();
    }

    /**
     * Handles the input event for the input element
     * @param {InputEvent} event The input event
     */
    _handleInput(event) {
        return;
    }

    /**
     * Handles the enter key event
     * @param {KeyboardEvent} event The enter key event
     */
    _handleEnterKey(event) {
        event.preventDefault();
        const text = this.inputElement.textContent;
        if (this.shell.isReading()) {
            this._appendScrollbackLine(`${this.promptElement.textContent}${text}`);
            this._scrollToBottom();
            this.inputHistoryNavigation.reset();
            this.inputCompletion.reset();
            this.shell.completeRead(text);
            this.inputElement.textContent = '';
            return;
        }
        this.input(text);
        this.inputElement.textContent = '';
    }

    /**
     * Handles the tab key event
     * @param {KeyboardEvent} event The tab key event
     */
    _handleTabKey(event) {
        event.preventDefault();
        if (this.shell.isReading()) return;
        const text = this.inputElement.textContent.replace(/\u00A0/g, " ");
        const selection = window.getSelection();
        const caretPos = selection.anchorOffset;
        const beforeCaret = text.slice(0, caretPos);
        const afterCaret = text.slice(caretPos);
        if (afterCaret.trim() !== '') return;
        this.inputCompletion.setOptions(this.shell.getCwdCompletionList());
        const reverse = event.shiftKey;
        const completion = this.inputCompletion.complete(text, caretPos, reverse);
        this.inputElement.textContent = completion.text;
        const range = document.createRange();
        range.setStart(this.inputElement.firstChild || this.inputElement, completion.index);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Handles the arrow up key event
     * @param {KeyboardEvent} event The arrow up key event
     */
    _handleArrowUpKey(event) {
        if (this.shell.isReading()) return;
        event.preventDefault();
        const newText = this.inputHistoryNavigation.navigateBackward(this.inputElement.textContent);
        this.inputElement.textContent = newText;
        this._moveCaretToEnd();
    }

    /**
     * Handles the arrow down key event
     * @param {KeyboardEvent} event The arrow down key event
     */
    _handleArrowDownKey(event) {
        if (this.shell.isReading()) return;
        event.preventDefault();
        const newText = this.inputHistoryNavigation.navigateForward(this.inputElement.textContent);
        this.inputElement.textContent = newText;
        this._moveCaretToEnd();
    }

    /**
     * Handles the ctrl + c key event
     * @param {KeyboardEvent} event The ctrl + c key event
     */
    _handleCtrlCKey(event) {
        event.preventDefault();
        const reading = this.shell.isReading();
        if (reading) {
            this._appendScrollbackLine(`${this.promptElement.textContent}${this.inputElement.textContent}^C`);
            this._scrollToBottom();
            this.shell.cancelRead();
        }
        if (this.shell.isProcessing()) {
            this.shell.abortCurrentJob();
            if (!reading) {
                this.writeLine(`${this.inputElement.textContent}^C`);
            }
        } else if (reading) {
            this.writePrompt();
        } else {
            this.writeLine(`${this.promptElement.textContent}${this.inputElement.textContent}^C`);
        }
        this.inputElement.textContent = '';
        this.inputHistoryNavigation.reset();
        this.inputCompletion.reset();
    }

    /**
     * Handles the key down event for the input element
     * @param {KeyboardEvent} event The key down event
     */
    _handleInputKeyDown(event) {
        if (event.key === 'Enter') {
            this._handleEnterKey(event);
            return;
        }
        if (event.key === 'Tab') {
            this._handleTabKey(event);
            return;
        }
        if (event.key === 'ArrowUp') {
            this._handleArrowUpKey(event);
        }
        if (event.key === 'ArrowDown') {
            this._handleArrowDownKey(event);
        }
        if (event.key === 'c' && event.ctrlKey) {
            this._handleCtrlCKey(event);
            return;
        }
        if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
            this.inputCompletion.reset();
        }
    }

    /**
     * Handles the context menu event for the input element
     * @param {MouseEvent} event The mouse up event
     */
    async _handleContextMenu(event) {
        try {
            event.preventDefault();
            const text = await navigator.clipboard.readText();
            this.inputElement.textContent = this.inputElement.textContent + text;
            this._moveCaretToEnd();
        } catch (error) {
            return;
        }
    }

    /**
     * Handles the theme change event
     * @param {object} theme The theme to change to
     */
    _handleThemeChange(theme) {
        this.containerElement.style.backgroundColor = theme.background;
        this.containerElement.style.color = theme.foreground;
    }

    /**
     * Renders the prompt
     * @param {string} text The prompt text
     */
    _renderPrompt(text = '') {
        if (text) {
            this.promptElement.innerHTML = this._formatOutput(text);
            return;
        }
        const prompt = this.shell.getPrompt();
        const promptText = this.inputPrompt.formatPrompt(prompt.user, prompt.host, prompt.cwd);
        this.promptElement.innerHTML = this._formatOutput(promptText);
    }

    /**
     * Renders the scrollback
     * @param {object[]} entries The scrollback lines to render
     */
    _render(entries = []) {
        entries.forEach(entry => {
            const lines = entry.split('\n');
            lines.forEach(line => this._appendScrollbackLine(line));
        });
    }

    /**
     * Scrolls the terminal to the bottom
     */
    _scrollToBottom() {
        this.containerElement.scrollTop = this.containerElement.scrollHeight;
    }

    /**
     * Writes the prompt to the terminal
     */
    writePrompt() {
        this._renderPrompt();
        return this;
    }

    /**
     * Writes text into the scrollback
     * A trailing newline ends the line and does not add an extra blank row
     * @param {string} text The text to write
     * @returns {Terminal} The instance of the Terminal
     */
    write(text = '') {
        const content = String(text);
        if (content === '') return this;
        if (this.shell.getReadline()._reading) {
            this._renderPrompt(text);
            this.inputElement.textContent = '';
            this._scrollToBottom();
            return this;
        }
        const lines = content.split('\n');
        if (content.endsWith('\n')) lines.pop();
        if (lines.length === 0) return this;
        this._render([lines.join('\n')]);
        this._renderPrompt();
        this._scrollToBottom();
        return this;
    }

    /**
     * Appends one finished line to the scrollback without changing the input prompt
     * @param {string} text The line to append
     * @returns {Terminal} The instance of the Terminal
     */
    _appendScrollbackLine(text = '') {
        const lineElement = document.createElement('div');
        if (String(text).trim() === '') {
            lineElement.style.height = `${this.charSize.height}px`;
        }
        lineElement.innerHTML = this._formatOutput(text);
        this.scrollbackContainerElement.appendChild(lineElement);
        return this;
    }

    /**
     * Writes a line into the scrollback
     * @param {string} text The text to write
     * @returns {Terminal} The instance of the Terminal
     */
    writeLine(text = '') {
        return this.write(`${text}\n`);
    }

    /**
     * Inputs text into the terminal
     * @param {string} text The text to input
     */
    input(text = '') {
        const prompt = this.shell.getPrompt();
        const promptText = this.inputPrompt.formatPrompt(prompt.user, prompt.host, prompt.cwd);
        this.writeLine(`${promptText}${text}`);
        this.inputHistoryNavigation.push(text);
        this.shell.input(text);
        this.inputCompletion.reset();
        this.inputCompletion.setOptions(this.shell.getCwdCompletionList());
    }

    /**
     * Parses ANSI-formatted text into one buffer cell per character.
     * SGR sequences update the format of later cells. Cursor and grid commands are ignored.
     * @param {string} text The text to parse
     * @returns {BufferCell[]} The parsed cells
     */
    _cellsFromText(text = '') {
        const cells = [];
        let format = null;
        new AnsiParser().push(text, {
            onSgr: (params) => {
                format = TextFormat.mergeSgrFormat(format, params);
            },
            onChar: (char) => {
                cells.push(new BufferCell(char, format, 1));
            }
        });
        return cells;
    }

    /**
     * Formats the output text
     * @param {string} text The text to format
     * @returns {string} The formatted text
     */
    _formatOutput(text = '') {
        const cells = this._cellsFromText(text);
        let html = '';
        let currentFormat = null;
        let currentText = '';
        const flush = () => {
            if (!currentText) return;
            const spanElement = document.createElement('span');
            if (currentFormat) {
                const sgrState = TextFormat.parseSgr(currentFormat);
                const style = TextFormat.resolveSgrToStyle(sgrState, this.themeProvider.getTheme());
                Object.assign(spanElement.style, style);
            }
            spanElement.textContent = currentText;
            html += spanElement.outerHTML;
            currentText = '';
        };
        for (const cell of cells) {
            if (currentText && cell.format !== currentFormat) flush();
            currentText += cell.text;
            currentFormat = cell.format;
        }
        flush();
        if (!html) {
            const spanElement = document.createElement('span');
            return spanElement.outerHTML;
        }
        return html;
    }

    /**
     * Applies the config to the terminal
     */
    applyConfig() {
        const themeName = this.configProvider.get(TERMINAL_CONFIG_THEME_KEY);
        if (themeName) {
            this.setTheme(themeName);
        }
        const promptType = this.configProvider.get(TERMINAL_CONFIG_PROMPT_KEY);
        if (promptType === 'linux') {
            this.setLinuxPrompt();
        } else if (promptType === 'windows') {
            this.setWindowsPrompt();
        }
        const syntax = this.configProvider.get(TERMINAL_CONFIG_SYNTAX_KEY);
        if (syntax === 'posix') {
            this.setShellSyntaxPosix();
        } else if (syntax === 'dos') {
            this.setShellSyntaxDos();
        }
    }

    /**
     * Gets the size of the terminal
     * @returns {object} The size of the terminal
     */
    getSize() {
        return {
            columns: Math.floor((this.containerElement.clientWidth - 2*this.padding)/this.charSize.width),
            rows: Math.floor((this.containerElement.clientHeight - 2*this.padding)/this.charSize.height)
        };
    }

    /**
     * Sets the theme of the terminal
     * @param {string} theme The theme to set
     */
    setTheme(themeName) {
        this.themeProvider.setTheme(themeName);
        if (themeName) {
            this.configProvider.set(TERMINAL_CONFIG_THEME_KEY, themeName);
        }
        return this;
    }

    /**
     * Returns the current theme of the terminal
     * @returns {object} The current theme
     */
    getTheme() {
        return this.themeProvider.getTheme();
    }

    /**
     * Gets the themes of the terminal
     * @returns {object[]} The themes of the terminal
     */
    getThemes() {
        return Object.values(this.themeProvider.getThemes());
    }

    /**
     * Sets the previous theme
     * @returns {Terminal} The instance of the Terminal
     */
    setPreviousTheme() {
        this.themeProvider.setPreviousTheme();
        const themeName = this.themeProvider.getTheme().name;
        if (themeName) {
            this.configProvider.set(TERMINAL_CONFIG_THEME_KEY, themeName);
        }
        return this;
    }

    /**
     * Sets the next theme
     * @returns {Terminal} The instance of the Terminal
     */
    setNextTheme() {
        this.themeProvider.setNextTheme();
        const themeName = this.themeProvider.getTheme().name;
        if (themeName) {
            this.configProvider.set(TERMINAL_CONFIG_THEME_KEY, themeName);
        }
        return this;
    }

    /**
     * Clears the terminal
     */
    clear() {
        this.inputElement.textContent = '';
        this.scrollbackContainerElement.innerHTML = '';
        this.inputHistoryNavigation.clear();
        this.inputCompletion.reset();
    }

    /**
     * Returns the history of the terminal lines
     * @returns {string[]} An array of the history entries
     */
    getInputHistory() {
        return this.inputHistoryNavigation.getHistory();
    }

    /**
     * Sets the shell syntax to Windows/DOS
     * @returns {Terminal} The instance of the Terminal
     */
    setShellSyntaxDos() {
        this.shell.useDosSyntax();
        this.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'dos');
        return this;
    }

    /**
     * Sets the shell syntax to POSIX/Unix
     * @returns {Terminal} The instance of the Terminal
     */
    setShellSyntaxPosix() {
        this.shell.usePosixSyntax();
        this.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'posix');
        return this;
    }

    /**
     * Sets the prompt formatting similar to linux terminal
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setLinuxPrompt() {
        this.inputPrompt.setPromptTypeLinux();
        this.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'linux');
        return this._renderPrompt();
    }

    /**
     * Sets the prompt formatting similar to windows terminal
     * @returns {TerminalApi} The instance of the TerminalApi
     */
    setWindowsPrompt() {
        this.inputPrompt.setPromptTypeWindows();
        this.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'windows');
        return this._renderPrompt();
    }

    setCursorStyleCaret() {
        //Do nothing
    }

    setCursorStyleUnderline() {
        //Do nothing
    }

    setCursorStyleBlock() {
        //Do nothing
    }

    toggleDebug() {
        //Do nothing
    }

    isDebugEnabled() {
        return false;
    }

    isScrollbarThemeEnabled() {
        return false;
    }

    toggleScrollbarTheme() {
        //Do nothing
    }

    scrollInputToTop() {
        //Do nothing
    }

    /**
     * Checks if the terminal supports cursor addressing
     * @returns {boolean} True if the terminal supports cursor addressing, false otherwise
     */
    isCursorAddressingSupported() {
        return false;
    }

    /**
     * Releases listeners and DOM owned by the terminal
     * @returns {Terminal} The instance of the Terminal
     */
    dispose() {
        if (this._removeThemeListener) {
            this._removeThemeListener();
            this._removeThemeListener = null;
        }
        if (this.themeProvider) {
            this.themeProvider.dispose();
        }
        if (this.containerStyleElement) {
            this.containerStyleElement.remove();
            this.containerStyleElement = null;
        }
        if (this.containerElement) {
            this.containerElement.remove();
            this.containerElement = null;
        }
        this.scrollbackContainerElement = null;
        this.inputContainerElement = null;
        this.promptElement = null;
        this.inputElement = null;
        return this;
    }
}

export default Terminal