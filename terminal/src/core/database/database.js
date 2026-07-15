/**
 * Database - A class for interacting with the database
 */
export class Database {
    /**
     * Creates a new Database instance
     * @param {object} adapter - The adapter for the database
     * @returns {Database} The database instance
     */
    constructor(adapter) {
        if (!adapter) {
            throw new Error('Database adapter is required');
        }
        this._adapter = adapter;
    }

    /**
     * Opens the database
     * @returns {Promise} The promise that resolves to the database
     */
    async open() {
        return this._adapter.open();
    }

    /**
     * Closes the database
     * @returns {Promise} The promise that resolves to the database
     */
    async close() {
        return this._adapter.close();
    }

    /**
     * Gets a value from the database
     * @param {string} store - The store to get the value from
     * @param {string} key - The key to get the value from
     * @returns {Promise} The promise that resolves to the value
     */
    async get(store, key) {
        return this._adapter.get(store, key);
    }

    /**
     * Gets all values from the database
     * @param {string} store - The store to get the values from
     * @returns {Promise} The promise that resolves to the values
     */
    async getAll(store) {
        return this._adapter.getAll(store);
    }

    /**
     * Checks if a value exists in the database
     * @param {string} store - The store to check the value in
     * @param {string} key - The key to check the value in
     * @returns {Promise} The promise that resolves to the value
     */
    async has(store, key) {
        return this._adapter.has(store, key);
    }

    /**
     * Puts a value into the database
     * @param {string} store - The store to put the value into
     * @param {any} value - The value to put into the database
     * @param {string} key - The key to put the value into
     * @returns {Promise} The promise that resolves to the value
     */
    async put(store, value, key) {
        return this._adapter.put(store, value, key);
    }

    /**
     * Deletes a value from the database
     * @param {string} store - The store to delete the value from
     * @param {string} key - The key to delete the value from
     * @returns {Promise} The promise that resolves to the value
     */
    async delete(store, key) {
        return this._adapter.delete(store, key);
    }

    /**
     * Clears a store from the database
     * @param {string} store - The store to clear from the database
     * @returns {Promise} The promise that resolves to the database
     */
    async clear(store) {
        return this._adapter.clear(store);
    }

    /**
     * Destroys the database
     * @returns {Promise} The promise that resolves to the database
     */
    async destroy() {
        return this._adapter.destroy();
    }
}

export default Database