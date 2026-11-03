import { PasswordHasher } from './password-hasher.js'

/**
 * AuthenticationManager - Class for managing authentication
 */
export class AuthenticationManager {
    /**
     * Creates a new AuthenticationManager instance
     */
    constructor(userManager, credentialStore) {
        this._userManager = userManager;
        this._credentialStore = credentialStore;
        this._passwordHasher = new PasswordHasher();
    }

    /**
     * Sets a password for a user
     * @param {string} userName - The name of the user
     * @param {string} password - The password to set
     */
    async setPassword(userName, password) {
        const user = this._userManager.getUserByName(userName);
        if (!user) {
            throw new Error(`User ${userName} does not exist`);
        }
        const credential = await this._passwordHasher.hash(password);
        this._credentialStore.set(userName, credential);
    }

    /**
     * Removes a password for a user
     * @param {string} userName - The name of the user
     */
    removePassword(userName) {
        this._credentialStore.remove(userName);
    }

    /**
     * Checks whether a user has a password
     * @param {string} userName - The name of the user
     * @returns {boolean} True when a password is stored for the user
     */
    hasPassword(userName) {
        return this._credentialStore.has(userName);
    }

    /**
     * Authenticates a user
     * @param {string} userName - The name of the user
     * @param {string} password - The password to authenticate
     * @returns {boolean} True if the authentication is successful, false otherwise
     */
    async authenticate(userName, password) {
        const credential = this._credentialStore.get(userName);
        if (!credential) return false;
        return this._passwordHasher.verify(password, credential);
    }
}

export default AuthenticationManager