import { Application } from '../../system/application/application.js'
import { YES_MANIFEST } from './yes-manifest.js'

/**
 * Yes - Application that repeatedly outputs a line until interrupted
 * @extends {Application}
 */
export class Yes extends Application {
    /**
     * Creates a new Yes instance
     */
    constructor() {
        super('yes', YES_MANIFEST);
    }

    /**
     * Executes the `yes` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {ApplicationExecutionContext} context - The execution context
     * @returns {Promise<string>} - Empty string when finished
     */
    async main(commandLine, context) {
        const args = commandLine.getArguments();
        const text = args.length > 0 ? args.join(' ') : 'y';
        const runtime = context.getRuntime();
        while (!runtime.isAborted()) {
            context.terminal.writeOutputLine(text);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return '';
    }
}

export default Yes