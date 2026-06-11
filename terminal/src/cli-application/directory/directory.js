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
        const args = commandLine.getArguments();
        const path = args.join(' ');
        const cwd = context.fileSystemExplorer.getCurrentPath();
        const entries = context.fileSystemManager.getEntriesAt(path ? path : cwd);
        if (entries.length === 0) return '';
        const lines = this._getDirectoryInfo(entries, options);
        return lines.join('\n');
    }

    /**
     * Gets the directory information
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array} - The directory information
     */
    _getDirectoryInfo(entries, options) {
        let filteredEntries = entries;
        filteredEntries = this._applyHiddenFilter(filteredEntries, options);
        filteredEntries = this._applyTypeFilter(filteredEntries, options);
        filteredEntries = this._applySort(filteredEntries, options);
        const lines = this._getLines(filteredEntries, options);
        return lines;
    }

    /**
     * Applies the hidden filter to the entries
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The filtered entries
     */
    _applyHiddenFilter(entries, options) {
        const showHidden = options['hidden'] || false;
        if (showHidden) return entries;
        return entries.filter(entry => !entry.getMetadataField('hidden'));
    }

    /**
     * Applies the type filter to the entries
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The filtered entries
     */
    _applyTypeFilter(entries, options) {
        const showDirectories = options['directories'] || false;
        const showFiles = options['files'] || false;
        if (showDirectories && showFiles) return entries;
        if (showDirectories) return entries.filter(entry => entry.isDirectory());
        if (showFiles) return entries.filter(entry => !entry.isDirectory());
        return entries;
    }

    /**
     * Applies the sort option to the entries
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The sorted entries
     */
    _applySort(entries, options) {
        const sortField = options['sort'];
        if (typeof sortField !== 'string' || sortField.length === 0) return entries;
        const field = sortField[0];
        const order = sortField[1] === 'd' ? 'desc' : 'asc';
        return entries.sort((a, b) => {
            const itemA = order === 'asc' ? a : b;
            const itemB = order === 'asc' ? b : a;
            if (field === 'n') return itemA.getName().localeCompare(itemB.getName());
            if (field === 's') return itemA.getSize() - itemB.getSize();
            if (field === 'd') return itemA.getCreated() - itemB.getCreated();
            return 0;
        });
    }

    /**
     * Gets the lines of the directory information
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array} - The lines of the directory information
     */
    _getLines(entries, options) {
        const showBare = options['bare'] || false;
        const lines = [];
        for (const entry of entries) {
            lines.push(this._formatEntry(entry, options));
        }
        if (!showBare) {
            lines.push(`${entries.filter(entry => entry.isDirectory()).length} Dir(s)`);
            lines.push(`${entries.filter(entry => !entry.isDirectory()).length} File(s)`);
        }
        return lines;
    }

    /**
     * Formats the entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {object} options - The options
     * @returns {string} - The formatted entry
     */
    _formatEntry(entry, options) {
        const spaceString = ' ';
        const padValue = (value, length) => value.toString().padStart(length, spaceString);
        const showBare = options['bare'] || false;
        const thousandSeparator = options['thousand-separator'] ? ' ' : '';
        const useLowerCase = options['lowercase'] || false;
        if (showBare) return entry.getName();
        const entryDate = this._formatDate(entry.getCreated());
        const entryName = useLowerCase ? entry.getName().toLowerCase() : entry.getName();
        const entrySize = padValue(String(entry.getSize()).replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator), 16);
        if (entry.isDirectory()) {
            return `${entryDate} [DIR]${spaceString.repeat(2)} ${entrySize} ${entryName}`;
        }
        return `${entryDate} [FILE]${spaceString} ${entrySize} ${entryName}`;
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