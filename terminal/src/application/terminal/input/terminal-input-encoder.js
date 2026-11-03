import { ANSI } from '../ansi/ansi-codes.js'
import { TERMINAL_EVENT_TYPE } from './terminal-event-type.js'

const ARROW_FINALS = Object.freeze({
    ArrowUp: 'A',
    ArrowDown: 'B',
    ArrowRight: 'C',
    ArrowLeft: 'D',
    Home: 'H',
    End: 'F',
});

const TILDE_CODES = Object.freeze({
    Insert: '2',
    Delete: '3',
    PageUp: '5',
    PageDown: '6',
    F5: '15',
    F6: '17',
    F7: '18',
    F8: '19',
    F9: '20',
    F10: '21',
    F11: '23',
    F12: '24',
    F13: '25',
    F14: '26',
    F15: '28',
    F16: '29',
    F17: '31',
    F18: '32',
    F19: '33',
    F20: '34',
});

const SS3_FINALS = Object.freeze({
    F1: 'P',
    F2: 'Q',
    F3: 'R',
    F4: 'S',
});

/**
 * TerminalInputEncoder class - turns terminal events into the text a program reads
 */
export class TerminalInputEncoder {
    /**
     * Encodes a terminal event into an input sequence
     * @param {TerminalEvent} terminalEvent The terminal event
     * @returns {string} The encoded input sequence, or an empty string when the event is not input
     */
    encode(terminalEvent) {
        if (!terminalEvent) return '';
        if (terminalEvent.type === TERMINAL_EVENT_TYPE.MOUSE) return this._toMouseSequence(terminalEvent.data);
        if (terminalEvent.type === TERMINAL_EVENT_TYPE.KEY) return this._toKeySequence(terminalEvent.data);
        return '';
    }

    /**
     * Encodes a key event into an input sequence
     * @param {object} data The key event data
     * @returns {string} The encoded input sequence
     */
    _toKeySequence(data = {}) {
        const { key, ctrl, alt, meta, shift, printable } = data;
        if (!key || meta) return '';
        if (printable && !ctrl && !alt) return key;
        if (ctrl && !alt && key.length === 1) {
            const code = key.toLowerCase().charCodeAt(0);
            if (code >= 97 && code <= 122) return String.fromCharCode(code - 96);
        }
        if (alt && printable && !ctrl) return `${ANSI.ESC}${key}`;
        if (key === 'Enter' && !ctrl && !alt) return '\n';
        if (key === 'Tab' && !ctrl && !alt) return shift ? `${ANSI.CSI}Z` : '\t';
        if (key === 'Backspace' && !ctrl && !alt) return '\b';
        if (key === 'Escape' && !ctrl && !alt && !shift) return ANSI.ESC;
        return this._toNamedKey(key, shift, alt, ctrl);
    }

    /**
     * Encodes a named key into a CSI or SS3 sequence
     * @param {string} key The key name
     * @param {boolean} shift True when Shift is held
     * @param {boolean} alt True when Alt is held
     * @param {boolean} ctrl True when Ctrl is held
     * @returns {string} The encoded input sequence
     */
    _toNamedKey(key, shift, alt, ctrl) {
        const modifier = 1 + (shift ? 1 : 0) + (alt ? 2 : 0) + (ctrl ? 4 : 0);
        const arrow = ARROW_FINALS[key];
        if (arrow) {
            if (modifier === 1) return `${ANSI.CSI}${arrow}`;
            return `${ANSI.CSI}1;${modifier}${arrow}`;
        }
        const tilde = TILDE_CODES[key];
        if (tilde) {
            if (modifier === 1) return `${ANSI.CSI}${tilde}~`;
            return `${ANSI.CSI}${tilde};${modifier}~`;
        }
        const ss3 = SS3_FINALS[key];
        if (!ss3) return '';
        if (modifier === 1) return `${ANSI.ESC}O${ss3}`;
        return `${ANSI.CSI}1;${modifier}${ss3}`;
    }

    /**
     * Encodes a mouse press, release, or move into an SGR mouse report
     * @param {object} data The mouse event data
     * @returns {string} The encoded mouse report, or an empty string when the event is not a tracked mouse report
     */
    _toMouseSequence(data = {}) {
        const { phase, button, column, row } = data;
        if (phase !== 'press' && phase !== 'release' && phase !== 'move') return '';
        if (!column || !row) return '';
        const buttonCode = button === 1 || button === 2 ? button : 0;
        const code = phase === 'move' ? buttonCode + 32 : buttonCode;
        const final = phase === 'release' ? 'm' : 'M';
        return `${ANSI.CSI}<${code};${column};${row}${final}`;
    }
}

export default TerminalInputEncoder