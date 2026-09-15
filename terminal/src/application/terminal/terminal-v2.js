import { TerminalInfo } from './components/terminal-info.js'
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
import { TerminalEventDispatcher } from './components/terminal-event-dispatcher.js'
import { TerminalDebug } from './components/terminal-debug.js'
import { CLI_APPS } from './config/cli-apps.js'
import { TERMINAL_WELCOME_MESSAGE_LINES } from './config/config.js'

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

        this._init();
    }

    /**
     * Initializes the Terminal interface
     */
    _init() {
        this.info = new TerminalInfo();
        this.terminalApi = new TerminalApi(this);
        this.terminalEventHandler = new TerminalEventHandler(this);
        this.terminalEventDispatcher = new TerminalEventDispatcher(this);
        this.terminalDebug = new TerminalDebug(this);
        // Terminal components
        this.themeProvider = new ThemeProvider();
        this.terminalViewport = new TerminalViewport(this.container, this.configProvider);
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

        this.terminalEventDispatcher.addListeners();

        this.api().setTheme();
        this.api().applyConfig();
        this.api().clear();
        //this.api().enableDebug();

        TERMINAL_WELCOME_MESSAGE_LINES.forEach(line => this.api().writeLine(line));
    }

    /**
     * Gets the CLI programs
     * @returns {Application[]} The CLI programs
     */
    getCliApplications() {
        return Object.values(CLI_APPS);
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

    /**
     * Dispatches a terminal event
     * @param {TerminalEvent} terminalEvent - The terminal event to dispatch
     */
    dispatch(terminalEvent) {
        this.terminalEventHandler.handle(terminalEvent);
    }
}

export default Terminal