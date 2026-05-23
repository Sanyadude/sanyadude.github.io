import { TextFormat } from './components/text-format.js'
import { THEMES } from './config/themes.js'
import { TerminalClear } from './cli-applications/terminal-clear/terminal-clear.js'
import { TerminalHistory } from './cli-applications/terminal-history/terminal-history.js'
import { TerminalSettings } from './cli-applications/terminal-settings/terminal-settings.js'

export const DEFAULT_THEME_NAME = 'pastel-dark';

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

        this.history = [];
        this.historyIndex = null;

        this.fileSuggestionIndex = -1;

        this.info = {
            name: 'terminal',
            type: 'myterm',
            version: '0.1.0',
        };
        this.theme = { name: 'none' };

        this.fontSize = 16;
        this.padding = 10;

        this.charSize = { width: 0, height: 0 };
        this.caretPosition = { x: 0, y: 0 };

        this._init();
    }

    /**
     * Returns the terminal info
     * @returns {object} - The terminal info
     */
    getTerminalInfo() {
        return this.info;
    }

    /**
     * Gets the CLI programs
     * @returns {Application[]} The CLI programs
     */
    getCliApplications() {
        return [new TerminalClear(), new TerminalHistory(), new TerminalSettings()];
    }

    /**
     * Initializes the Terminal interface
     */
    _init() {
        this._createContainer();
        this._createHistoryContainer();
        this.charSize = this._getCharSize(this.historyContainerElement);
        this._createInput();

        this._initListeners();

        this._render();

        this.setTheme(DEFAULT_THEME_NAME);
        this.reset();
        // Add initial lines
        this.output(`Command Line Interface v${this.info.version}`);
        this.output('');
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
        this.promptElement.style.display = 'inline-block';
        this.promptElement.style.userSelect = 'none';
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
     * Returns the size of the character
     * @param {HTMLElement} container - The container of the characters
     * @returns {object} - The size of the character
     */
    _getCharSize(container) {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.textContent = 'A';
        container.appendChild(span);
        const charWidth = span.getBoundingClientRect().width;
        const charHeight = span.getBoundingClientRect().height;
        container.removeChild(span);
        return { width: charWidth, height: charHeight };
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
        this.historyIndex = null;
    }

    /**
     * Handles the tab key event
     * @param {KeyboardEvent} event - The tab key event
     */
    _handleTabKey(event) {
        event.preventDefault();
        //if name have spaces change to "name"
        const names = this.fileSystemExplorer.getEntries().map(entry => {
            const name = entry.getName();
            return name.includes(' ') ? `"${name}"` : name;
        });
        if (names.length === 0) return;
        // Get current input text and caret position
        const text = this.inputElement.textContent.replace(/\u00A0/g, " ");
        const selection = window.getSelection();
        const caretPos = selection.anchorOffset;
        const beforeCaret = text.slice(0, caretPos);
        const afterCaret = text.slice(caretPos);
        if (afterCaret.trim() !== '') return;
        const lastWordPartIndex = beforeCaret.lastIndexOf(' ');
        const lastWordPart = beforeCaret.slice(lastWordPartIndex + 1);
        const fullWord = names.find(name => name.startsWith(lastWordPart)) || '';
        if (fullWord !== '' && fullWord !== lastWordPart) {
            const newText = beforeCaret.slice(0, lastWordPartIndex + 1) + fullWord + afterCaret;
            this.inputElement.textContent = newText;
            const range = document.createRange();
            range.setStart(this.inputElement.firstChild || this.inputElement, newText.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            this.fileSuggestionIndex = names.indexOf(fullWord);
            return;
        }
        // Find the current word before the caret
        const currentWord = names.find(name => beforeCaret.endsWith(name)) || '';
        const wordStart = caretPos - currentWord.length;
        // Cycle through file suggestions
        this.fileSuggestionIndex = this.fileSuggestionIndex + 1 < names.length ? this.fileSuggestionIndex + 1 : 0;
        const suggestion = names[this.fileSuggestionIndex];
        // Replace current word with the suggestion
        const newText = beforeCaret.slice(0, wordStart) + suggestion + afterCaret;
        this.inputElement.textContent = newText;
        // Move caret to end of inserted suggestion
        const range = document.createRange();
        range.setStart(this.inputElement.firstChild || this.inputElement, wordStart + suggestion.length);
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
        const inputs = this.getHistoryByType('input').map(entry => entry.content);
        if (inputs.length === 0) return;
        const distinctInputs = Array.from(new Set(inputs.reverse())).reverse();
        this.historyIndex = this.historyIndex === null
            ? distinctInputs.length - 1
            : Math.max(0, this.historyIndex - 1);
        this.inputElement.textContent = distinctInputs[this.historyIndex];
        this._moveCaretToEnd();
    }

    /**
     * Handles the arrow down key event
     * @param {KeyboardEvent} event - The arrow down key event
     */
    _handleArrowDownKey(event) {
        if (this.historyIndex === null) return;
        event.preventDefault();
        const inputs = this.getHistoryByType('input').map(entry => entry.content);
        const distinctInputs = Array.from(new Set(inputs.reverse())).reverse();
        if (this.historyIndex === distinctInputs.length - 1) {
            this.historyIndex = null;
            this.inputElement.textContent = '';
        } else {
            this.historyIndex = Math.min(distinctInputs.length - 1, this.historyIndex + 1);
            this.inputElement.textContent = distinctInputs[this.historyIndex];
        }
        this._moveCaretToEnd();
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
        this.fileSuggestionIndex = -1;
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
     * Renders the prompt
     * @param {string} path - The path to render the prompt for
     */
    _renderPrompt(path) {
        const currentPath = path || '/';
        this.promptElement.textContent = `${currentPath}>`;
    }

    /**
     * Renders the history
     * @param {object[]} historyEntries - The history entries to render
     */
    _render(historyEntries = []) {
        historyEntries.forEach(entry => {
            const lines = entry.content.split('\n');
            //Add path to first input line
            if (lines.length !== 0 && entry.type === 'input') {
                lines[0] = `${entry.path || '/'}>${lines[0]}`;
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
        this._renderPrompt(this.fileSystemExplorer.getCurrentPath());
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
        const inputHistoryEntry = {
            type: 'input',
            path: cwd,
            content: text,
            timestamp: Date.now(),
        };
        this.history.push(inputHistoryEntry);
        this._render([inputHistoryEntry]);
    }

    /**
     * Writes a line to the terminal
     * @param {string} text - The text to write
     */
    writeLine(text = '') {
        this.output(text);
    }

    /**
     * Inputs text into the terminal
     * @param {string} text - The text to input
     */
    input(text = '') {
        this.shell.input(text)
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
            const style = TextFormat.resolveSgrToStyle(sgrState, this.theme);
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
        const outputHistoryEntry = {
            type: 'output',
            path: this.fileSystemExplorer.getCurrentPath(),
            content: text,
            timestamp: Date.now()
        };
        this.history.push(outputHistoryEntry);
        this._render([outputHistoryEntry]);
    }

    /**
     * Returns the history of the terminal lines
     * @returns {object[]} - An array of all history entries
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Returns the history of the terminal lines by type
     * @param {string} type - The type of history to return
     * @returns {object[]} - An array of history entries of the given type
     */
    getHistoryByType(type) {
        return this.history.filter(entry => entry.type === type);
    }

    /**
     * Resets the terminal
     */
    reset() {
        this.history = [];
        this.historyContainerElement.innerHTML = '';
    }

    /**
     * Returns the terminal API
     * @returns {Terminal} - The terminal instance
     */
    api() {
        return this;
    }

    /**
     * Sets the theme of the terminal
     * @param {string} theme - The theme to set
     */
    setTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;
        this.theme = theme;
        this.containerElement.style.backgroundColor = theme.background;
        this.containerElement.style.color = theme.foreground;
    }

    /**
     * Returns the current theme of the terminal
     * @returns {object} - The current theme
     */
    getTheme() {
        return this.theme;
    }

    /**
     * Returns all available themes
     * @returns {Object} - An object with the theme names as keys and the theme objects as values
     */
    getThemes() {
        return Object.values(THEMES);
    }

    setNextTheme() {
        //Do nothing
    }

    setPreviousTheme() {
        //Do nothing
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
        return this.getHistoryByType('input').map(entry => entry.content);
    }

    toggleScrollbarUseTheme() {
        //Do nothing
    }

    toggleDebug() {
        //Do nothing
    }

    setLinuxPrompt() {
        //Do nothing
    }

    setWindowsPrompt() {
        //Do nothing
    }
}

export default Terminal