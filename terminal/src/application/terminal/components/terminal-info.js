import { TERMINAL_NAME, TERMINAL_TYPE, TERMINAL_VERSION, TERMINAL_COLOR_MODE } from '../config/config.js'

/**
 * TerminalInfo class - represents the information of the terminal
 */
export class TerminalInfo {
    /**
     * Creates a new TerminalInfo instance
     */
    constructor() {
        this.name = TERMINAL_NAME;
        this.type = TERMINAL_TYPE;
        this.version = TERMINAL_VERSION;
        this.colorMode = TERMINAL_COLOR_MODE;
    }
}

export default TerminalInfo