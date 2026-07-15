import { DatabaseAdapter } from './database-adapter.js'

/**
 * IndexedDatabaseAdapter - A class for interacting with the IndexedDB API
 */
export class IndexedDatabaseAdapter extends DatabaseAdapter {
    /**
     * Creates a new IndexedDatabaseAdapter instance
     * @param {object} options - The options for the IndexedDatabaseAdapter
     * @returns {IndexedDatabaseAdapter} The IndexedDatabaseAdapter instance
     */
    constructor(options = {}) {
        const defaultOptions = {
            name: 'database',
            version: 1,
            stores: [],
        };
        super({ ...defaultOptions, ...(options || {}) });
        this._db = null;
        this._opening = null;
    }

    /**
     * Creates a request and returns the result.
     * @param {string} store - The store to create a request for
     * @param {'readonly'|'readwrite'} mode - The mode to create the request in
     * @param {function} callback - The callback to create the request
     * @returns {Promise<any>} The result of the request
     * @private
     */
    async _request(store, mode, callback) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(store, mode);
            const objectStore = transaction.objectStore(store);
            const request = callback(objectStore);
            request.onsuccess = () => {
                resolve(request.result)
            };
            request.onerror = () => {
                reject(request.error)
            };
        });
    }

    /**
     * Opens the database.
     */
    async open() {
        if (this._db) return this._db;
        if (this._opening) return this._opening;
        this._opening = new Promise((resolve, reject) => {
            const request = indexedDB.open(
                this._options.name,
                this._options.version
            );
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                for (const store of this._options.stores) {
                    if (db.objectStoreNames.contains(store)) continue;
                    db.createObjectStore(store);
                }
            };
            request.onsuccess = (event) => {
                this._db = event.target.result;
                this._opening = null;
                resolve(this._db);
            };
            request.onerror = () => {
                this._opening = null;
                reject(request.error);
            };
        });
        return this._opening;
    }

    /**
    * Closes the database.
    */
    async close() {
        if (!this._db) return;
        this._db.close();
        this._db = null;
    }

    /**
     * Gets a value from the database.
     * @param {string} store - The store to get the value from
     * @param {string} key - The key to get the value from
     * @returns {Promise<any>} The value
     */
    async get(store, key) {
        return this._request(store, 'readonly', (objectStore) => objectStore.get(key));
    }

    /**
     * Gets all values from the database.
     * @param {string} store - The store to get the values from
     * @returns {Promise<Array>} The values
     */
    async getAll(store) {
        return this._request(store, 'readonly', (objectStore) => objectStore.getAll());
    }

    /**
     * Checks if a value exists in the database.
     * @param {string} store - The store to check the value in
     * @param {string} key - The key to check the value in
     * @returns {Promise<boolean>} The value
     */
    async has(store, key) {
        const count = await this._request(store, 'readonly', (objectStore) => objectStore.count(key));
        return count > 0;
    }

    /**
     * Puts a value into the database.
     * @param {string} store - The store to put the value into
     * @param {any} value - The value to put into the database
     * @param {string} key - The key to put the value into
     * @returns {Promise<any>} The value
     */
    async put(store, value, key) {
        return this._request(store, 'readwrite', (objectStore) =>
            key === undefined
                ? objectStore.put(value)
                : objectStore.put(value, key)
        );
    }

    /**
     * Deletes a value from the database.
     * @param {string} store - The store to delete the value from
     * @param {string} key - The key to delete the value from
     * @returns {Promise<void>}
     */
    async delete(store, key) {
        return this._request(store, 'readwrite', (objectStore) => objectStore.delete(key));
    }

    /**
     * Clears a store from the database.
     * @param {string} store - The store to clear from the database
     * @returns {Promise<void>}
     */
    async clear(store) {
        return this._request(store, 'readwrite', (objectStore) => objectStore.clear());
    }

    /**
     * Destroys the database.
     * @returns {Promise<void>}
     */
    async destroy() {
        await this.close();
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this._options.name);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = () => {
                reject(request.error);
            };
            request.onblocked = () => {
                reject(new Error(`Database "${this._options.name}" is blocked by another connection`));
            };
        });
    }
}

export default IndexedDatabaseAdapter