/**
 * ShellProgramCommand - Represents a command for a Shell program
 */
export class ShellProgramCommand {
    /**
     * Creates a new Shell program command
     * @param {object} spec - The command specification
     */
    constructor(spec = {}) {
        if (!spec.name || typeof spec.name !== 'string') {
            throw new Error('Command name must be a non-empty string');
        }
        if (!/^[a-zA-Z0-9][\w-]*$/.test(spec.name)) {
            throw new Error(`Invalid command name: ${spec.name}`);
        }
        this._name = spec.name;
        this._description = spec.description || '';
        this._required = spec.required !== false;
    }

    /**
     * Returns the name of the command
     * @returns {string} - The name of the command
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the description of the command
     * @returns {string} - The description of the command
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns if the command is required
     * @returns {boolean} - True if the command is required, false otherwise
     */
    isRequired() {
        return this._required;
    }
}

export default ShellProgramCommand