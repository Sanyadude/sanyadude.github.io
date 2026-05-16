import { Application } from '../../system/application/application.js'
import { DIRECTORY_MANIFEST } from './directory-manifest.js'

/**
 * Directory - Application for listing directory contents
 * @extends {Application}
 */
export class Directory extends Application {
    /**
     * Creates a new Directory instance
     */
    constructor() {
        super('directory', DIRECTORY_MANIFEST);
    }

    /**
     * Executes the `dir` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the dir command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const cwd = context.fileSystemExplorer.getCurrentPath();
        const directories = context.fileSystemManager.getDirectoriesAt(cwd);
        const files = context.fileSystemManager.getFilesAt(cwd);
        if (files.length === 0 && directories.length === 0) return 'Directory is empty';
        const lines = this._getDirectoryInfo(directories, files, options);
        return lines.join('\n');
    }

    /**
     * Gets the directory information
     * @param {Array} directories - The directories
     * @param {Array} files - The files
     * @param {object} options - The options
     * @returns {Array} - The directory information
     */
    _getDirectoryInfo(directories, files, options) {
        const showList = options['list'] || false;
        const showHidden = options['all'] || false;
        const spaceString = ' ';
        const padValue = (value, length) => value.toString().padStart(length, spaceString);
        const filteredDirectories = showHidden ? directories : directories.filter(dir => !dir.getMetadataField('hidden'));
        const filteredFiles = showHidden ? files : files.filter(file => !file.getMetadataField('hidden'));
        const lines = [];
        if (showList) {
            for (const dir of filteredDirectories) {
                lines.push(`${dir.getName()}/`);
            }
            for (const file of filteredFiles) {
                lines.push(`${file.getName()}`);
            }
        } else {
            for (const dir of filteredDirectories) {
                lines.push(`${this._formatDate(dir.getCreated())} [DIR]${spaceString.repeat(2)}[${padValue(dir.getSize(), 12)}] ${dir.getName()}/`);
            }
            for (const file of filteredFiles) {
                lines.push(`${this._formatDate(file.getCreated())} [FILE]${spaceString}[${padValue(file.getSize(), 12)}] ${file.getName()}`);
            }
            lines.push(`${filteredFiles.length} File(s)`);
            lines.push(`${filteredDirectories.length} Dir(s)`);
        }
        return lines;
    }

    /**
     * Formats the date
     * @param {number} timestamp - The timestamp to format
     * @returns {string} - The formatted date
     */
    _formatDate(timestamp) {
        const pad = (value) => value.toString().padStart(2, '0');
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default Directory