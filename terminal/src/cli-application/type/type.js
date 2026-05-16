import { Application } from '../../system/application/application.js'
import { TYPE_MANIFEST } from './type-manifest.js'

/**
 * Type - Application for displaying the contents of a file
 * @extends {Application}
 */
export class Type extends Application {
    /**
     * Creates a new Type instance
     */
    constructor() {
        super('type', TYPE_MANIFEST);
    }

    /**
     * Executes the `type` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the TYPE command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        if (args.length === 0) return 'Path should be specified';
        const path = args.join(' ');
        if (path == 'nul') return '';
        const file = context.fileSystemExplorer.getFile(path);
        if (!file) return `File not found: ${path}`;
        return file.readAsString();
    }
}

export default Type