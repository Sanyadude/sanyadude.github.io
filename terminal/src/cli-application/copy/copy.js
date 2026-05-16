import { Application } from '../../system/application/application.js'
import { COPY_MANIFEST } from './copy-manifest.js'

/**
 * Copy - Application for copying a file or directory
 * @extends {Application}
 */
export class Copy extends Application {
    /**
     * Creates a new Copy instance
     */
    constructor() {
        super('copy', COPY_MANIFEST);
    }

    /**
     * Executes the `copy` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the copy command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        if (args.length < 2) return 'Source and destination paths should be specified';
        const sourcePath = args[0];
        const destinationPath = args[1];
        const fullSourcePath = context.fileSystemExplorer.getAbsolutePath(sourcePath);
        const fullDestinationPath = context.fileSystemExplorer.getAbsolutePath(destinationPath);
        context.fileSystemManager.copyEntry(fullSourcePath, fullDestinationPath);
        return `Copied: ${sourcePath} to ${destinationPath}`;
    }

}

export default Copy