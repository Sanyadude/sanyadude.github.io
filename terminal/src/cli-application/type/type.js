import { Application } from '../../system/application/application.js'
import { TYPE_MANIFEST } from './type-manifest.js'

/**
 * Type - Application for displaying the contents of a file
 * @extends {Application}
 */
export class Type extends Application {
    /**
     * Creates a new Type instance
     */
    constructor() {
        super('type', TYPE_MANIFEST);
    }

    /**
     * Executes the `type` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the TYPE command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        if (args.length === 0) return 'Path should be specified';
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const outputs = [];
        for (const path of args) {
            if (path === 'nul') {
                outputs.push('');
                continue;
            }
            const fullPath = fsExplorer.getAbsolutePath(path);
            if (!fsManager.fileExists(fullPath)) return `File not found: ${fullPath}`;
            const file = fsManager.getFile(fullPath);
            if (!file) return `File not found: ${path}`;
            outputs.push(file.readAsString());
        }
        return outputs.join('\n');
    }
}

export default Type