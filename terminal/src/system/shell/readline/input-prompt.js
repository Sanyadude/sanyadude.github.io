import { PROMPT_COLORS, DEFAULT_PROMPT_TYPE } from '../config/config.js'

/**
 * Wraps text in an SGR color sequence
 * @param {string} text The text
 * @param {string} code The SGR code
 * @returns {string} The colored text
 */
function sgrText(text = '', code = '') {
    return `\x1b[${code}m${text}\x1b[0m`;
}

/**
 * Returns the visible cell count of a prompt, ignoring CSI sequences
 * @param {string} text The prompt text
 * @returns {number} The visible length
 */
function visibleLength(text = '') {
    return text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').length;
}

/**
 * InputPrompt - tracks the prompt style and the last saved prompt
 */
export class InputPrompt {
    /**
     * Creates a new InputPrompt instance
     */
    constructor() {
        this._type = DEFAULT_PROMPT_TYPE;
        this._showUser = true;
        this._showHost = true;
        this._showPath = true;
        this._user = '';
        this._host = '';
        this._cwd = '';
        this._text = '';
        this._length = 0;
    }

    /**
     * Sets the prompt type to windows
     * @returns {InputPrompt} The instance of the InputPrompt
     */
    setPromptTypeWindows() {
        this._type = 'windows';
        return this;
    }

    /**
     * Sets the prompt type to linux
     * @returns {InputPrompt} The instance of the InputPrompt
     */
    setPromptTypeLinux() {
        this._type = 'linux';
        return this;
    }

    /**
     * Sets the prompt text
     * @param {string} user The user name
     * @param {string} host The host name
     * @param {string} cwd The current working directory
     * @returns {InputPrompt} The instance of the InputPrompt
     */
    setPrompt(user, host, cwd) {
        this._user = user || '';
        this._host = host || '';
        this._cwd = cwd || '';
        this._text = this.formatPrompt(this._user, this._host, this._cwd);
        this._length = visibleLength(this._text);
        return this;
    }

    /**
     * Returns the user stored with the last prompt
     * @returns {string} The user name
     */
    getUser() {
        return this._user;
    }

    /**
     * Returns the host stored with the last prompt
     * @returns {string} The host name
     */
    getHost() {
        return this._host;
    }

    /**
     * Returns the working directory stored with the last prompt
     * @returns {string} The current working directory
     */
    getCwd() {
        return this._cwd;
    }

    /**
     * Formats the prompt text
     * @param {string} user The user name
     * @param {string} host The host name
     * @param {string} cwd The current working directory
     * @returns {string} The formatted prompt text
     */
    formatPrompt(user, host, cwd) {
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
            parts.push(sgrText(userHost, PROMPT_COLORS.HOST));
        }
        if (this._showPath) {
            parts.push(sgrText(cwd ? `~/${cwd}` : '~', PROMPT_COLORS.PATH));
        }
        return `${parts.join(':')}${symbol} `;
    }

    /**
     * Returns the last generated prompt, including color codes
     * @returns {string} The prompt text
     */
    getText() {
        return this._text;
    }

    /**
     * Returns the visible length of the last generated prompt
     * @returns {number} The prompt length in cells
     */
    getLength() {
        return this._length;
    }
}

export default InputPrompt