/**
 * ConfigProvider - A class for managing configurations
 */
export class ConfigProvider {
    /**
     * Creates a new ConfigProvider instance
     * @param {object} configs - The initial configs
     * @param {function} onChange - The function to call when the config provider changes
     */
    constructor(configs = {}, onChange = null) {
        this._configs = new Map(Object.entries(configs));
        this._onChange = onChange;
    }

    /**
     * Sets a config to the config provider
     * @param {string} name - The name of the config
     * @param {object} config - The config to set
     * @returns {ConfigProvider} - The config provider instance
     */
    set(name, config) {
        this._configs.set(name, config);
        this._onChange?.(this);
        return this;
    }

    /**
     * Removes a config from the config provider
     * @param {string} name - The name of the config
     * @returns {ConfigProvider} - The config provider instance
     */
    remove(name) {
        this._configs.delete(name);
        this._onChange?.(this);
        return this;
    }

    /**
     * Gets a config from the config provider
     * @param {string} name - The name of the config
     * @returns {object} - The config
     */
    get(name) {
        return this._configs.get(name);
    }

    /**
     * Checks if a config is registered by name
     * @param {string} name - The name of the config
     * @returns {boolean} - True if the config is registered, false otherwise
     */
    has(name) {
        return this._configs.has(name);
    }

    /**
     * Converts the config provider to a JSON object
     * @returns {object} - The JSON object
     */
    toJSON() {
        return Object.fromEntries(this._configs);
    }

    /**
     * Creates a new ConfigProvider instance from a JSON object
     * @param {object} value - The JSON object
     * @param {function} onChange - The function to call when the config provider changes
     * @returns {ConfigProvider} - The config provider instance
     */
    static fromJSON(value, onChange = null) {
        return new ConfigProvider(value, onChange);
    }
}

export default ConfigProvider