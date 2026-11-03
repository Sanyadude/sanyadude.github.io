import { ANSI } from './ansi-codes.js'

const PARSER_GROUND = 'ground';
const PARSER_ESCAPE = 'escape';
const PARSER_CSI = 'csi';
const PARSER_OSC = 'osc';
const PARSER_OSC_ST = 'osc_st';
const PARSER_MAX_BUFFER = 256;

/**
 * Incremental ANSI parser that keeps state across chunks
 */
export class AnsiParser {
    constructor() {
        this.reset();
    }

    /**
     * Resets the parser to the ground state
     * @returns {AnsiParser} The parser instance
     */
    reset() {
        this._kind = PARSER_GROUND;
        this._buffer = '';
        return this;
    }

    /**
     * Pushes text through the parser
     * @param {string} text The text to parse
     * @param {object} handlers Callbacks: onSgr, onChar, onCsi, onOsc
     * @returns {AnsiParser} The parser instance
     */
    push(text = '', handlers = {}) {
        for (const char of text) {
            this._pushChar(char, handlers);
        }
        return this;
    }

    /**
     * Pushes a single character through the parser.
     * C0 controls are executed immediately, including inside an unfinished sequence.
     * A byte that does not continue an escape is parsed again as text.
     * @param {string} char The character to parse
     * @param {object} handlers Callbacks: onSgr, onChar, onCsi, onOsc
     */
    _pushChar(char, handlers) {
        switch (this._kind) {
            case PARSER_GROUND:
                if (char === ANSI.ESC) {
                    this._kind = PARSER_ESCAPE;
                    this._buffer = char;
                    return;
                }
                this._emitChar(char, handlers);
                return;
            case PARSER_ESCAPE:
                if (this._isExecutableControl(char)) {
                    this._emitChar(char, handlers);
                    return;
                }
                if (char === '[') {
                    this._buffer += char;
                    this._kind = PARSER_CSI;
                    return;
                }
                if (char === ']') {
                    this._buffer += char;
                    this._kind = PARSER_OSC;
                    return;
                }
                if (char === ANSI.ESC) {
                    this._buffer = char;
                    return;
                }
                this.reset();
                this._pushChar(char, handlers);
                return;
            case PARSER_CSI: {
                if (char === ANSI.ESC) {
                    this._kind = PARSER_ESCAPE;
                    this._buffer = char;
                    return;
                }
                if (this._isExecutableControl(char)) {
                    this._emitChar(char, handlers);
                    return;
                }
                this._buffer += char;
                const code = char.charCodeAt(0);
                if (code >= 0x40 && code <= 0x7E) {
                    const params = this._buffer.slice(2, -1);
                    if (char === 'm') {
                        this._emitSgr(params, handlers);
                    } else {
                        this._emitCsi(params, char, handlers);
                    }
                    this.reset();
                    return;
                }
                if (this._buffer.length >= PARSER_MAX_BUFFER) this.reset();
                return;
            }
            case PARSER_OSC:
                if (char === ANSI.BEL) {
                    this._emitOsc(this._buffer.slice(2), handlers);
                    this.reset();
                    return;
                }
                if (char === ANSI.ESC) {
                    this._kind = PARSER_OSC_ST;
                    return;
                }
                if (this._isExecutableControl(char)) {
                    this._emitChar(char, handlers);
                    return;
                }
                this._buffer += char;
                if (this._buffer.length >= PARSER_MAX_BUFFER) this.reset();
                return;
            case PARSER_OSC_ST:
                if (char === '\\') {
                    this._emitOsc(this._buffer.slice(2), handlers);
                    this.reset();
                    return;
                }
                if (this._isExecutableControl(char)) {
                    this._emitChar(char, handlers);
                    this._kind = PARSER_OSC;
                    return;
                }
                if (char === ANSI.ESC) {
                    this._kind = PARSER_ESCAPE;
                    this._buffer = char;
                    return;
                }
                this._buffer += `${ANSI.ESC}${char}`;
                this._kind = PARSER_OSC;
                return;
        }
    }

    /**
     * Returns true for a C0 control other than ESC.
     * Those controls execute even while a sequence is being collected.
     * @param {string} char The character to test
     * @returns {boolean} True when the character is an executable control
     */
    _isExecutableControl(char) {
        return char.charCodeAt(0) <= 0x1F && char !== ANSI.ESC;
    }

    /**
     * Emits a ground character or an executable control
     * @param {string} char The character to emit
     * @param {object} handlers Callbacks: onChar
     */
    _emitChar(char, handlers) {
        if (handlers.onChar) handlers.onChar(char);
    }

    /**
     * Emits an SGR sequence
     * @param {string} params The SGR parameters
     * @param {object} handlers Callbacks: onSgr
     */
    _emitSgr(params, handlers) {
        if (handlers.onSgr) handlers.onSgr(params);
    }

    /**
     * Emits a CSI sequence
     * @param {string} params The CSI parameters
     * @param {string} char The CSI character
     * @param {object} handlers Callbacks: onCsi
     */
    _emitCsi(params, char, handlers) {
        if (handlers.onCsi) handlers.onCsi(params, char);
    }

    /**
     * Emits an OSC sequence
     * @param {string} params The OSC parameters
     * @param {object} handlers Callbacks: onOsc
     */
    _emitOsc(params, handlers) {
        if (handlers.onOsc) handlers.onOsc(params);
    }
}

export default AnsiParser