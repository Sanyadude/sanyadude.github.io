/**
 * LayoutProvider class - represents a provider for the layout
 */
export class LayoutProvider {
    /**
     * Creates a new LayoutProvider instance
     */
    constructor() {
        this._layout = null;
    }

    /**
     * Sets the layout
     * @param {TerminalLayout} layout - The layout of the terminal
     * @returns {LayoutProvider} - The instance of the LayoutProvider
     */
    setLayout(layout) {
        this._layout = layout;
        return this;
    }

    /**
     * Gets the layout
     * @returns {TerminalLayout} - The layout of the terminal
     */
    getLayout() {
        return this._layout;
    }
}

export default LayoutProvider