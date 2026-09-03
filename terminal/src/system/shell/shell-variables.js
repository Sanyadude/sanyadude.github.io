import { ShellQuoteSplitter } from './shell-quote-splitter.js'

/**
 * ShellVariables - Stores shell variables, applies NAME=value assignments, and expands $VAR / ${VAR}
 */
export class ShellVariables {
    /**
     * Creates a new ShellVariables instance
     */
    constructor() {
        this._variables = new Map();
        this._quoteSplitter = new ShellQuoteSplitter();
    }

    /**
     * Sets a variable
     * @param {string} name - The name of the variable
     * @param {string} value - The value to set
     * @returns {ShellVariables} - The variables instance
     */
    set(name, value) {
        this._variables.set(name, value);
        return this;
    }

    /**
     * Gets a variable by name
     * @param {string} name - The name of the variable
     * @returns {string|undefined} - The value, or undefined if the variable does not exist
     */
    get(name) {
        return this._variables.get(name);
    }

    /**
     * Removes a variable
     * @param {string} name - The name of the variable
     * @returns {ShellVariables} - The variables instance
     */
    remove(name) {
        this._variables.delete(name);
        return this;
    }

    /**
     * Gets all variables
     * @returns {object[]} - The variables
     */
    list() {
        return [...this._variables].map(([key, value]) => ({
            name: key,
            value: value
        }));
    }

    /**
     * Clears all variables
     * @returns {ShellVariables} - The variables instance
     */
    clear() {
        this._variables.clear();
        return this;
    }

    /**
     * Applies leading NAME=value tokens as variable assignments
     * @param {string} command - The command line
     * @returns {{command: string, assigned: string[]}} - Remaining command and assigned names
     */
    applyAssignments(command) {
        const tokens = this._quoteSplitter.split(command, ' ');
        let tokenIndex = 0;
        const assigned = [];
        while (tokenIndex < tokens.length) {
            const token = tokens[tokenIndex];
            if (!token) break;
            const match = token.match(/^([a-zA-Z_]\w*)=(.*)$/);
            if (!match) break;
            const name = match[1].trim();
            const value = match[2].trim().replace(/^("|')|("|')$/g, '');
            this.set(name, value);
            assigned.push(name);
            tokenIndex++;
        }
        const remainingTokens = tokens.slice(tokenIndex);
        if (remainingTokens.length > 0) {
            return { command: remainingTokens.join(' '), assigned };
        }
        return { command: assigned.length > 0 ? '' : command, assigned };
    }

    /**
     * Expands $VAR and ${VAR} in a command
     * Stored variables override the provided builtins
     * @param {string} command - The command line
     * @param {object} builtins - Built-in variables (USER, PWD, ...)
     * @returns {string} - The command with variables expanded
     */
    expand(command, builtins = {}) {
        if (!command) return command;
        const variables = { ...builtins };
        for (const [name, value] of this._variables.entries()) {
            variables[name] = value;
        }
        return command.replace(/\$(\w+)|\$\{(\w+)\}/g, (_, v1, v2) => {
            const key = v1 || v2;
            return variables[key] ?? `$${key}`;
        });
    }
}

export default ShellVariables