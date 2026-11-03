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
     * @param {object} options The options for the database adapter
     * @returns {DatabaseAdapter} The database adapter instance
     */
    constructor(options = {}) {
        this._options = options;
    }

    /**
     * Opens the database.
     * @returns {Promise<void>} The promise to open the database
     */
    async open() {
        notImplementedError(this.constructor.name, 'open');
    }

    /**
     * Closes the database connection.
     * @returns {Promise<void>} The promise to close the database connection
     */
    async close() {
        notImplementedError(this.constructor.name, 'close');
    }

    /**
     * Gets a value from the database.
     * @param {string} store The store to get the value from
     * @param {string} key The key to get the value from
     * @returns {Promise<any>} The promise to get the value from the database
     */
    async get(store, key) {
        notImplementedError(this.constructor.name, 'get');
    }

    /**
     * Gets all values from the database.
     * @param {string} store The store to get the values from
     * @returns {Promise<Array>} The promise to get all values from the database
     */
    async getAll(store) {
        notImplementedError(this.constructor.name, 'getAll');
    }

    /**
     * Checks if a value exists in the database.
     * @param {string} store The store to check the value in
     * @param {string} key The key to check the value in
     * @returns {Promise<boolean>} The promise to check if the value exists in the database
     */
    async has(store, key) {
        notImplementedError(this.constructor.name, 'has');
    }

    /**
     * Puts a value into the database.
     * @param {string} store The store to put the value into
     * @param {any} value The value to put into the database
     * @param {string} key The key to put the value into
     * @returns {Promise<void>} The promise to put the value into the database
     */
    async put(store, value, key) {
        notImplementedError(this.constructor.name, 'put');
    }

    /**
     * Deletes a value from the database.
     * @param {string} store The store to delete the value from
     * @param {string} key The key to delete the value from
     * @returns {Promise<void>} The promise to delete the value from the database
     */
    async delete(store, key) {
        notImplementedError(this.constructor.name, 'delete');
    }

    /**
     * Clears a store from the database.
     * @param {string} store The store to clear from the database
     * @returns {Promise<void>} The promise to clear the store from the database
     */
    async clear(store) {
        notImplementedError(this.constructor.name, 'clear');
    }

    /**
     * Destroys the database.
     * @returns {Promise<void>} The promise to destroy the database
     */
    async destroy() {
        notImplementedError(this.constructor.name, 'destroy');
    }
}

export default DatabaseAdapter