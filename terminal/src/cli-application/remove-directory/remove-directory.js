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
        const recursive = Boolean(options['recursive']);
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const messages = [];
        for (const path of args) {
            const fullPath = fsExplorer.getAbsolutePath(path);
            if (!fsManager.directoryExists(fullPath)) {
                messages.push(`Directory not found: ${fullPath}`);
                continue;
            }
            fsManager.removeDirectory(fullPath, recursive);
            messages.push(`Directory removed: ${fullPath}`);
        }
        return messages.join('\n');
    }
}

export default RemoveDirectory