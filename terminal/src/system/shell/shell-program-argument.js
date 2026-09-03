/**
 * ShellProgramArgument - Represents a argument for a Shell program
 */
export class ShellProgramArgument {
    /**
     * Creates a new Shell program argument
     * @param {object} spec - The argument specification
     */
    constructor(spec = {}) {
        if (!spec.name || typeof spec.name !== 'string') {
            throw new Error('Argument name must be a non-empty string');
        }
        if (!/^[a-zA-Z0-9][\w-]*$/.test(spec.name)) {
            throw new Error(`Invalid argument name: ${spec.name}`);
        }
        this._name = spec.name;
        this._description = spec.description || '';
        this._required = spec.required !== false;
        this._repeatable = spec.repeatable === true;
    }

    /**
     * Returns the name of the argument
     * @returns {string} - The name of the argument
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the description of the argument
     * @returns {string} - The description of the argument
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns if the argument is required
     * @returns {boolean} - True if the argument is required, false otherwise
     */
    isRequired() {
        return this._required;
    }

    /**
     * Returns if the argument can be repeated
     * @returns {boolean} - True if the argument can appear more than once
     */
    isRepeatable() {
        return this._repeatable;
    }
}

export default ShellProgramArgument