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
            author: 'root',
            owner: 'root',
            group: 'root',
            created: now,
            modified: now,
            accessed: now,
            changed: now,
            hidden: false,
            permissions: 'rw-rw-rw-'
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
     * Gets the author of the entry
     * @returns {string} The author of the entry
     */
    getAuthor() {
        return this.metadata.author;
    }

    /**
     * Gets the owner of the entry
     * @returns {string} The owner of the entry
     */
    getOwner() {
        return this.metadata.owner;
    }

    /**
     * Gets the group of the entry
     * @returns {string} The group of the entry
     */
    getGroup() {
        return this.metadata.group;
    }

    /**
     * Gets the created time of the entry (time the entry was created)
     * @returns {number} The created time of the entry
     */
    getCreated() {
        return this.metadata.created;
    }

    /**
     * Gets the accessed time of the entry (last time the entry was accessed/read)
     * @returns {number} The accessed time of the entry
     */
    getAccessed() {
        return this.metadata.accessed;
    }

    /**
     * Gets the modified time of the entry (last time the contents were modified)
     * @returns {number} The modified time of the entry
     */
    getModified() {
        return this.metadata.modified;
    }

    /**
     * Gets the changed time of the entry (last time the metadata/status was changed)
     * @returns {number} The changed time of the entry
     */
    getChanged() {
        return this.metadata.changed;
    }

    /**
     * Gets the permissions of the entry
     * @returns {string} The permissions of the entry
     */
    getPermissions() {
        return this.metadata.permissions;
    }

    /**
     * Checks if the entry is hidden
     * @returns {boolean} returns false by default
     */
    isHidden() {
        return this.metadata.hidden;
    }

    /**
     * Checks if the entry is a directory
     * @returns {boolean} returns false by default
     */
    isDirectory() {
        return false;
    }

    /**
     * Checks if the entry is a file
     * @returns {boolean} returns false by default
     */
    isFile() {
        return false;
    }

}

export default Entry;