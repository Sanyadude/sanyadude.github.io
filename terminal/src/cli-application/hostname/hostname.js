import { Application } from '../../system/application/application.js'
import { HOSTNAME_MANIFEST } from './hostname-manifest.js'

/**
 * Hostname - Application for printing the current host name
 * @extends {Application}
 */
export class Hostname extends Application {
    /**
     * Creates a new Hostname instance
     */
    constructor() {
        super('hostname', HOSTNAME_MANIFEST);
    }

    /**
     * Executes the `hostname` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the hostname command execution
     */
    main(commandLine, context) {
        return context.systemHost.getName();
    }
}

export default Hostname