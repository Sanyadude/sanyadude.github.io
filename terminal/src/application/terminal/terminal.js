import { TerminalInfo } from './terminal-info.js'
import { TerminalDom } from './dom/terminal-dom.js'
import { TextRenderer } from './renderer/text-renderer.js'
import { CursorRenderer } from './renderer/cursor-renderer.js'
import { TextSelection } from './view/text-selection.js'
import { Clipboard } from './clipboard/clipboard.js'
import { ThemeProvider } from './theme/theme-provider.js'
import { PrimaryTextBuffer } from './buffer/primary-text-buffer.js'
import { AlternateTextBuffer } from './buffer/alternate-text-buffer.js'
import { TextBufferProvider } from './buffer/text-buffer-provider.js'
import { TextViewport } from './view/text-viewport.js'
import { ScrollBoundsProvider } from './view/scroll-bounds-provider.js'
import { TerminalApi } from './api/terminal-api.js'
import { TerminalEventHandler } from './input/terminal-event-handler.js'
import { TerminalEventDispatcher } from './input/terminal-event-dispatcher.js'
import { InputHandlerController } from './input/input-handler-controller.js'
import { TerminalDebug } from './debug/terminal-debug.js'
import { ScrollController } from './view/scroll-controller.js'
import { RenderController } from './renderer/render-controller.js'
import { CLI_APPS } from './config/cli-apps.js'

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

        this._init();
    }

    /**
     * Initializes the Terminal interface
     */
    _init() {
        this.info = new TerminalInfo();
        // Terminal components
        this.themeProvider = new ThemeProvider();
        this.dom = new TerminalDom(this.container, this.configProvider);
        this.layoutProvider = this.dom.getLayoutProvider();
        // Text buffers
        const primaryBuffer = new PrimaryTextBuffer(this.layoutProvider);
        const alternateBuffer = new AlternateTextBuffer(this.layoutProvider);
        this.textBufferProvider = new TextBufferProvider(primaryBuffer, alternateBuffer);
        this.textBuffer = this.textBufferProvider.getTextBuffer();
        // Text viewport
        this.scrollBoundsProvider = new ScrollBoundsProvider(this.layoutProvider, this.textBufferProvider);
        this.textViewport = new TextViewport(this.layoutProvider, this.scrollBoundsProvider);
        // Renderers
        this.renderer = new TextRenderer(this.dom.getViewportContainer(), this.layoutProvider, this.themeProvider);
        this.cursorRenderer = new CursorRenderer(this.dom.getRootContainer(), this.layoutProvider);
        //
        this.textSelection = new TextSelection(this.layoutProvider, this.scrollBoundsProvider);
        this.clipboard = new Clipboard();
        this.readline = this.shell.getReadline();
        // Terminal context dependent components
        this.api = new TerminalApi(this);
        this.eventHandler = new TerminalEventHandler(this);
        this.eventDispatcher = new TerminalEventDispatcher(this);
        this.terminalDebug = new TerminalDebug(this);
        this.scrollController = new ScrollController(this.dom, this.textViewport);
        this.renderController = new RenderController(this.textBufferProvider, this.textViewport, this.textSelection, this.renderer, this.cursorRenderer);
        this.inputHandlerController = new InputHandlerController(this.shell);

        this.eventDispatcher.addListeners();

        this.api.applyConfig();
    }

    /**
     * Gets the CLI programs
     * @returns {Application[]} The CLI programs
     */
    getCliApplications() {
        return Object.values(CLI_APPS);
    }

    /**
     * Releases listeners, timers, and DOM owned by the terminal
     */
    dispose() {
        this.renderController.dispose();
        this.textBufferProvider.clear();
        this.eventDispatcher.removeListeners();
        this.textViewport.dispose();
        this.terminalDebug.dispose();
        this.renderer.dispose();
        this.cursorRenderer.dispose();
        this.dom.dispose();
        this.themeProvider.dispose();
        this.scrollController.dispose();
    }
}

export default Terminal