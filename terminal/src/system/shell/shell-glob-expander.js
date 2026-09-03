import { Path } from '../file-system/path.js'

/**
 * ShellGlobExpander - Expands unquoted glob tokens (*, ?, [...]) against the file system
 * Quoted tokens, options, operators, and unmatched globs are left unchanged
 */
export class ShellGlobExpander {
    /**
     * Creates a new ShellGlobExpander instance
     * @param {FileSystemExplorer} fileSystemExplorer - The file system explorer (cwd)
     * @param {FileSystemManager} fileSystemManager - The file system manager
     */
    constructor(fileSystemExplorer, fileSystemManager) {
        this._fileSystemExplorer = fileSystemExplorer;
        this._fileSystemManager = fileSystemManager;
    }

    /**
     * Expands glob tokens in a tokenized command line
     * @param {string[]} tokens - The command tokens (quotes preserved)
     * @returns {string[]} - Tokens with globs expanded
     */
    expand(tokens) {
        if (!tokens || tokens.length === 0) return tokens || [];
        const expandedTokens = [];
        for (const token of tokens) {
            if (!token || this._isQuotedToken(token) || this._isOperator(token) || this._isOptionToken(token) || !Path.isGlob(token)) {
                expandedTokens.push(token);
                continue;
            }
            const matches = this.expandPattern(token);
            if (matches.length === 0) {
                expandedTokens.push(token);
                continue;
            }
            for (const match of matches) {
                expandedTokens.push(this._quoteArgument(match));
            }
        }
        return expandedTokens;
    }

    /**
     * Expands a glob pattern to matching paths (cwd-relative, or absolute if the pattern is)
     * Matching is per path segment; unmatched patterns yield an empty list
     * @param {string} pattern - The glob pattern
     * @returns {string[]} - Matching paths
     */
    expandPattern(pattern) {
        const directoryOnly = pattern.endsWith('/') && pattern !== '/';
        const isAbsolute = pattern.startsWith('/');
        const parts = pattern.split('/').filter(part => part !== '');
        if (parts.length === 0) return [];
        let states = [{
            vfsPath: isAbsolute ? '' : this._fileSystemExplorer.getCurrentPath(),
            displayPath: isAbsolute ? '/' : ''
        }];
        for (let partIndex = 0; partIndex < parts.length; partIndex++) {
            const part = parts[partIndex];
            const isLast = partIndex === parts.length - 1;
            const nextStates = [];
            for (const state of states) {
                if (part === '.') {
                    nextStates.push(state);
                    continue;
                }
                if (part === '..') {
                    const parentParts = Path.getParts(state.vfsPath);
                    const parentVfs = parentParts.length <= 1 ? '' : Path.create(...parentParts.slice(0, -1));
                    const parentDisplay = state.displayPath ? `${state.displayPath}/..` : '..';
                    nextStates.push({ vfsPath: parentVfs, displayPath: isAbsolute ? `/${parentVfs}` : parentDisplay });
                    continue;
                }
                if (!Path.isGlob(part)) {
                    const vfsPath = Path.create(state.vfsPath, part);
                    const displayPath = this._joinDisplay(state.displayPath, part, isAbsolute);
                    if (isLast) {
                        if (this._fileSystemManager.exists(vfsPath) && (!directoryOnly || this._fileSystemManager.directoryExists(vfsPath))) {
                            nextStates.push({ vfsPath, displayPath });
                        }
                    } else if (this._fileSystemManager.directoryExists(vfsPath)) {
                        nextStates.push({ vfsPath, displayPath });
                    }
                    continue;
                }
                const matcher = Path.globToRegExp(part);
                const names = this._fileSystemManager.getEntriesAt(state.vfsPath)
                    .filter(entry => {
                        const name = entry.getName();
                        if (name.startsWith('.') && !part.startsWith('.')) return false;
                        if (!matcher.test(name)) return false;
                        if (!isLast && !entry.isDirectory()) return false;
                        if (isLast && directoryOnly && !entry.isDirectory()) return false;
                        return true;
                    })
                    .map(entry => entry.getName())
                    .sort((a, b) => a.localeCompare(b));
                for (const name of names) {
                    nextStates.push({
                        vfsPath: Path.create(state.vfsPath, name),
                        displayPath: this._joinDisplay(state.displayPath, name, isAbsolute)
                    });
                }
            }
            states = nextStates;
            if (states.length === 0) return [];
        }
        return states.map(state => directoryOnly ? `${state.displayPath}/` : state.displayPath);
    }

    /**
     * Joins a glob match onto a display path
     * @param {string} displayPath - The path so far
     * @param {string} name - The next segment
     * @param {boolean} isAbsolute - Whether the original pattern was absolute
     * @returns {string} - The joined display path
     */
    _joinDisplay(displayPath, name, isAbsolute) {
        if (!displayPath || displayPath === '/') {
            return isAbsolute ? `/${name}` : name;
        }
        return `${displayPath}/${name}`;
    }

    /**
     * Checks if a token is wrapped in quotes
     * @param {string} token - The token
     * @returns {boolean} - True if the token is quoted
     */
    _isQuotedToken(token) {
        if (!token || token.length < 2) return false;
        return (token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"));
    }

    /**
     * Checks if a token is a shell operator that should not be glob-expanded
     * @param {string} token - The token
     * @returns {boolean} - True if the token is an operator
     */
    _isOperator(token) {
        return token === '|' || token === '>' || token === '<' || token === '>>' || token === '||' || token === '&&';
    }

    /**
     * Checks if a token is a command option / switch
     * @param {string} token - The token
     * @returns {boolean} - True if the token is an option
     */
    _isOptionToken(token) {
        if (!token) return false;
        if (token.startsWith('--')) return true;
        return /^[-/][A-Za-z?][A-Za-z0-9]*(:.*)?$/.test(token);
    }

    /**
     * Quotes an argument if it contains whitespace or quotes
     * @param {string} argument - The argument
     * @returns {string} - The quoted argument if needed
     */
    _quoteArgument(argument) {
        if (!argument) return argument;
        if (this._isQuotedToken(argument)) return argument;
        if (!/[\s'"]/.test(argument)) return argument;
        return `"${argument.replace(/"/g, '\\"')}"`;
    }
}

export default ShellGlobExpander