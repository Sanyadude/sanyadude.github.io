import { SHELL_NAME, SHELL_TYPE, SHELL_VERSION } from './config/config.js'

/**
 * ShellInfo class - represents the information of the shell
 */
export class ShellInfo {
    /**
     * Creates a new ShellInfo instance
     */
    constructor() {
        this.name = SHELL_NAME;
        this.type = SHELL_TYPE;
        this.version = SHELL_VERSION;
    }
}

export default ShellInfo