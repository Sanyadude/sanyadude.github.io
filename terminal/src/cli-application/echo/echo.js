import { Application } from '../../system/application/application.js'
import { ECHO_MANIFEST } from './echo-manifest.js'

/**
 * Echo - Application for displaying text
 * @extends {Application}
 */
export class Echo extends Application {
    /**
     * Creates a new Echo instance
     */
    constructor() {
        super('echo', ECHO_MANIFEST);
    }

    /**
     * Executes the `echo` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {string} - The result of the echo command execution
     */
    main(commandLine) {
        const args = commandLine.getArguments();
        if (args.length === 0) return commandLine.getStdin();
        return args.join(' ');
    }
}

export default Echo