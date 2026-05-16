import { Application } from '../../system/application/application.js'
import { WHOAMI_MANIFEST } from './whoami-manifest.js'

/**
 * Whoami - Application for printing the current user name
 * @extends {Application}
 */
export class Whoami extends Application {
    /**
     * Creates a new Whoami instance
     */
    constructor() {
        super('whoami', WHOAMI_MANIFEST);
    }

    /**
     * Executes the `whoami` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the whoami command execution
     */
    main(commandLine, context) {
        return context.systemUser.getName();
    }
}

export default Whoami