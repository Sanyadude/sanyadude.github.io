import { Application } from '../../system/application/application.js'
import { MOVE_MANIFEST } from './move-manifest.js'

/**
 * Move - Application for moving a file or directory
 * @extends {Application}
 */
export class Move extends Application {
    /**
     * Creates a new Move instance
     */
    constructor() {
        super('move', MOVE_MANIFEST);
    }

    /**
     * Executes the `move` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the move command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        if (args.length < 2) return 'Source and destination paths should be specified';
        const overwrite = Boolean(options['overwrite']);
        const destinationPath = args[args.length - 1];
        const sourceArgs = args.slice(0, -1);
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const fullDestinationPath = fsExplorer.getAbsolutePath(destinationPath);
        const sources = sourceArgs.map((sourceArg) => fsExplorer.getAbsolutePath(sourceArg));
        if (sources.length > 1 && !fsManager.directoryExists(fullDestinationPath)) {
            return `Destination must be a directory: ${destinationPath}`;
        }
        const messages = [];
        for (const source of sources) {
            if (!fsManager.exists(source)) return `File not found: ${source}`;
            fsManager.move(source, fullDestinationPath, overwrite);
            messages.push(`Moved: ${source} to ${destinationPath}`);
        }
        return messages.join('\n');
    }
}

export default Move