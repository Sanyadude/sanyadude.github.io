/**
 * ShellProgramOption - Represents an option for a Shell program
 */
export class ShellProgramOption {
    /**
     * Creates a new Shell program option
     * @param {string} definition - The definition of the option
     * @param {string} description - The description of the option
     * @param {string} defaultValue - The default value of the option
     */
    constructor(definition, description = '', defaultValue = null) {
        if (!definition || typeof definition !== 'string') {
            throw new Error('Option definition must be a non-empty string');
        }
        this._definition = definition;
        this._description = description || '';
        this._defaultValue = defaultValue || null;

        this._short = null;
        this._long = null;
        this._name = null;

        this._required = false;
        this._valueName = null;
        this._valueRequired = false;

        this._parseDefinition();
    }

    /**
     * Parses the option definition string
     * @private
     */
    _parseDefinition() {
        let definition = this._definition.trim();
        const parts = definition.split(',').map(p => p.trim());
        for (const part of parts) {
            // Match short flag: -s
            const shortMatch = part.match(/^-([a-zA-Z])(?:\s|$)/);
            if (shortMatch && !this._short) {
                this._short = shortMatch[1];
                // Remove the short flag from the part for further processing
                definition = part.substring(shortMatch[0].length).trim();
                continue;
            }
            // Match long flag: --long
            const longMatch = part.match(/^--([a-zA-Z][\w-]*)/);
            if (longMatch && !this._long) {
                this._long = longMatch[1];
                // Get the rest after the long flag for value parsing
                definition = part.substring(longMatch[0].length).trim();
                continue;
            }
        }
        this._name = this._long || this._short;
        if (!this._name) {
            throw new Error(`Invalid option definition: ${this._definition}`);
        }
        const requiredMatch = definition.match(/<([\w-]+)>/);
        if (requiredMatch) {
            this._valueName = requiredMatch[1];
            this._valueRequired = true;
        }
        const optionalMatch = definition.match(/\[<?([\w-]+)>?\]/);
        if (optionalMatch) {
            this._valueName = optionalMatch[1];
            this._valueRequired = false;
        }
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
     * @returns {string} - The default value of the option
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
     * Checks if the option is a short option
     * @returns {boolean} - True if the option is a short option, false otherwise
     */
    isShort() {
        return this._short !== null;
    }

    /**
     * Checks if the option is a long option
     * @returns {boolean} - True if the option is a long option, false otherwise
     */
    isLong() {
        return this._long !== null;
    }

    /**
     * Gets the value name
     * @returns {string} - The value name
     */
    getValueName() {
        return this._valueName;
    }

    /**
     * Checks if the value is required
     * @returns {boolean} - True if the value is required, false otherwise
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

    /**
     * Returns a verbose name of the option
     * @returns {string} - A verbose name of the option
     */
    getVerboseName() {
        const parts = [];
        if (this._short && this._long) {
            parts.push(`-${this._short}, --${this._long}`);
        } else if (this._short) {
            parts.push(`-${this._short}`);
        } else if (this._long) {
            parts.push(`--${this._long}`);
        }
        if (this._valueName) {
            parts.push(this.isValueRequired() ? `<${this._valueName}>` : `[<${this._valueName}>]`);
        }
        return parts.join(' ');
    }

    /**
     * Returns a verbose description of the option
     * @returns {string} - A verbose description of the option
     */
    getVerboseDescription() {
        return `${this._description}${this.hasDefault() ? ` [default: ${this._defaultValue}]` : ''}`;
    }

    /**
     * Returns a string representation of the option
     * @returns {string} - A string representation of the option
     */
    toString() {
        return this.isLong() ? `--${this._long}` : `-${this._short}`;
    }
}

export default ShellProgramOption