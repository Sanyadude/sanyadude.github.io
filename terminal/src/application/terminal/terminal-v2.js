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
            version: '0.2.0',
        };
        this.theme = { name: 'none' };

        this.fontSize = 16;
        this.padding = 10;

        this.currentText = '';
        this.currentPromptText = '';
        this.caretIndex = 0;

        this.charSize = { width: 0, height: 0 };

        this.selectionStart = { column: 0, line: 0 };
        this.selectionEnd = { column: 0, line: 0 };
        this.isSelecting = false;

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
        this.currentPromptText = this._getPromptText();

        this._initElements();
        this._initListeners();

        this.setTheme(DEFAULT_THEME_NAME);

        this.reset();
        // Add initial lines
        this.output(`Command Line Interface v${this.info.version}`);
        this.output('');
        this._focusInput();
    }

    /**
     * Initializes the elements for the terminal
     */
    _initElements() {
        // Add style element
        this._addStyleElement();
        // Create container
        this._containerElement = this._createContainer();
        this.container.appendChild(this._containerElement);
        // Create history container
        this._historyContainerElement = this._createHistoryContainer();
        this._containerElement.appendChild(this._historyContainerElement);
        // Calculate the size of the character
        this.charSize = this._getCharSize(this._historyContainerElement);
        // Create input container
        this._inputContainerElement = this._createInputContainer();
        this._containerElement.appendChild(this._inputContainerElement);
        // Create input element
        this._inputElement = this._createInput();
        this._inputContainerElement.appendChild(this._inputElement);
        // Create caret element
        this._caretElement = this._createCaret();
        this._inputContainerElement.appendChild(this._caretElement);
        // Create selection element
        this._selectionContainerElement = this._createSelectionContainer();
        this._containerElement.prepend(this._selectionContainerElement);
    }

    /**
     * Initializes the listeners for the terminal
     */
    _initListeners() {
        this._containerElement.addEventListener('click', (event) => {
            this._focusInput();
        });
        this._containerElement.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        this._containerElement.addEventListener('drop', (event) => {
            this._handleDrop(event);
        });
        this._containerElement.addEventListener('mousedown', (event) => {
            this._handleMouseDown(event);
        });
        this._containerElement.addEventListener('mousemove', (event) => {
            this._handleMouseMove(event);
        });
        this._containerElement.addEventListener('mouseup', (event) => {
            this._handleMouseUp(event);
        });
        this._containerElement.addEventListener('wheel', (event) => {
            this._handleWheel(event);
        });
        this._inputContainerElement.addEventListener('click', (event) => {
            this._handleClick(event);
        });
        this._inputContainerElement.addEventListener('contextmenu', (event) => {
            this._handleContextMenu(event);
        });
        this._inputElement.addEventListener('keydown', (event) => {
            this._handleInputKeyDown(event);
        });
        window.addEventListener('resize', (event) => {
            this._handleResize(event);
        });
        const resizeObserver = new ResizeObserver(() => {
            this._handleResize();
        });
        resizeObserver.observe(this._containerElement);
    }

    /**
     * Creates the container for the terminal
     */
    _createContainer() {
        const containerElement = document.createElement('div');
        containerElement.style.fontFamily = 'Consolas, monospace';
        containerElement.style.fontSize = `${this.fontSize}px`;
        containerElement.style.width = '100%';
        containerElement.style.height = '100%';
        containerElement.style.overflow = 'auto';
        containerElement.style.boxSizing = 'border-box';
        containerElement.style.cursor = 'default';
        containerElement.style.userSelect = 'none';
        containerElement.style.padding = `${this.padding}px`;
        containerElement.style.whiteSpace = 'pre-wrap';
        containerElement.style.wordBreak = 'break-all';
        return containerElement;
    }

    /**
     * Creates the style element for the terminal and adds it to the head of the document
     */
    _addStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.textContent = TextFormat.getStyles();
        document.head.appendChild(styleElement);
    }

    /**
     * Creates the history container for the terminal
     */
    _createHistoryContainer() {
        const historyContainerElement = document.createElement('div');
        return historyContainerElement;
    }

    /**
     * Creates the input container for the terminal
     */
    _createInputContainer() {
        const inputContainerElement = document.createElement('div');
        inputContainerElement.style.position = 'relative';
        inputContainerElement.style.marginBottom = `${this.charSize.height * 10}px`;
        return inputContainerElement;
    }

    /**
     * Creates the input for the terminal
     */
    _createInput() {
        const inputElement = document.createElement('div');
        inputElement.style.outline = 'none';
        inputElement.style.minHeight = `${this.charSize.height}px`;
        inputElement.setAttribute('tabindex', '0');
        return inputElement;
    }

    /**
     * Creates the caret for the terminal
     */
    _createCaret() {
        const caretElement = document.createElement('div');
        caretElement.style.display = 'inline-block';
        caretElement.style.width = `${Math.floor(this.charSize.width)}px`;
        caretElement.style.height = `${this.fontSize / 4}px`;
        caretElement.style.position = 'absolute';
        caretElement.style.zIndex = '1';
        return caretElement;
    }

    /**
     * Creates the selection container for the terminal
     */
    _createSelectionContainer() {
        const selectionContainerElement = document.createElement('div');
        selectionContainerElement.style.display = 'none';
        selectionContainerElement.style.position = 'absolute';
        selectionContainerElement.style.zIndex = '1';
        return selectionContainerElement;
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
     * Returns the position of the event in the terminal
     * @param {MouseEvent} event - The event
     * @returns {object} - The position of the event in the terminal
     */
    _getSelectionPosition(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        let column = Math.round((event.clientX - rect.left - this.padding) / this.charSize.width);
        let line = Math.floor((event.currentTarget.scrollTop + event.clientY - rect.top - this.padding) / this.charSize.height);
        const maxChars = this._getMaxChars();
        const maxLines = Math.floor((event.currentTarget.scrollHeight - this.padding * 2) / this.charSize.height);
        if (column < 0) column = 0;
        if (column > maxChars) column = maxChars;
        if (line < 0) line = 0;
        if (line > maxLines - 1) line = maxLines - 1;
        return { column, line };
    }

    /**
     * Returns the position of the event in the terminal
     * @param {MouseEvent} event - The event
     * @returns {object} - The position of the event in the terminal
     */
    _getCaretPosition(event) {
        const column = Math.round(event.offsetX / this.charSize.width);
        const line = Math.floor(event.offsetY / this.charSize.height);
        return { line, column };
    }

    /**
     * Returns the index of the character in the input element
     * @param {number} line - The line of the character
     * @param {number} column - The column of the character
     * @returns {number} - The index of the character in the input element
     */
    _getCharIndex(line, column) {
        const maxChars = this._getMaxChars();
        return line * maxChars + column;
    }

    /**
     * Returns the position of the character in the input element
     * @param {number} index - The index of the character
     * @returns {object} - The position of the character in the input element
     */
    _getCharPosition(index) {
        const maxChars = this._getMaxChars();
        const line = Math.floor(index / maxChars);
        const column = index % maxChars;
        return { line, column, maxChars };
    }

    /**
     * Returns the maximum number of characters per line
     * @returns {number} - The maximum number of characters per line
     */
    _getMaxChars() {
        return Math.floor(this._inputElement.getBoundingClientRect().width / this.charSize.width);
    }

    /**
     * Returns the prompt text
     * @returns {string} - The prompt text
     */
    _getPromptText() {
        return this._formatPromptText(this.fileSystemExplorer.getCurrentPath());
    }

    /**
     * Formats the prompt text
     * @param {string} path - The path to format the prompt text for
     * @returns {string} - The formatted prompt text
     */
    _formatPromptText(path) {
        return `${path || '/'}>`;
    }

    /**
     * Sets the text of the input element
     * @param {string} text - The text to set the text to
     */
    _setText(text = '') {
        this.currentText = text;
        text = this.currentPromptText + text;
        if (!text) {
            this._inputElement.textContent = text;
            return;
        }
        const maxChars = this._getMaxChars();
        const lines = [];
        text = text.replace(/\n|\r/g, '');
        for (let i = 0; i < text.length; i += maxChars) {
            lines.push(text.slice(i, i + maxChars));
        }
        this._inputElement.textContent = lines.join('\n');
        this._drawSelection();
    }

    /**
     * Moves the caret to the given index
     * @param {number} index - The index to move the caret to
     */
    _moveCaret(index = 0) {
        index = index;
        if (index < 0) {
            index = 0;
        }
        if (index > this.currentText.length) {
            index = this.currentText.length;
        }
        this.caretIndex = index;
        const { line, column } = this._getCharPosition(index + this.currentPromptText.length);
        this._caretElement.style.top = `${((1 + line) * this.charSize.height) - this.charSize.height * 0.25}px`;
        this._caretElement.style.left = `${column * this.charSize.width}px`;
    }

    /**
     * Returns the text of the node at the given point
     * @param {number} x - The x coordinate of the point
     * @param {number} y - The y coordinate of the point
     * @returns {string} - The text of the node at the given point
     */
    _getNodeTextFromPoint(x, y) {
        let fullText = '';
        let element = document.elementFromPoint(x, y);
        if (!element) return fullText;
        const possibleParents = [...this._historyContainerElement.children, this._inputContainerElement];
        const elementParent = possibleParents.find(parent => parent.contains(element));
        if (elementParent) {
            element = elementParent;
        }
        if (!possibleParents.includes(element) || !elementParent) return fullText;
        fullText = element.innerText;
        if (!fullText) return fullText;
        const maxChars = this._getMaxChars();
        const row = Math.floor((y - element.getBoundingClientRect().y) / this.charSize.height);
        const startIndex = row * maxChars;
        return fullText.slice(startIndex, startIndex + maxChars).replace(/\n|\r/g, '');
    }

    /**
     * Clears the selection on the terminal
     */
    _clearSelection() {
        this._selectionContainerElement.innerHTML = '';
        this._selectionContainerElement.style.display = 'none';
    }

    /**
     * Draws current selection on the terminal
     */
    _drawSelection() {
        this._clearSelection();
        if (this.selectionStart.line === this.selectionEnd.line && this.selectionStart.column === this.selectionEnd.column) return;
        const startIndex = this._getCharIndex(this.selectionStart.line, this.selectionStart.column);
        const endIndex = this._getCharIndex(this.selectionEnd.line, this.selectionEnd.column);
        const startSelection = startIndex <= endIndex ? this.selectionStart : this.selectionEnd;
        const endSelection = startIndex <= endIndex ? this.selectionEnd : this.selectionStart;
        const lines = endSelection.line - startSelection.line;
        this._selectionContainerElement.style.display = 'block';
        const maxChars = this._getMaxChars();
        for (let i = 0; i <= lines; i++) {
            let line = startSelection.line + i;
            let startColumn = 0;
            let endColumn = maxChars;
            if (i === 0) {
                startColumn = startSelection.column;
            }
            if (i === lines) {
                endColumn = endSelection.column;
            }
            const nodeText = this._getNodeTextFromPoint(this.padding + startColumn * this.charSize.width, this.padding + line * this.charSize.height - this._containerElement.scrollTop);
            const text = nodeText.slice(startColumn, endColumn);
            const columns = endColumn - startColumn;
            const lineElement = document.createElement('div');
            lineElement.textContent = text;
            lineElement.style.height = `${this.charSize.height}px`;
            lineElement.style.width = `${columns * this.charSize.width}px`;
            lineElement.style.position = 'absolute';
            lineElement.style.backgroundColor = this.theme.selectionBackground;
            lineElement.style.color = this.theme.background;
            const top = line * this.charSize.height - this._containerElement.scrollTop;
            lineElement.style.top = `${top}px`;
            lineElement.style.left = `${startColumn * this.charSize.width}px`;
            if (this._containerElement.offsetHeight - this.padding * 2 < top + this.charSize.height) {
                lineElement.style.display = 'none';
            }
            this._selectionContainerElement.appendChild(lineElement);
        }
        this._focusInput();
    }

    /**
     * Focuses the input element
     */
    _focusInput() {
        try {
            this._inputElement.focus({ preventScroll: true });
        } catch {
            this._inputElement.focus();
        }
    }

    /**
     * Copies the selected text to the clipboard
     */
    async _copyToClipboard() {
        try {
            let text = '';
            for (const line of this._selectionContainerElement.children) {
                text += line.textContent + '\n';
            }
            await navigator.clipboard.writeText(text);
        } catch (error) {
            return;
        }
    }

    /**
     * Pastes the text from the clipboard to the input at the caret position
     */
    async _pasteFromClipboard() {
        try {
            let text = await navigator.clipboard.readText();
            text = text.replace(/\n|\r/g, '');
            const newText = this.currentText.slice(0, this.caretIndex) + text + this.currentText.slice(this.caretIndex);
            this._setText(newText);
            this._moveCaret(this.caretIndex + text.length);
        } catch (error) {
            return;
        }
    }

    /**
     * Handles the resize event for the terminal
     * @param {Event} event - The resize event
     */
    _handleResize(event) {
        this._setText(this.currentText);
        this._moveCaret(this.caretIndex);
        this._drawSelection();
    }

    /**
     * Handles the mouse down event for the terminal
     * @param {MouseEvent} event - The mouse down event
     */
    _handleMouseDown(event) {
        this.isSelecting = true;
        this.selectionStart = this._getSelectionPosition(event);
        this.selectionEnd = this.selectionStart;
    }

    /**
     * Handles the mouse move event for the terminal
     * @param {MouseEvent} event - The mouse move event
     */
    _handleMouseMove(event) {
        if (!this.isSelecting) return;
        this.selectionEnd = this._getSelectionPosition(event);
        this._drawSelection();
    }

    /**
     * Handles the mouse up event for the terminal
     * @param {MouseEvent} event - The mouse up event
     */
    _handleMouseUp(event) {
        if (!this.isSelecting) return;
        this.isSelecting = false;
        this.selectionEnd = this._getSelectionPosition(event);
        this._drawSelection();
    }

    /**
     * Handles the wheel event for the terminal
     * @param {WheelEvent} event - The wheel event
     */
    _handleWheel(event) {
        event.preventDefault();
        this._containerElement.scrollTop += event.deltaY;
        this._drawSelection();
    }

    /**
     * Handles the click event for the terminal
     * @param {MouseEvent} event - The click event
     */
    _handleClick(event) {
        const { line, column } = this._getCaretPosition(event);
        const index = this._getCharIndex(line, column);
        this._moveCaret(index - this.currentPromptText.length);
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
     * Handles the key event for the input element
     * @param {KeyboardEvent} event - The key event
     */
    _handleInputKey(event) {
        event.preventDefault();
        const text = this.currentText;
        const newText = text.slice(0, this.caretIndex) + event.key + text.slice(this.caretIndex);
        this._setText(newText);
        this._moveCaret(this.caretIndex + 1);
    }

    /**
     * Handles the ctrl key event for the input element
     * @param {KeyboardEvent} event - The ctrl key event
     */
    _handleCtrlInputKey(event) {
        event.preventDefault();
        switch (event.key) {
            case 'c':
                this._copyToClipboard();
                break;
            case 'v':
                this._pasteFromClipboard();
                break;
        }
    }

    /**
     * Handles the enter key event
     * @param {KeyboardEvent} event - The enter key event
     */
    _handleEnterKey(event) {
        event.preventDefault();
        this.input(this.currentText);
        this.historyIndex = null;
        this.currentPromptText = this._getPromptText();
        this._setText();
        this._moveCaret();
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
        const text = this.currentText.replace(/\u00A0/g, " ");
        const beforeCaret = text.slice(0, this.caretIndex);
        const afterCaret = text.slice(this.caretIndex);
        if (afterCaret.trim() !== '') return;
        const lastWordPartIndex = beforeCaret.lastIndexOf(' ');
        const lastWordPart = beforeCaret.slice(lastWordPartIndex + 1);
        const fullWord = names.find(name => name.startsWith(lastWordPart)) || '';
        if (fullWord !== '' && fullWord !== lastWordPart) {
            const newText = beforeCaret.slice(0, lastWordPartIndex + 1) + fullWord + afterCaret;
            this._setText(newText);
            this._moveCaret(newText.length);
            this.fileSuggestionIndex = names.indexOf(fullWord);
            return;
        }
        // Find the current word before the caret
        const currentWord = names.find(name => beforeCaret.endsWith(name)) || '';
        const wordStart = this.caretIndex - currentWord.length;
        // Cycle through file suggestions
        this.fileSuggestionIndex = this.fileSuggestionIndex + 1 < names.length ? this.fileSuggestionIndex + 1 : 0;
        const suggestion = names[this.fileSuggestionIndex];
        const newText = beforeCaret.slice(0, wordStart) + suggestion + afterCaret;
        this._setText(newText);
        this._moveCaret(newText.length);
    }

    /**
     * Handles the backspace key event
     * @param {KeyboardEvent} event - The backspace key event
     */
    _handleBackspaceKey(event) {
        event.preventDefault();
        const text = this.currentText;
        if (this.caretIndex === 0) return;
        const newText = text.slice(0, this.caretIndex - 1) + text.slice(this.caretIndex);
        this._setText(newText);
        this._moveCaret(this.caretIndex - 1);
    }

    /**
     * Handles the delete key event
     * @param {KeyboardEvent} event - The delete key event
     */
    _handleDeleteKey(event) {
        event.preventDefault();
        const text = this.currentText;
        const newText = text.slice(0, this.caretIndex) + text.slice(this.caretIndex + 1);
        this._setText(newText);
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
        const newText = distinctInputs[this.historyIndex];
        this._setText(newText);
        this._moveCaret(newText.length);
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
        let newText = '';
        if (this.historyIndex === distinctInputs.length - 1) {
            this.historyIndex = null;
            newText = '';
        } else {
            this.historyIndex = Math.min(distinctInputs.length - 1, this.historyIndex + 1);
            newText = distinctInputs[this.historyIndex] || '';
        }
        this._setText(newText);
        this._moveCaret(newText.length);
    }

    /**
     * Handles the arrow left key event
     * @param {KeyboardEvent} event - The arrow left key event
     */
    _handleArrowLeftKey(event) {
        event.preventDefault();
        if (event.ctrlKey) {
            const beforeCaret = this.currentText.slice(0, this.caretIndex);
            const words = beforeCaret.split(' ').filter(word => word);
            const index = words.length > 0 ? beforeCaret.lastIndexOf(words[words.length - 1]) : 0;
            this._moveCaret(index);
            return;
        }
        this._moveCaret(this.caretIndex - 1);
    }

    /**
     * Handles the arrow right key event
     * @param {KeyboardEvent} event - The arrow right key event
     */
    _handleArrowRightKey(event) {
        event.preventDefault();
        if (event.ctrlKey) {
            const beforeCaret = this.currentText.slice(0, this.caretIndex);
            const afterCaret = this.currentText.slice(this.caretIndex);
            const words = afterCaret.split(' ').filter(word => word);
            const index = words.length > 0 ? beforeCaret.length + afterCaret.indexOf(words[0]) + words[0].length : this.currentText.length;
            this._moveCaret(index);
            return;
        }
        this._moveCaret(this.caretIndex + 1);
    }

    /**
     * Handles the key down event for the input element
     * @param {KeyboardEvent} event - The key down event
     */
    _handleInputKeyDown(event) {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            this._handleInputKey(event);
            return;
        }
        if (event.key.length === 1 && event.ctrlKey) {
            this._handleCtrlInputKey(event);
            return;
        }
        if (event.key === 'Enter') {
            this._handleEnterKey(event);
            return;
        }
        if (event.key === 'Tab') {
            this._handleTabKey(event);
            return;
        }
        if (event.key === 'Backspace') {
            this._handleBackspaceKey(event);
            return;
        }
        if (event.key === 'Delete') {
            this._handleDeleteKey(event);
            return;
        }
        if (event.key === 'ArrowUp') {
            this._handleArrowUpKey(event);
        }
        if (event.key === 'ArrowDown') {
            this._handleArrowDownKey(event);
        }
        if (event.key === 'ArrowLeft') {
            this._handleArrowLeftKey(event);
        }
        if (event.key === 'ArrowRight') {
            this._handleArrowRightKey(event);
        }
        this.fileSuggestionIndex = -1;
    }

    /**
     * Handles the context menu event for the input element
     * @param {MouseEvent} event - The mouse up event
     */
    _handleContextMenu(event) {
        event.preventDefault();
        this._pasteFromClipboard();
    }

    /**
     * Renders entries into the history container
     * @param {object[]} entries - The entries to render
     */
    _render(entries = []) {
        entries.forEach(entry => {
            const lines = entry.content.split('\n');
            //Add path to first input line
            if (lines.length !== 0 && entry.type === 'input') {
                lines[0] = `${this._formatPromptText(entry.path)}${lines[0]}`;
            }
            lines.forEach(line => {
                const lineElement = document.createElement('div');
                //Set height to charSize.height for empty lines
                if (line.trim() === '') {
                    lineElement.style.height = `${this.charSize.height}px`;
                }
                lineElement.innerHTML = this._formatOutput(line);
                this._historyContainerElement.appendChild(lineElement);
            });
        });
        this._containerElement.scrollTop = this._containerElement.scrollHeight;
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
        this._historyContainerElement.innerHTML = '';
        this._setText();
        this._moveCaret();
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
        this._containerElement.style.backgroundColor = theme.background;
        this._containerElement.style.color = theme.foreground;
        this._caretElement.style.backgroundColor = theme.cursorColor;
        Array.from(this._selectionContainerElement.children).forEach(child => {
            child.style.backgroundColor = theme.selectionBackground;
            child.style.color = theme.background;
        });
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