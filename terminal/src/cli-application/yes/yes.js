import { Application } from '../../system/application/application.js'
import { YES_MANIFEST } from './yes-manifest.js'

const DELAY_MS = 100;

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
        const terminal = context.terminal;
        terminal.hidePrompt();
        while (!runtime.isAborted()) {
            terminal.writeOutputLine(text);
            await runtime.sleep(DELAY_MS);
        }
        return '';
    }
}

export default Yes