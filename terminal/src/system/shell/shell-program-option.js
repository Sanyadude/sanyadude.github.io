/**
 * ShellProgramOption - Represents an option for a Shell program
 */
export class ShellProgramOption {
    /**
     * Creates a new Shell program option
     * @param {object} spec - The option specification
     */
    constructor(spec = {}) {
        if (!spec.name || typeof spec.name !== 'string') {
            throw new Error('Option name must be a non-empty string');
        }
        if (!/^[a-zA-Z0-9][\w-]*$/.test(spec.name)) {
            throw new Error(`Invalid option name: ${spec.name}`);
        }
        if (!spec.short && !spec.long) {
            throw new Error(`Option "${spec.name}" must define a short or long name`);
        }
        if (spec.short !== null && spec.short !== undefined
            && (typeof spec.short !== 'string' || !/^[a-zA-Z0-9]$/.test(spec.short))) {
            throw new Error(`Invalid short option name: ${spec.short}`);
        }
        if (spec.long !== null && spec.long !== undefined
            && (typeof spec.long !== 'string' || !/^[a-zA-Z0-9][\w-]*$/.test(spec.long))) {
            throw new Error(`Invalid long option name: ${spec.long}`);
        }
        if (spec.value !== null && spec.value !== undefined
            && (!spec.value.name || typeof spec.value.name !== 'string'
                || !/^[a-zA-Z0-9][\w-]*$/.test(spec.value.name))) {
            throw new Error(`Option "${spec.name}" value name must be a non-empty string`);
        }

        this._name = spec.name;
        this._short = spec.short || null;
        this._long = spec.long || null;
        this._description = spec.description || '';
        this._defaultValue = spec.defaultValue ?? null;
        this._valueName = spec.value?.name || null;
        this._valueRequired = this._valueName !== null && spec.value.required !== false;
    }

    /**
     * Returns the name of the option
     * @returns {string} - The name of the option
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the short name of the option
     * @returns {string|null} - The short name or null if not defined
     */
    getShort() {
        return this._short;
    }

    /**
     * Returns the long name of the option
     * @returns {string|null} - The long name or null if not defined
     */
    getLong() {
        return this._long;
    }

    /**
     * Returns the description of the option
     * @returns {string} - The description of the option
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns the default value of the option
     * @returns {*} - The default value of the option
     */
    getDefaultValue() {
        return this._defaultValue;
    }

    /**
     * Checks if the option is a flag
     * @returns {boolean} - True if the option is a flag, false otherwise
     */
    isFlag() {
        return this._valueName === null;
    }

    /**
     * Gets the value name
     * @returns {string|null} - The value name
     */
    getValueName() {
        return this._valueName;
    }

    /**
     * Checks if the option value is required
     * @returns {boolean} - True if the option takes a required value
     */
    isValueRequired() {
        return this._valueRequired;
    }

    /**
     * Checks if the option has a default value
     * @returns {boolean} - True if the option has a default value, false otherwise
     */
    hasDefault() {
        return this._defaultValue !== null;
    }
}

export default ShellProgramOption