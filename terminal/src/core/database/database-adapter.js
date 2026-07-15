const notImplementedError = (className, methodName) => {
    throw new Error(
        `${className} must implement ${methodName}()`
    );
}
/**
 * Base database adapter.
 *
 * All database adapters should extend this class and implement
 * the required methods.
 */
export class DatabaseAdapter {
    /**
     * Creates a new database adapter.
     * @param {object} options - The options for the database adapter
     * @returns {DatabaseAdapter} The database adapter instance
     */
    constructor(options = {}) {
        this._options = options;
    }

    /**
     * Opens the database.
     * @returns {Promise<void>}
     */
    async open() {
        notImplementedError(this.constructor.name, 'open');
    }

    /**
     * Closes the database connection.
     * @returns {Promise<void>}
     */
    async close() {
        notImplementedError(this.constructor.name, 'close');
    }

    /**
     * Gets a value from the database.
     * @param {string} store - The store to get the value from
     * @param {string} key - The key to get the value from
     * @returns {Promise<any>}
     */
    async get(store, key) {
        notImplementedError(this.constructor.name, 'get');
    }

    /**
     * Gets all values from the database.
     * @param {string} store - The store to get the values from
     * @returns {Promise<Array>}
     */
    async getAll(store) {
        notImplementedError(this.constructor.name, 'getAll');
    }

    /**
     * Checks if a value exists in the database.
     * @param {string} store - The store to check the value in
     * @param {string} key - The key to check the value in
     * @returns {Promise<boolean>}
     */
    async has(store, key) {
        notImplementedError(this.constructor.name, 'has');
    }

    /**
     * Puts a value into the database.
     * @param {string} store - The store to put the value into
     * @param {any} value - The value to put into the database
     * @param {string} key - The key to put the value into
     * @returns {Promise<void>}
     */
    async put(store, value, key) {
        notImplementedError(this.constructor.name, 'put');
    }

    /**
     * Deletes a value from the database.
     * @param {string} store - The store to delete the value from
     * @param {string} key - The key to delete the value from
     * @returns {Promise<void>}
     */
    async delete(store, key) {
        notImplementedError(this.constructor.name, 'delete');
    }

    /**
     * Clears a store from the database.
     * @param {string} store - The store to clear from the database
     * @returns {Promise<void>}
     */
    async clear(store) {
        notImplementedError(this.constructor.name, 'clear');
    }

    /**
     * Destroys the database.
     * @returns {Promise<void>}
     */
    async destroy() {
        notImplementedError(this.constructor.name, 'destroy');
    }
}

export default DatabaseAdapter