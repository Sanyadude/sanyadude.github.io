/**
 * Terminal event types
 * @enum {string}
 */
export const TERMINAL_EVENT_TYPE = Object.freeze({
    KEY: 'key',
    MOUSE: 'mouse',
    SELECTION_START: 'selectionStart',
    SELECTION_UPDATE: 'selectionUpdate',
    SELECTION_END: 'selectionEnd',
    SCROLL_STEP: 'scrollStep',
    SCROLL: 'scroll',
    RESIZE: 'resize',
    DROP: 'drop',
    THEME: 'theme',
});

export default TERMINAL_EVENT_TYPE