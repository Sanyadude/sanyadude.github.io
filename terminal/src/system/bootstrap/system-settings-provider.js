import { SystemUser } from '../user/system-user.js'
import { SystemHost } from '../host/system-host.js'
import { SystemTime } from '../datetime/system-time.js'

/**
 * SystemSettingsProvider - A class for managing environment settings
 */
export class SystemSettingsProvider {
    /**
     * Creates a new SystemSettingsProvider instance
     * @param {string} user - The user of the environment
     * @param {string} hostName - The name of the host
     * @param {string} hostAddress - The address of the host
     */
    constructor(user, hostName, hostAddress) {
        this._user = new SystemUser(user);
        this._host = new SystemHost(hostName, hostAddress);
        this._time = new SystemTime();

        this._settings = new Map();
    }

    /**
     * Gets the user of the environment
     * @returns {SystemUser} - The user of the environment
     */
    getUser() {
        return this._user;
    }

    /**
     * Gets the host of the environment
     * @returns {SystemHost} - The host of the environment
     */
    getHost() {
        return this._host;
    }

    /**
     * Gets the time of the environment
     * @returns {SystemTime} - The time of the environment
     */
    getTime() {
        return this._time;
    }

    /**
     * Adds a setting to the provider
     * @param {string} name - The name of the setting
     * @param {object} setting - The setting to add
     */
    add(name, setting) {
        this._settings.set(name, setting);
    }

    /**
     * Removes a setting from the provider
     * @param {string} name - The name of the setting
     */
    remove(name) {
        this._settings.delete(name);
    }

    /**
     * Gets a setting from the provider
     * @param {string} name - The name of the setting
     * @returns {object} - The setting
     */
    get(name) {
        return this._settings.get(name);
    }
}

export default SystemSettingsProvider