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
        const force = options['force'] || false;
        const sourcePath = args[0];
        const destinationPath = args[1];
        const fullSourcePath = context.fileSystemExplorer.getAbsolutePath(sourcePath);
        const fullDestinationPath = context.fileSystemExplorer.getAbsolutePath(destinationPath);
        context.fileSystemManager.move(fullSourcePath, fullDestinationPath, force);
        return `Moved: ${sourcePath} to ${destinationPath}`;
    }
}

export default Move