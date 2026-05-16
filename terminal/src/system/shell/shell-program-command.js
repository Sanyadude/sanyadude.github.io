/**
 * ShellProgramCommand - Represents a command for a Shell program
 */
export class ShellProgramCommand {
    /**
     * Creates a new Shell program command
     * @param {string} definition - The definition of the command
     * @param {string} description - The description of the command
     */
    constructor(definition, description = '') {
        if (!definition || typeof definition !== 'string') {
            throw new Error('Command definition must be a non-empty string');
        }
        this._definition = definition;
        this._description = description || '';
        this._name = null;
        this._isOptional = false;

        this._parseDefinition();
    }

    /**
     * Parses the command definition string
     * @private
     */
    _parseDefinition() {
        let definition = this._definition.trim();
        // Match optional command: [<command>] or [command]
        const optionalMatch = definition.match(/\[<?([\w-]+)>?\]/);
        if (optionalMatch) {
            this._name = optionalMatch[1];
            this._isOptional = true;
            return;
        }
        this._name = definition.replace(/^<|>$/g, '');
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
     * Returns if the command is optional
     * @returns {boolean} - True if the command is optional, false otherwise
     */
    isOptional() {
        return this._isOptional;
    }

    /**
     * Returns a string representation of the argument
     * @returns {string} - A string representation of the argument
     */
    toString() {
        return this._isOptional ? `[${this._name}]` : this._name;
    }
}

export default ShellProgramCommand