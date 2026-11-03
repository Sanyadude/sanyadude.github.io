/**
 * Terminal event types
 * @enum {string}
 */
export const TERMINAL_EVENT_TYPE = Object.freeze({
    KEY: 'key',
    MOUSE: 'mouse',
    PRESS: 'press',
    RELEASE: 'release',
    CLICK: 'click',
    SELECTION: 'selection',
    SCROLL_STEP: 'scrollStep',
    SCROLL: 'scroll',
    RESIZE: 'resize',
    THEME: 'theme',
});

export default TERMINAL_EVENT_TYPE