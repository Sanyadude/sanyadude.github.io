/**
 * Entry - Represents a file or directory in the file system
 * @abstract
 */
export class Entry {
    /**
     * Creates a new entry
     * @param {string} name - The name of the entry (file or directory)
     */
    constructor(name) {
        this.name = name;

        const now = Date.now();
        this.metadata = {
            created: now,
            modified: now,
            accessed: now,
            hidden: false
        };
    }

    /**
     * Gets the name of the entry (file or directory)
     * @returns {string} The name of the entry (file or directory)
     */
    getName() {
        return this.name;
    }

    /**
     * Renames the entry
     * @param {string} name - The new name of the entry
     */
    rename(name) {
        this.name = name;
        this.metadata.modified = Date.now();
        return this;
    }

    /**
     * Gets all metadata
     * @returns {Object} Metadata object
     */
    getMetadata() {
        return { ...this.metadata };
    }

    /**
     * Sets metadata (merges with existing metadata)
     * @param {object} metadata - Metadata to set
     */
    setMetadata(metadata) {
        if (typeof metadata !== 'object' || metadata === null) {
            throw new Error('Metadata must be an object');
        }
        this.metadata = { ...this.metadata, ...metadata };
        return this;
    }

    /**
     * Gets a specific metadata field
     * @param {string} key - Metadata key
     * @returns {*} Metadata value or undefined
     */
    getMetadataField(key) {
        return this.metadata[key];
    }

    /**
     * Sets a specific metadata field
     * @param {string} key - Metadata key
     * @param {*} value - Metadata value
     */
    setMetadataField(key, value) {
        this.metadata[key] = value;
        return this;
    }

    /**
     * Gets the created time of the entry
     * @returns {number} The created time of the entry
     */
    getCreated() {
        return this.metadata.created;
    }

    /**
     * Gets the accessed time of the entry
     * @returns {number} The accessed time of the entry
     */
    getAccessed() {
        return this.metadata.accessed;
    }

    /**
     * Gets the modified time of the entry
     * @returns {number} The modified time of the entry
     */
    getModified() {
        return this.metadata.modified;
    }

    /**
     * Checks if the entry is a directory
     * @returns {boolean} returns false by default
     */
    isDirectory() {
        return false;
    }

}

export default Entry;