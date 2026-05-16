import { BrowserAPI } from '../../core/core.js'
import { Application } from '../../system/application/application.js'
import { DOWNLOAD_MANIFEST } from './download-manifest.js'

/**
 * Download - Application for downloading a file
 * @extends {Application}
 */
export class Download extends Application {
    /**
     * Creates a new Download instance
     */
    constructor() {
        super('download', DOWNLOAD_MANIFEST);
    }

    /**
     * Executes the `dl` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the dl command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        if (args.length === 0) return 'Path should be specified';
        const path = args[0];
        const file = context.fileSystemExplorer.getFile(path);
        if (!file) return `File not found: ${path}`;
        BrowserAPI.downloadFile(file.getName(), file.read());
        return `File downloaded: ${path}`;
    }
}

export default Download