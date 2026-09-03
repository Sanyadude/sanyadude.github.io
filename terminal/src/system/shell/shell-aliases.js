import { ALIASES_DEPTH_MAX } from './shell-config.js'
import { ShellQuoteSplitter } from './shell-quote-splitter.js'

/**
 * ShellAliases - Stores command aliases and expands the first token of a command
 */
export class ShellAliases {
    /**
     * Creates a new ShellAliases instance
     * @param {number} maxDepth - Maximum alias expansion depth
     */
    constructor(maxDepth = ALIASES_DEPTH_MAX) {
        this._aliases = new Map();
        this._quoteSplitter = new ShellQuoteSplitter();
        this._maxDepth = maxDepth;
    }

    /**
     * Sets an alias
     * @param {string} name - The name of the alias
     * @param {string} command - The command to expand to
     * @returns {ShellAliases} - The aliases instance
     */
    set(name, command) {
        this._aliases.set(name, command);
        return this;
    }

    /**
     * Gets an alias by name
     * @param {string} name - The name of the alias
     * @returns {string|undefined} - The command, or undefined if the alias does not exist
     */
    get(name) {
        return this._aliases.get(name);
    }

    /**
     * Removes an alias
     * @param {string} name - The name of the alias
     * @returns {ShellAliases} - The aliases instance
     */
    remove(name) {
        this._aliases.delete(name);
        return this;
    }

    /**
     * Gets all aliases
     * @returns {object[]} - The aliases
     */
    list() {
        return [...this._aliases].map(([key, value]) => ({
            name: key,
            command: value
        }));
    }

    /**
     * Clears all aliases
     * @returns {ShellAliases} - The aliases instance
     */
    clear() {
        this._aliases.clear();
        return this;
    }

    /**
     * Expands aliases in the first token, following replacements up to max depth
     * Stops on a missing alias or a cycle
     * @param {string[]} tokens - The command tokens (quotes preserved)
     * @returns {string[]} - Tokens with aliases expanded
     */
    expand(tokens) {
        if (!tokens || tokens.length === 0) return tokens || [];
        const expanded = [...tokens];
        const seen = new Set();
        let depth = 0;
        while (depth < this._maxDepth) {
            const first = expanded[0];
            if (!this._aliases.has(first)) break;
            if (seen.has(first)) break;
            seen.add(first);
            const replacement = this._aliases.get(first);
            const newTokens = this._quoteSplitter.split(replacement, ' ');
            expanded.splice(0, 1, ...newTokens);
            depth++;
        }
        return expanded;
    }
}

export default ShellAliases