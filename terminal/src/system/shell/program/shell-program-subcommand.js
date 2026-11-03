/**
 * ShellProgramSubcommand - Represents a subcommand for a Shell program
 */
export class ShellProgramSubcommand {
    /**
     * Creates a new Shell program subcommand
     * @param {object} spec The subcommand specification
     */
    constructor(spec = {}) {
        if (!spec.name || typeof spec.name !== 'string') {
            throw new Error('Subcommand name must be a non-empty string');
        }
        if (!/^[a-zA-Z0-9][\w-]*$/.test(spec.name)) {
            throw new Error(`Invalid subcommand name: ${spec.name}`);
        }
        this._name = spec.name;
        this._description = spec.description || '';
        this._required = spec.required !== false;
    }

    /**
     * Returns the name of the subcommand
     * @returns {string} The name of the subcommand
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the description of the subcommand
     * @returns {string} The description of the subcommand
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns if the subcommand is required
     * @returns {boolean} True if the subcommand is required, false otherwise
     */
    isRequired() {
        return this._required;
    }
}

export default ShellProgramSubcommand