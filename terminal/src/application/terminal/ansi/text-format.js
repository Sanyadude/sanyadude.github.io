import { SGR } from './ansi-codes.js'
import { AnsiParser } from './ansi-parser.js'

/**
 * ANSI color map
 * @type {object}
 */
const ANSI_COLOR_MAP = Object.freeze({
    //Foreground colors
    [SGR.FG.BLACK]: 'black',
    [SGR.FG.RED]: 'red',
    [SGR.FG.GREEN]: 'green',
    [SGR.FG.YELLOW]: 'yellow',
    [SGR.FG.BLUE]: 'blue',
    [SGR.FG.MAGENTA]: 'magenta',
    [SGR.FG.CYAN]: 'cyan',
    [SGR.FG.WHITE]: 'white',
    [SGR.FG.DEFAULT]: 'foreground',
    //Bright foreground colors
    [SGR.FG.BRIGHT_BLACK]: 'brightBlack',
    [SGR.FG.BRIGHT_RED]: 'brightRed',
    [SGR.FG.BRIGHT_GREEN]: 'brightGreen',
    [SGR.FG.BRIGHT_YELLOW]: 'brightYellow',
    [SGR.FG.BRIGHT_BLUE]: 'brightBlue',
    [SGR.FG.BRIGHT_MAGENTA]: 'brightMagenta',
    [SGR.FG.BRIGHT_CYAN]: 'brightCyan',
    [SGR.FG.BRIGHT_WHITE]: 'brightWhite',
    //Background colors
    [SGR.BG.BLACK]: 'black',
    [SGR.BG.RED]: 'red',
    [SGR.BG.GREEN]: 'green',
    [SGR.BG.YELLOW]: 'yellow',
    [SGR.BG.BLUE]: 'blue',
    [SGR.BG.MAGENTA]: 'magenta',
    [SGR.BG.CYAN]: 'cyan',
    [SGR.BG.WHITE]: 'white',
    [SGR.BG.DEFAULT]: 'background',
    //Bright background colors
    [SGR.BG.BRIGHT_BLACK]: 'brightBlack',
    [SGR.BG.BRIGHT_RED]: 'brightRed',
    [SGR.BG.BRIGHT_GREEN]: 'brightGreen',
    [SGR.BG.BRIGHT_YELLOW]: 'brightYellow',
    [SGR.BG.BRIGHT_BLUE]: 'brightBlue',
    [SGR.BG.BRIGHT_MAGENTA]: 'brightMagenta',
    [SGR.BG.BRIGHT_CYAN]: 'brightCyan',
    [SGR.BG.BRIGHT_WHITE]: 'brightWhite'
});

/**
 * Text formatting utilities
 * @type {object}
 */
export class TextFormat {
    /**
     * Gets the styles for the TextFormat class support
     * @returns {string} The styles for the TextFormat class support
     */
    static getStyles() {
        return '@keyframes text-format-blink { 50% { opacity: 0; } }\n'
            + '@keyframes text-format-glyph-blink { 50% { color: transparent; } }';    }

    /**
     * Strips the ANSI SGR codes from the text
     * @param {string} text The text to strip
     * @returns {string} The text without ANSI SGR codes
     */
    static stripAnsiSgr(text = '') {
        let result = '';
        new AnsiParser().push(text, {
            onChar: (char) => {
                result += char;
            }
        });
        return result;
    }

    /**
     * Merges an SGR parameter string into the current format
     * @param {string|null} currentFormat The current format string
     * @param {string} params The SGR parameters (e.g. "1;31" or "0")
     * @returns {string|null} The merged format string
     */
    static mergeSgrFormat(currentFormat = null, params = '') {
        let merged = currentFormat ? String(currentFormat).split(';') : [];
        const codes = String(params).split(';');
        for (const code of codes) {
            if (code === '' || code === SGR.RESET) {
                merged = [];
                continue;
            }
            merged.push(code);
        }
        return merged.length ? merged.join(';') : null;
    }

    /**
     * Converts 256-color code to RGB
     * @param {number} code 256-color code (0-255)
     * @returns {string} The RGB color string
     */
    static color256ToRgb(code) {
        const num = parseInt(code, 10);
        if (num < 16) {
            // Standard colors (0-15)
            const standardColors = [
                '#000000', '#800000', '#008000', '#808000',
                '#000080', '#800080', '#008080', '#c0c0c0',
                '#808080', '#ff0000', '#00ff00', '#ffff00',
                '#0000ff', '#ff00ff', '#00ffff', '#ffffff'
            ];
            return standardColors[num] || '#000000';
        } else if (num < 232) {
            // 6x6x6 color cube (16-231)
            const n = num - 16;
            const r = Math.floor(n / 36);
            const g = Math.floor((n % 36) / 6);
            const b = n % 6;
            const rVal = r === 0 ? 0 : 55 + r * 40;
            const gVal = g === 0 ? 0 : 55 + g * 40;
            const bVal = b === 0 ? 0 : 55 + b * 40;
            return `rgb(${rVal}, ${gVal}, ${bVal})`;
        } else {
            // Grayscale (232-255)
            const gray = 8 + (num - 232) * 10;
            return `rgb(${gray}, ${gray}, ${gray})`;
        }
    }

    /**
     * Parses ANSI SGR codes into a semantic state object
     * @param {string} formatString The format string to parse
     * @returns {object} The parsed SGR state object
     */
    static parseSgr(formatString = '') {
        if (!formatString || typeof formatString !== 'string') {
            return {};
        }
        const codes = formatString.split(/[,;]/).map(code => code.trim()).filter(Boolean);
        const state = {
            bold: false,
            dim: false,
            italic: false,
            underline: false,
            blink: false,
            reverse: false,
            hidden: false,
            strike: false,
            fg: null, // { type: 'ansi' | 'rgb' | 'color256', value }
            bg: null
        };
        let i = 0;
        while (i < codes.length) {
            const code = codes[i];
            const num = parseInt(code, 10);
            // Reset — keep parsing
            if (code === SGR.STYLE.NORMAL) {
                state.bold = false;
                state.dim = false;
                state.italic = false;
                state.underline = false;
                state.blink = false;
                state.reverse = false;
                state.hidden = false;
                state.strike = false;
                state.fg = null;
                state.bg = null;
                i++;
                continue;
            }
            switch (code) {
                case SGR.STYLE.BOLD:
                    state.bold = true;
                    break;
                case SGR.STYLE.DIM:
                    state.dim = true;
                    break;
                case SGR.STYLE.ITALIC:
                    state.italic = true;
                    break;
                case SGR.STYLE.UNDERLINE:
                    state.underline = true;
                    break;
                case SGR.STYLE.BLINK:
                    state.blink = true;
                    break;
                case SGR.STYLE.REVERSE:
                    state.reverse = true;
                    break;
                case SGR.STYLE.HIDDEN:
                    state.hidden = true;
                    break;
                case SGR.STYLE.STRIKE:
                    state.strike = true;
                    break;
            }
            // Standard ANSI foreground
            if ((num >= 30 && num <= 37) || num === 39 || (num >= 90 && num <= 97)) {
                state.fg = { type: 'ansi', value: num };
                i++;
                continue;
            }
            // Standard ANSI background
            if ((num >= 40 && num <= 47) || num === 49 || (num >= 100 && num <= 107)) {
                state.bg = { type: 'ansi', value: num };
                i++;
                continue;
            }
            // 256-color
            if (code === '38' && codes[i + 1] === '5') {
                state.fg = { type: 'color256', value: parseInt(codes[i + 2], 10) };
                i += 3;
                continue;
            }
            if (code === '48' && codes[i + 1] === '5') {
                state.bg = { type: 'color256', value: parseInt(codes[i + 2], 10) };
                i += 3;
                continue;
            }
            // RGB
            if (code === '38' && codes[i + 1] === '2') {
                state.fg = {
                    type: 'rgb',
                    value: [
                        parseInt(codes[i + 2], 10),
                        parseInt(codes[i + 3], 10),
                        parseInt(codes[i + 4], 10)
                    ]
                };
                i += 5;
                continue;
            }
            if (code === '48' && codes[i + 1] === '2') {
                state.bg = {
                    type: 'rgb',
                    value: [
                        parseInt(codes[i + 2], 10),
                        parseInt(codes[i + 3], 10),
                        parseInt(codes[i + 4], 10)
                    ]
                };
                i += 5;
                continue;
            }
            i++;
        }
        return state;
    }

    /**
     * Resolves semantic SGR state into a CSS style object
     * @param {object} state The state to resolve the style from
     * @param {object} theme The theme to resolve the style from
     * @returns {object} The resolved style
     */
    static resolveSgrToStyle(state = {}, theme) {
        const style = {};
        if (state.bold) style.fontWeight = 'bold';
        if (state.italic) style.fontStyle = 'italic';
        if (state.underline || state.strike) {
            const decorations = [];
            if (state.underline) decorations.push('underline');
            if (state.strike) decorations.push('line-through');
            style.textDecoration = decorations.join(' ');
        }
        if (state.blink) {
            style.animation = 'text-format-glyph-blink 1s step-end infinite';
        }
        let fg = TextFormat.resolveColor(state.fg, theme);
        let bg = TextFormat.resolveColor(state.bg, theme);
        if (state.reverse) {
            [fg, bg] = [bg != null ? bg : theme.background, fg != null ? fg : theme.foreground];
        }
        if (state.dim) {
            fg = fg ? TextFormat.dimColor(fg) : TextFormat.dimColor(theme.foreground);
        }
        if (fg) style.color = fg;
        if (bg) style.backgroundColor = bg;
        if (state.hidden) style.color = 'transparent';
        return style;
    }

    /**
     * Resolves the color from the token
     * @param {object} token The token to resolve the color from
     * @param {object} theme The theme to resolve the color from
     * @returns {string} The resolved color
     */
    static resolveColor(token, theme) {
        if (!token) return null;
        switch (token.type) {
            case 'ansi':
                return theme[ANSI_COLOR_MAP[token.value]];
            case 'color256':
                return TextFormat.color256ToRgb(token.value);
            case 'rgb':
                return `rgb(${token.value.join(', ')})`;
        }
    }

    /**
     * Dim the color
     * @param {string} color The color to dim
     * @param {number} factor The factor to dim the color by
     * @returns {string} The dimmed color
     */
    static dimColor(color, factor = 0.5) {
        const rgb = TextFormat.parseColor(color);
        if (!rgb) return color;
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Parses the color
     * @param {string} color The color to parse
     * @returns {object} The parsed color
     */
    static parseColor(color) {
        if (!color) return null;
        // rgb(r,g,b)
        if (color.startsWith('rgb')) {
            const m = color.match(/\d+/g);
            if (!m) return null;
            const [r, g, b] = m.map(Number);
            return { r, g, b };
        }
        // #rgb or #rrggbb
        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            const num = parseInt(hex, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }
        return null;
    }
}

export default TextFormat