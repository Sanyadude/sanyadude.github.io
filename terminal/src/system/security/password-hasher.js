import { HASH_ALGORITHM } from './hash-algorithm.js'

/**
 * PasswordHasher - Class for hashing and verifying passwords
 */
export class PasswordHasher {
    /**
     * Verifies a password against a hash
     * @param {string} password - The password to verify
     * @param {string} passwordHash - The hash to verify against
     * @returns {boolean} True if the password is verified, false otherwise
     */
    async verify(password, passwordHash) {
        const [algorithm, salt, hash] = passwordHash.split(':');
        if (!algorithm || !salt || !hash) return false;
        return passwordHash === await this.hash(password, salt, algorithm);
    }

    /**
     * Hashes a password
     * @param {string} password - The password to hash
     * @param {string} salt - The salt to use for hashing
     * @returns {string} The hash of the password
     */
    async hash(password, salt = null, algorithm = HASH_ALGORITHM.SHA_512) {
        if (!salt) {
            salt = this.generateSalt();
        }
        let hash = '';
        if (algorithm === HASH_ALGORITHM.SHA_256) {
            hash = await this._sha256(password + salt);
        } else if (algorithm === HASH_ALGORITHM.SHA_512) {
            hash = await this._sha512(password + salt);
        } else {
            throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
        return `${algorithm}:${salt}:${hash}`;
    }

    /**
     * Generates a random salt
     * @returns {string} The salt
     */
    generateSalt(length = 16) {
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        return Array.from(bytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Hashes a string using SHA-256
     * @param {string} text - The text to hash
     * @returns {string} The hash of the text
     */
    async _sha256(text) {
        const data = new TextEncoder().encode(text);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Hashes a string using SHA-512
     * @param {string} text - The text to hash
     * @returns {string} The hash of the text
     */
    async _sha512(text) {
        const data = new TextEncoder().encode(text);
        const hash = await crypto.subtle.digest('SHA-512', data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

}

export default PasswordHasher