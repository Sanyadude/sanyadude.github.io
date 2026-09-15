import { TerminalInfo } from './components/terminal-info.js'
import { TextFormat } from './components/text-format.js'
import { CharacterMeasurement } from './components/character-measurement.js'
import { InputHistoryNavigation } from './components/input-history-navigation.js'
import { InputCompletion } from './components/input-completion.js'
import { ThemeProvider } from './components/theme-provider.js'
import { InputPrompt } from './components/input-prompt.js'
import { CLI_APPS } from './config/cli-apps.js'
import { 
    TERMINAL_DEFAULT_FONT_SIZE, TERMINAL_DEFAULT_PADDING,
    TERMINAL_CONFIG_THEME_KEY, TERMINAL_CONFIG_SYNTAX_KEY, TERMINAL_CONFIG_PROMPT_KEY,
    TERMINAL_WELCOME_MESSAGE_LINES
} from './config/config.js'

/**
 * Terminal class - represents a interface for the shell
 */
export class Terminal {
    /**
     * Creates a new Terminal instance
     * @param {HTMLElement} container - The container element for the terminal
     * @param {ServiceProvider} serviceProvider - The service provider instance
     */
    constructor(container, serviceProvider) {
        this.container = container;
        this.serviceProvider = serviceProvider;

        // Services
        this.shell = this.serviceProvider.get('shell');
        this.fileSystemExplorer = this.serviceProvider.get('fileSystemExplorer');
        this.fileSystemManager = this.serviceProvider.get('fileSystemManager');
        this.configProvider = this.serviceProvider.get('configProvider');

        this.info = new TerminalInfo();

        this.fontSize = TERMINAL_DEFAULT_FONT_SIZE;
        this.padding = TERMINAL_DEFAULT_PADDING;

        this.charSize = { width: 0, height: 0 };

        this._init();
    }

    /**
     * Returns the terminal info
     * @returns {TerminalInfo} - The terminal info
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
        this.info.version = '0.1.0';
        this._createContainer();
        this._createHistoryContainer();
        this.charSize = CharacterMeasurement.measure(this.historyContainerElement);
        this._createInput();
        this.themeProvider = new ThemeProvider();
        this.inputHistoryNavigation = new InputHistoryNavigation();
        this.inputCompletion = new InputCompletion();
        this.inputPrompt = new InputPrompt();

        this._initListeners();

        this._render();

        this.setTheme();
        this.applyConfig();
        this.reset();
        // Add initial lines
        TERMINAL_WELCOME_MESSAGE_LINES.forEach(line => this.output(line));
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
        this.containerElement.style.boxSizing = 'border-box';
        this.containerElement.style.padding = `${this.padding}px`;
        this.container.appendChild(this.containerElement);
        // Create style element
        this.containerStyleElement = document.createElement('style');
        this.containerStyleElement.textContent = TextFormat.getStyles();
        document.head.appendChild(this.containerStyleElement);
    }

    /**
     * Creates the history container for the terminal
     */
    _createHistoryContainer() {
        this.historyContainerElement = document.createElement('div');
        this.historyContainerElement.style.whiteSpace = 'pre-wrap';
        this.historyContainerElement.style.wordBreak = 'break-all';
        this.containerElement.appendChild(this.historyContainerElement);
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
        this.containerElement.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        this.containerElement.addEventListener('drop', (event) => {
            this._handleDrop(event);
        });
        this.inputElement.addEventListener('input', (event) => {
            this._handleInput(event);
        });
        this.themeProvider.onThemeChange((event) => {
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
     * @param {MouseEvent} event - The click event
     */
    _handleClick(event) {
        this.inputElement.focus();
    }

    /**
     * Handles the drop event for the terminal
     * @param {DragEvent} event - The drop event
     */
    _handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = new Uint8Array(event.target.result);
                this.fileSystemManager.createFile(this.fileSystemExplorer.getCurrentPath() + '/' + file.name, content);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    /**
     * Handles the input event for the input element
     * @param {InputEvent} event - The input event
     */
    _handleInput(event) {
        return;
    }

    /**
     * Handles the enter key event
     * @param {KeyboardEvent} event - The enter key event
     */
    _handleEnterKey(event) {
        event.preventDefault();
        this.input(this.inputElement.textContent);
        this.inputElement.textContent = '';
    }

    /**
     * Handles the tab key event
     * @param {KeyboardEvent} event - The tab key event
     */
    _handleTabKey(event) {
        event.preventDefault();
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
     * @param {KeyboardEvent} event - The arrow up key event
     */
    _handleArrowUpKey(event) {
        event.preventDefault();
        const newText = this.inputHistoryNavigation.navigateBackward(this.inputElement.textContent);
        this.inputElement.textContent = newText;
        this._moveCaretToEnd();
    }

    /**
     * Handles the arrow down key event
     * @param {KeyboardEvent} event - The arrow down key event
     */
    _handleArrowDownKey(event) {
        event.preventDefault();
        const newText = this.inputHistoryNavigation.navigateForward(this.inputElement.textContent);
        this.inputElement.textContent = newText;
        this._moveCaretToEnd();
    }

    /**
     * Handles the ctrl + c key event
     * @param {KeyboardEvent} event - The ctrl + c key event
     */
    _handleCtrlCKey(event) {
        event.preventDefault();
        if (this.shell.isProcessing()) {
            this.shell.abortCurrentJob();
        }
        this.output(`${this.promptElement.textContent}${this.inputElement.textContent}^C`);
        this.inputElement.textContent = '';
        this.inputHistoryNavigation.reset();
        this.inputCompletion.reset();
    }

    /**
     * Handles the key down event for the input element
     * @param {KeyboardEvent} event - The key down event
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
     * @param {MouseEvent} event - The mouse up event
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
     * @param {object} theme - The theme to change to
     */
    _handleThemeChange(theme) {
        this.containerElement.style.backgroundColor = theme.background;
        this.containerElement.style.color = theme.foreground;
    }

    /**
     * Renders the prompt
     */
    _renderPrompt() {
        const prompt = this.shell.getPrompt();
        const promptText = this.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        this.promptElement.innerHTML = this._formatOutput(promptText);
    }

    /**
     * Renders the history
     * @param {object[]} entries - The history entries to render
     */
    _render(entries = []) {
        entries.forEach(entry => {
            const lines = entry.content.split('\n');
            //Add path to first input line
            if (lines.length !== 0 && entry.type === 'input') {
                const prompt = this.shell.getPrompt();
                const promptText = this.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
                lines[0] = `${promptText}${lines[0]}`;
            }
            lines.forEach(line => {
                const lineElement = document.createElement('div');
                //Set height to charSize.height for empty lines
                if (line.trim() === '') {
                    lineElement.style.height = `${this.charSize.height}px`;
                }
                lineElement.innerHTML = this._formatOutput(line);
                this.historyContainerElement.appendChild(lineElement);
            });
        });
        this._renderPrompt();
        this.containerElement.scrollTop = this.containerElement.scrollHeight;
    }

    /**
     * Writes the prompt to the terminal
     * @param {string} user - The user of the prompt
     * @param {string} host - The host of the prompt
     * @param {string} cwd - The current working directory of the prompt
     * @param {string} text - The text to write
     */
    writePrompt(user, host, cwd, text = '') {
        const inputEntry = {
            type: 'input',
            content: text
        };
        this._render([inputEntry]);
    }

    /**
     * Writes a line to the terminal
     * @param {string} text - The text to write
     */
    writeLine(text = '') {
        this.output(text);
    }

    /**
     * Writes a line to the terminal
     * @param {string} text - The text to write
     */
    writeOutputLine(text = '') {
        this.output(text);
    }

    /**
     * Removes an output line from the terminal
     * @param {number} index - The index of the output line to remove
     */
    removeOutputLine(index = null) {
        const removeIndex = index || this.historyContainerElement.children.length - 1;
        if (removeIndex < 0) return;
        this.historyContainerElement.removeChild(this.historyContainerElement.children[removeIndex]);
    }

    /**
     * Inputs text into the terminal
     * @param {string} text - The text to input
     */
    input(text = '') {
        this.inputHistoryNavigation.addInput(text);
        this.shell.input(text);
        this.inputCompletion.reset();
        this.inputCompletion.setOptions(this.shell.getCwdCompletionList());
    }

    /**
     * Formats the output text
     * @param {string} text - The text to format
     * @returns {string} - The formatted text
     */
    _formatOutput(text = '') {
        if (!TextFormat.isAnsiFormatted(text)) {
            const spanElement = document.createElement('span');
            spanElement.textContent = text;
            return spanElement.outerHTML;
        }
        let html = '';
        const textSegments = TextFormat.segmentsFromString(text);
        for (const segment of textSegments) {
            const sgrState = TextFormat.parseSgr(segment.format);
            const style = TextFormat.resolveSgrToStyle(sgrState, this.themeProvider.getTheme());
            const spanElement = document.createElement('span');
            Object.assign(spanElement.style, style);
            spanElement.textContent = segment.text;
            html += spanElement.outerHTML;
        }
        return html;
    }

    /**
     * Outputs text into the terminal
     * @param {string} text - The text to output
     */
    output(text = '') {
        const outputEntry = {
            type: 'output',
            content: text
        };
        this._render([outputEntry]);
    }

    /**
     * Resets the terminal
     */
    reset() {
        this.historyContainerElement.innerHTML = '';
        this.inputHistoryNavigation.clear();
        this.inputCompletion.reset();
    }

    /**
     * Returns the terminal API
     * @returns {Terminal} - The terminal instance
     */
    api() {
        return this;
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
     * @returns {object} - The size of the terminal
     */
    getSize() {
        return {
            columns: Math.floor((this.containerElement.clientWidth - 2*this.padding)/this.charSize.width),
            lines: Math.floor((this.containerElement.clientHeight - 2*this.padding)/this.charSize.height)
        };
    }

    /**
     * Sets the theme of the terminal
     * @param {string} theme - The theme to set
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
     * @returns {object} - The current theme
     */
    getTheme() {
        return this.themeProvider.getTheme();
    }

    /**
     * Gets the themes of the terminal
     * @returns {object[]} - The themes of the terminal
     */
    getThemes() {
        return Object.values(this.themeProvider.getThemes());
    }

    /**
     * Sets the previous theme
     * @returns {Terminal} - The instance of the Terminal
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
     * @returns {Terminal} - The instance of the Terminal
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
        this.reset();
    }

    /**
     * Returns the history of the terminal lines
     * @returns {string[]} - An array of the history entries
     */
    getInputHistory() {
        return this.inputHistoryNavigation.getHistory();
    }

    /**
     * Sets the shell syntax to Windows/DOS
     */
    setShellSyntaxDos() {
        this.shell.useDosSyntax();
        this.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'dos');
    }

    /**
     * Sets the shell syntax to POSIX/Unix
     */
    setShellSyntaxPosix() {
        this.shell.usePosixSyntax();
        this.configProvider.set(TERMINAL_CONFIG_SYNTAX_KEY, 'posix');
    }

    /**
     * Sets the prompt formatting similar to linux terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setLinuxPrompt() {
        this.inputPrompt.setPromptTypeLinux();
        this.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'linux');
        return this._renderPrompt();
    }

    /**
     * Sets the prompt formatting similar to windows terminal
     * @returns {TerminalApi} - The instance of the TerminalApi
     */
    setWindowsPrompt() {
        this.inputPrompt.setPromptTypeWindows();
        this.configProvider.set(TERMINAL_CONFIG_PROMPT_KEY, 'windows');
        return this._renderPrompt();
    }

    toggleDebug() {
        //Do nothing
    }

    isDebugEnabled() {
        return false;
    }

    isScrollbarUseThemeEnabled() {
        return false;
    }

    toggleScrollbarUseTheme() {
        //Do nothing
    }

    scrollInputToTop() {
        //Do nothing
    }

    hidePrompt() {
        //Do nothing
    }

    showPrompt() {
        //Do nothing
    }
}

export default Terminal