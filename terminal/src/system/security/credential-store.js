/**
 * CredentialStore - Class for storing credentials
 */
export class CredentialStore {
    /**
     * Creates a new CredentialStore instance
     */
    constructor() {
        this._credentials = new Map();
    }

    /**
     * Sets a credential
     * @param {string} identifier - The identifier of the credential
     * @param {string} credential - The credential to store
     */
    set(identifier, credential) {
        this._credentials.set(identifier, credential);
    }

    /**
     * Gets a credential
     * @param {string} identifier - The identifier of the credential
     * @returns {string} The credential
     */
    get(identifier) {
        return this._credentials.get(identifier);
    }

    /**
     * Checks if a credential exists
     * @param {string} identifier - The identifier of the credential
     * @returns {boolean} True if the credential exists, false otherwise
     */
    has(identifier) {
        return this._credentials.has(identifier);
    }

    /**
     * Removes a credential
     * @param {string} identifier - The identifier of the credential
     */
    remove(identifier) {
        this._credentials.delete(identifier);
    }
}

export default CredentialStore