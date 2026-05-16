import { Application } from '../../system/application/application.js'
import { MAKE_DIRECTORY_MANIFEST } from './make-directory-manifest.js'

/**
 * MakeDirectory - Application for creating a new directory
 * @extends {Application}
 */
export class MakeDirectory extends Application {
    /**
     * Creates a new MakeDirectory instance
     */
    constructor() {
        super('make-directory', MAKE_DIRECTORY_MANIFEST);
    }

    /**
     * Executes the `md` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the md/mkdir command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        if (args.length === 0) return 'Path should be specified';
        const path = args.join(' ');
        const fullPath = context.fileSystemExplorer.getAbsolutePath(path);
        context.fileSystemManager.createDirectory(fullPath);
        return `Directory created: ${fullPath}`;
    }
}

export default MakeDirectory