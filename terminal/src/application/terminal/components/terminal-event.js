import TERMINAL_EVENT_TYPE from './terminal-event-type.js';

/**
 * TerminalEvent - Normalized event from terminal UI input
 */
export class TerminalEvent {
    /**
     * Creates a new TerminalEvent instance
     * @param {object} options - The event options
     * @param {string} options.type - The event type (see TERMINAL_EVENT_TYPE)
     * @param {string} options.name - The event name (e.g. key combo, mouse combo)
     * @param {object} [options.data={}] - Additional event data
     * @param {Event|null} [options.originalEvent=null] - The original DOM event
     */
    constructor(options = {}) {
        const { type, name = '', data = {}, originalEvent = null } = options;
        if (!type || typeof type !== 'string') {
            throw new Error('TerminalEvent type must be a non-empty string');
        }
        this.type = type;
        this.name = name;
        this.data = data;
        this.originalEvent = originalEvent;
        this.timestamp = Date.now();
    }
}

export default TerminalEvent