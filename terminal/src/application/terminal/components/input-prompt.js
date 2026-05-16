import { sgrText, SGR } from './ansi-codes.js'
/**
 * InputPrompt class - represents a prompt for the input
 */
export class InputPrompt {
    /**
     * Creates a new InputPrompt instance
     */
    constructor() {
        this._type = 'windows';
        this._showUser = true;
        this._showHost = true;
        this._showPath = true;
    }

    /**
     * Sets the prompt type to windows
     * @returns {InputPrompt} - The instance of the InputPrompt
     */
    setPromptTypeWindows() {
        this._type = 'windows';
        return this;
    }

    /**
     * Sets the prompt type to linux
     * @returns {InputPrompt} - The instance of the InputPrompt
     */
    setPromptTypeLinux() {
        this._type = 'linux';
        return this;
    }

    /**
     * Formats the prompt text
     * @param {string} path - The path to format the prompt text for
     * @returns {string} - The formatted prompt text
     */
    formatPromptText(user, host, cwd) {
        let symbol = '';
        if (this._type === 'windows') {
            symbol = '>';
            return this._showPath ? `${cwd ? cwd : '/'}${symbol}` : symbol;
        }
        symbol = '$';
        const parts = [];
        if (this._showUser || this._showHost) {
            let userHost = '';
            if (this._showUser) {
                userHost += user;
            }
            if (this._showHost) {
                userHost += `${userHost ? '@' : ''}${host}`;
            }
            parts.push(sgrText(userHost, SGR.FG.GREEN));
        }
        if (this._showPath) {
            parts.push(sgrText(cwd ? `~/${cwd}` : '~', SGR.FG.BLUE));
        }
        return `${parts.join(':')}${symbol} `;
    }
}

export default InputPrompt