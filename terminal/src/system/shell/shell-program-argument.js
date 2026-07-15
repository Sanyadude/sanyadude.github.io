/**
 * ShellProgramArgument - Represents a argument for a Shell program
 */
export class ShellProgramArgument {
    /**
     * Creates a new Shell program argument
     * @param {string} definition - The definition of the argument
     * @param {string} description - The description of the argument
     */
    constructor(definition, description = '') {
        if (!definition || typeof definition !== 'string') {
            throw new Error('Argument definition must be a non-empty string');
        }
        this._definition = definition;
        this._description = description || '';

        this._name = null;
        this._names = [];
        this._isOptional = false;

        this._parseDefinition();
    }

    /**
     * Parses the argument definition string
     * @private
     */
    _parseDefinition() {
        const tokens = this._definition.trim().split(/\s+/);
        for (const token of tokens) {
            let name = null;
            let isOptional = false;
            // [<arg>] or [arg]
            const optionalMatch = token.match(/^\[<?([\w-]+)>?\]$/);
            if (optionalMatch) {
                name = optionalMatch[1];
                isOptional = true;
            }
            // <arg>
            const requiredMatch = token.match(/^<([\w-]+)>$/);
            if (!name && requiredMatch) {
                name = requiredMatch[1];
                isOptional = false;
            }
            if (!name) {
                throw new Error(`Invalid argument definition segment: ${token}`);
            }
            if (!this._name) {
                this._name = name;
            }
            this._names.push(name);
            this._isOptional = this._isOptional || isOptional;
        }
    }

    /**
     * Returns the name of the argument
     * @returns {string} - The name of the argument
     */
    getName() {
        return this._name;
    }

    /**
     * Returns all argument names (supports multi-name definitions)
     * @returns {string[]} - The argument names
     */
    getNames() {
        return [...this._names];
    }

    /**
     * Returns the description of the argument
     * @returns {string} - The description of the argument
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns if the argument is optional
     * @returns {boolean} - True if the argument is optional, false otherwise
     */
    isOptional() {
        return this._isOptional;
    }
}

export default ShellProgramArgument