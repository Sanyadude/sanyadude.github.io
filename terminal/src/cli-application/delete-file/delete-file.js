import { Application } from '../../system/application/application.js'
import { DELETE_FILE_MANIFEST } from './delete-file-manifest.js'

/**
 * DeleteFile - Application for deleting a file
 * @extends {Application}
 */
export class DeleteFile extends Application {
    /**
     * Creates a new DeleteFile instance
     */
    constructor() {
        super('delete-file', DELETE_FILE_MANIFEST);
    }

    /**
     * Executes the `del` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the del command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        if (args.length === 0) return 'Path should be specified';
        const path = args.join(' ');
        const fullPath = context.fileSystemExplorer.getAbsolutePath(path);
        if (!context.fileSystemManager.fileExists(fullPath)) return `File not found: ${path}`;
        context.fileSystemManager.removeFile(fullPath);
        return `File removed: ${fullPath}`;
    }
}

export default DeleteFile