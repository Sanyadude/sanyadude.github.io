/**
 * SystemUser - Represents a environment user
 */
export class SystemUser {
    /**
     * Creates a new SystemUser instance
     * @param {string} name - The name of the user
     */
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('User name must be a non-empty string');
        }
        this._name = name;
    }

    /**
     * Gets the name of the user
     * @returns {string} The name of the user
     */
    getName() {
        return this._name;
    }

    /**
     * Sets the name of the user
     * @param {string} name - The name of the user
     */
    setName(name) {
        this._name = name;
    }
}

export default SystemUser