import { Application } from '../../system/application/application.js'
import { REMOVE_DIRECTORY_MANIFEST } from './remove-directory-manifest.js'

/**
 * RemoveDirectory - Application for removing a directory
 * @extends {Application}
 */
export class RemoveDirectory extends Application {
    /**
     * Creates a new RemoveDirectory instance
     */
    constructor() {
        super('remove-directory', REMOVE_DIRECTORY_MANIFEST);
    }

    /**
     * Executes the `rd` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the rmdir/rd command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        if (args.length === 0) return 'Path should be specified';
        const path = args.join(' ');
        const fullPath = context.fileSystemExplorer.getAbsolutePath(path);
        if (!context.fileSystemManager.directoryExists(fullPath)) return `Directory not found: ${path}`;
        const recursive = options['recursive'] || false;
        context.fileSystemManager.removeDirectory(fullPath, recursive);
        return `Directory removed: ${fullPath}`;        
    }
}

export default RemoveDirectory