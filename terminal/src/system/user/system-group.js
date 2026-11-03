import { UserValidation } from './user-validation.js'

/**
 * SystemGroup - Represents a user group
 */
export class SystemGroup {
    /**
     * Creates a new SystemGroup instance
     * @param {number} id The id of the group
     * @param {string} name The name of the group
     */
    constructor(id, name) {
        if (!UserValidation.validateGroupName(name)) {
            throw new Error(`Invalid group name: ${name}`);
        }
        this._id = id;
        this._name = name;
        this._userIds = new Set();
    }

    /**
     * Gets the id of the group
     * @returns {number} The id of the group
     */
    getId() {
        return this._id;
    }

    /**
     * Sets the name of the group
     * @param {string} name The name of the group
     */
    setName(name) {
        if (!UserValidation.validateGroupName(name)) {
            throw new Error(`Invalid group name: ${name}`);
        }
        this._name = name;
        return this;
    }

    /**
     * Gets the name of the group
     * @returns {string} The name of the group
     */
    getName() {
        return this._name;
    }

    /**
     * Adds a user id to the group
     * @param {number} userId The user id
     */
    addUserId(userId) {
        this._userIds.add(userId);
        return this;
    }

    /**
     * Removes a user id from the group
     * @param {number} userId The user id
     */
    removeUserId(userId) {
        this._userIds.delete(userId);
        return this;
    }

    /**
     * Gets the users of the group
     * @returns {number[]} The users of the group
     */
    getUserIds() {
        return Array.from(this._userIds);
    }
}

export default SystemGroup