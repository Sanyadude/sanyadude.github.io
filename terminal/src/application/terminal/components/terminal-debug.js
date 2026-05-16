/**
 * TerminalRenderer class - represents a terminal renderer for the terminal
 */
export class TerminalDebug {
    /**
     * Creates a new TerminalDebug instance
     * @param {object} context - The context of the terminal
     */
    constructor(context) {
        this._context = context;
        this._container = null;
        this._debugInterval = null;

        this._init();
    }

    /**
     * Initializes the terminal debug
     */
    _init() {
        this._container = this._createDebugElement();
        this._context.container.appendChild(this._container);
    }

    /**
     * Creates the debug element for the terminal
     */
    _createDebugElement() {
        const debugElement = document.createElement('div');
        Object.assign(debugElement.style, {
            display: 'none',
            position: 'absolute',
            top: '0',
            right: '17px',
            maxWidth: '300px',
            fontFamily: 'Consolas, monospace',
            fontSize: '10px',
            zIndex: '10000',
            padding: '5px',
            border: `1px solid #ccc`,
            backgroundColor: '#fff',
            color: '#000',
            wordWrap: 'break-word',
        });
        return debugElement;
    }

    /**
     * Shows the debug element for the terminal
     * @returns {TerminalViewport} - The instance of the TerminalViewport
     */
    enable() {
        if (this.isEnabled()) return this;
        clearInterval(this._debugInterval);
        this._debugInterval = setInterval(() => this.renderDebug(), 1000);
        this._container.style.display = 'block';
        return this;
    }

    /**
     * Hides the debug element for the terminal
     * @returns {TerminalViewport} - The instance of the TerminalViewport
     */
    disable() {
        clearInterval(this._debugInterval);
        this._debugInterval = null;
        this._container.style.display = 'none';
        return this;
    }

    /**
     * Checks if the debug is enabled
     * @returns {boolean} - True if the debug is enabled, false otherwise
     */
    isEnabled() {
        return this._debugInterval !== null;
    }

    /**
     * Renders the debug information into the debug element
     */
    renderDebug() {
        this._container.innerHTML = `
viewport-size:${JSON.stringify(this._context.textViewport.getViewport())}<br>
offset:${JSON.stringify(this._context.textViewport.getOffset())}<br>
selection-start:${JSON.stringify(this._context.textSelection.getStart())}<br>
selection-end:${JSON.stringify(this._context.textSelection.getEnd())}<br>
cursor-position:${JSON.stringify(this._context.textBuffer.getCursorPosition())}<br>
input-text:${this._context.textBuffer.getInputText()}`;
    }
}

export default TerminalDebug