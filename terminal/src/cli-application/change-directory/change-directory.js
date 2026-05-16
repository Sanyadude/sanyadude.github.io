import { Application } from '../../system/application/application.js'
import { CHANGE_DIRECTORY_MANIFEST } from './change-directory-manifest.js'

/**
 * ChangeDirectory - Application for changing the current directory
 * @extends {Application}
 */
export class ChangeDirectory extends Application {
    /**
     * Creates a new ChangeDirectory instance
     */
    constructor() {
        super('change-directory', CHANGE_DIRECTORY_MANIFEST);
    }

    /**
     * Executes the `cd` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the cd/chdir command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const cwd = context.fileSystemExplorer.getCurrentPath();
        if (args.length === 0) return cwd || '/';
        const path = args.join(' ');
        if (context.fileSystemExplorer.changeDirectory(path)) {
            return `Directory changed to: ${cwd || '/'}`;
        }
        return `Directory not found: ${path}`;
    }
}

export default ChangeDirectory