import FileEntry from './file-entry.js'
import DirectoryEntry from './directory-entry.js'

/**
 * EntryPath - Represents a path to an entry in the file system
 */
export class EntryPath {
    /**
     * Creates a new entry path
     * @param {FileEntry|DirectoryEntry} entry - The entry to represent
     * @param {string} path - The path to the entry
     */
    constructor(entry, path = '') {
        this.entry = entry;
        this.path = path;
    }

    /**
     * Gets the entry
     * @returns {FileEntry|DirectoryEntry} The entry
     */
    getEntry() {
        return this.entry;
    }

    /**
     * Gets the path
     * @returns {string} The path
     */
    getPath() {
        return this.path;
    }

}

export default EntryPath