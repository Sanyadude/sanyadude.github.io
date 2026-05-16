import Entry from './entry.js'

/**
 * DirectoryEntry - Represents a directory in the file system
 * @extends Entry
 */
export class DirectoryEntry extends Entry {
    /**
     * Creates a new directory entry
     * @param {string} name - The name of the directory
     */
    constructor(name) {
        super(name);
        this.entries = [];
    }

    /**
     * Gets all entries in the directory
     * @returns {Array} Array of entries
     */
    getEntries() {
        this.metadata.accessed = Date.now();
        return this.entries;
    }

    /**
     * Gets the number of entries in the directory
     * @returns {number} The number of entries
     */
    getEntryCount() {
        return this.entries.length;
    }

    /**
     * Gets an entry by name
     * @param {string} name - The name of the entry
     * @returns {Entry} The entry
     */
    getEntry(name) {
        this.metadata.accessed = Date.now();
        return this.entries.find(entry => entry.getName() === name);
    }

    /**
     * Adds an entry to the directory
     * @param {Entry} entry - The entry to add
     */
    addEntry(entry) {
        this.entries.push(entry);
        this.metadata.modified = Date.now();
        return this;
    }

    removeEntry(name) {
        const index = this.entries.findIndex(entry => entry.getName() === name);
        if (index !== -1) {
            this.entries.splice(index, 1);
            this.metadata.modified = Date.now();
        }
        return this;
    }

    /**
     * Gets the size of the directory
     * @returns {number} The size of the directory (sum of the sizes of the entries)
     */
    getSize() {
        return this.entries.reduce((size, entry) => size + entry.getSize(), 0);
    }

    /**
     * Checks if the directory is empty
     * @returns {boolean} True if the directory does not contain any directories or files, false otherwise
     */
    isEmpty() {
        return this.entries.length === 0;
    }

    /**
     * Checks if the entry is a directory
     * @returns {boolean} returns true
     */
    isDirectory() {
        return true;
    }

    /**
     * Clears directory content by removing all directories and files
     */
    clear() {
        this.entries.length = 0;
        this.metadata.modified = Date.now();
        return this;
    }
}

export default DirectoryEntry