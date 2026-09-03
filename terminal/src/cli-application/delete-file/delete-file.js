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
        const options = commandLine.getOptions();
        if (args.length === 0) return 'Path should be specified';
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const messages = [];
        for (const path of args) {
            const fullPath = fsExplorer.getAbsolutePath(path);
            if (!fsManager.fileExists(fullPath)) {
                messages.push(`File not found: ${fullPath}`);
                continue;
            }
            fsManager.removeFile(fullPath);
            messages.push(`File removed: ${fullPath}`);
        }
        return messages.join('\n');
    }
}

export default DeleteFile