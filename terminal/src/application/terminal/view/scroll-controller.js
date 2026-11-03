/**
 * ScrollController class - controls the scrolling of the text viewport
 */
export class ScrollController {
    /**
     * Creates a new ScrollController instance
     * @param {TerminalDom} dom The terminal DOM instance
     * @param {TextViewport} textViewport The text viewport instance
     */
    constructor(dom, textViewport) {
        this._dom = dom;
        this._textViewport = textViewport;
        this._unsubscribers = [];
        this._init();
    }

    /**
     * Initializes the scroll controller
     */
    _init() {
        this._unsubscribers = [
            this._textViewport.onOffsetChange((event) => {
                this._dom.setScrollThumbPosition(this._textViewport.getScrollYPercentage());
            }),
        ];
    }

    /**
     * Disposes the scroll controller
     * @returns {ScrollController} The instance of the ScrollController
     */
    dispose() {
        this._unsubscribers.forEach(unsubscriber => unsubscriber());
        this._unsubscribers = [];
        return this;
    }
}

export default ScrollController