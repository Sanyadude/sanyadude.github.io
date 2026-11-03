import { UserValidation } from './user-validation.js'
import { DEFAULT_HOME_PATH } from '../../config/user-config.js'

/**
 * SystemUser - Represents an environment user account
 */
export class SystemUser {
    /**
     * Creates a new SystemUser instance
     * @param {number} id The id of the user
     * @param {string} name The name of the user
     * @param {number} groupId Primary group id
     * @param {string} home Home directory path
     */
    constructor(id, name, groupId, home) {
        if (!UserValidation.validateUserName(name)) {
            throw new Error(`Invalid user name: ${name}`);
        }
        this._id = id;
        this._name = name;
        this._groupId = groupId;
        this._home = home || `${DEFAULT_HOME_PATH}/${name}`;
    }

    /**
     * Gets the id of the user
     * @returns {number} The id of the user
     */
    getId() {
        return this._id;
    }

    /**
     * Sets the name of the user
     * @param {string} name The name of the user
     */
    setName(name) {
        if (!UserValidation.validateUserName(name)) {
            throw new Error(`Invalid user name: ${name}`);
        }
        this._name = name;
        return this;
    }

    /**
     * Gets the name of the user
     * @returns {string} The name of the user
     */
    getName() {
        return this._name;
    }

    /**
     * Sets the primary group id
     * @param {number} groupId The group id
     * @returns {SystemUser} The user
     */
    setGroupId(groupId) {
        this._groupId = groupId;
        return this;
    }

    /**
     * Gets the primary group id
     * @returns {number|null} The group id
     */
    getGroupId() {
        return this._groupId;
    }

    /**
     * Sets the home directory path
     * @param {string} home The home directory path
     */
    setHome(home) {
        this._home = home;
        return this;
    }

    /**
     * Gets the home directory path
     * @returns {string} The home directory path
     */
    getHome() {
        return this._home;
    }
}

export default SystemUser