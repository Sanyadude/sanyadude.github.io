import { TerminalViewport } from './components/terminal-viewport.js'
import { TextRenderer } from './components/text-renderer.js'
import { CursorRenderer } from './components/cursor-renderer.js'
import { InputHistoryNavigation } from './components/input-history-navigation.js'
import { InputCompletion } from './components/input-completion.js'
import { TextSelection } from './components/text-selection.js'
import { ThemeProvider } from './components/theme-provider.js'
import { TextBuffer } from './components/text-buffer.js'
import { TextViewport } from './components/text-viewport.js'
import { ScrollBoundsProvider } from './components/scroll-bounds-provider.js'
import { InputPrompt } from './components/input-prompt.js'
import { TerminalApi } from './api/terminal-api.js'
import { TerminalEventHandler } from './components/terminal-event-handler.js'
import { TerminalDebug } from './components/terminal-debug.js'
import { TerminalClear } from './cli-applications/terminal-clear/terminal-clear.js'
import { TerminalHistory } from './cli-applications/terminal-history/terminal-history.js'
import { TerminalSettings } from './cli-applications/terminal-settings/terminal-settings.js'

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

        this._info = {
            name: 'terminal',
            type: 'myterm',
            version: '0.3.0',
        };

        this._init();
    }

    /**
     * Initializes the Terminal interface
     */
    _init() {
        this.terminalApi = new TerminalApi(this);
        this.terminalEventHandler = new TerminalEventHandler(this);
        this.terminalDebug = new TerminalDebug(this);
        // Terminal components
        this.themeProvider = new ThemeProvider();
        this.terminalViewport = new TerminalViewport(this.container);
        this.layoutProvider = this.terminalViewport.getLayoutProvider();
        this.textBuffer = new TextBuffer(this.layoutProvider);
        this.scrollBoundsProvider = new ScrollBoundsProvider(this.layoutProvider, this.textBuffer);
        this.textViewport = new TextViewport(this.layoutProvider, this.scrollBoundsProvider);
        this.textRenderer = new TextRenderer(this.terminalViewport.getViewportContainer(), this.layoutProvider, this.themeProvider);
        this.cursorRenderer = new CursorRenderer(this.terminalViewport.getContainer(), this.layoutProvider);
        this.inputHistoryNavigation = new InputHistoryNavigation();
        this.inputCompletion = new InputCompletion();
        this.textSelection = new TextSelection(this.layoutProvider, this.scrollBoundsProvider);
        this.inputPrompt = new InputPrompt();

        this.terminalEventHandler.addListeners();

        this.api().setTheme();
        this.api().clear();
        //this.api().enableDebug();

        this.api().writeLine(`Command Line Interface v${this._info.version}`);
        this.api().writeLine('');
    }

    /**
     * Gets the CLI programs
     * @returns {Application[]} The CLI programs
     */
    getCliApplications() {
        return [new TerminalClear(), new TerminalHistory(), new TerminalSettings()];
    }

    /**
     * Inputs text into the terminal
     * @param {string} text - The text to input
     */
    input(text = '') {
        this.api().input(text);
    }

    /**
     * Outputs text into the terminal
     * @param {string} text - The text to output
     */
    output(text = '') {
        this.api().output(text);
    }

    /**
     * Returns the terminal API
     * @returns {TerminalApi} - The terminal API
     */
    api() {
        return this.terminalApi;
    }
}

export default Terminal