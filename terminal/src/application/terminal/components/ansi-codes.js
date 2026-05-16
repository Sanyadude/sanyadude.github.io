/**
 * ANSI codes
 * @type {object}
 */
export const ANSI = Object.freeze({
    CSI: '\x1b[', // Control Sequence Introducer
    SEP: ';', // Parameter separator
});

/**
 * ANSI SGR (Select Graphic Rendition) codes
 * @type {object}
*/
export const SGR = Object.freeze({
    FINAL: 'm', // Final character
    RESET: '0', // Reset character
    FULL_RESET: '\x1b[0m', // Reset sequence
    //Style
    STYLE: Object.freeze({
        NORMAL: '0',
        BOLD: '1',
        DIM: '2',
        ITALIC: '3',
        UNDERLINE: '4',
        BLINK: '5',
        REVERSE: '7',
        HIDDEN: '8',
        STRIKE: '9',
    }),
    STYLE_RESET: Object.freeze({
        NORMAL: '0',
        BOLD: '21',
        DIM: '22',
        ITALIC: '23',
        UNDERLINE: '24',
        BLINK: '25',
        REVERSE: '27',
        HIDDEN: '28',
        STRIKE: '29',
    }),
    //Foreground colors
    FG: Object.freeze({
        BLACK: '30',
        RED: '31',
        GREEN: '32',
        YELLOW: '33',
        BLUE: '34',
        MAGENTA: '35',
        CYAN: '36',
        WHITE: '37',
        DEFAULT: '39',
        //Bright colors
        BRIGHT_BLACK: '90',
        BRIGHT_RED: '91',
        BRIGHT_GREEN: '92',
        BRIGHT_YELLOW: '93',
        BRIGHT_BLUE: '94',
        BRIGHT_MAGENTA: '95',
        BRIGHT_CYAN: '96',
        BRIGHT_WHITE: '97',
    }),
    //Background colors
    BG: Object.freeze({
        BLACK: '40',
        RED: '41',
        GREEN: '42',
        YELLOW: '43',
        BLUE: '44',
        MAGENTA: '45',
        CYAN: '46',
        WHITE: '47',
        DEFAULT: '49',
        //Bright colors
        BRIGHT_BLACK: '100',
        BRIGHT_RED: '101',
        BRIGHT_GREEN: '102',
        BRIGHT_YELLOW: '103',
        BRIGHT_BLUE: '104',
        BRIGHT_MAGENTA: '105',
        BRIGHT_CYAN: '106',
        BRIGHT_WHITE: '107',
    }),
    // 256-color: stores just the prefix; you add the number
    COLOR_256: Object.freeze({
        FG_PREFIX: '38;5;',
        BG_PREFIX: '48;5;',
    }),
    // RGB (24-bit): stores prefixes for convenience
    RGB: Object.freeze({
        FG_PREFIX: '38;2;',
        BG_PREFIX: '48;2;',
    }),
});

export function sgr(...codes) {
    return ANSI.CSI + codes.join(ANSI.SEP) + SGR.FINAL;
};

export function sgrText(text = '', ...codes) {
    return ANSI.CSI + codes.join(ANSI.SEP) + SGR.FINAL + text + SGR.FULL_RESET;
};

export function rgb(r, g, b, isForeground = true) {
    const prefix = isForeground ? SGR.RGB.FG_PREFIX : SGR.RGB.BG_PREFIX;
    return ANSI.CSI + prefix + `${r};${g};${b}` + SGR.FINAL;
};

export function rgbText(text = '', r, g, b, isForeground = true) {
    const prefix = isForeground ? SGR.RGB.FG_PREFIX : SGR.RGB.BG_PREFIX;
    return ANSI.CSI + prefix + `${r};${g};${b}` + SGR.FINAL + text + SGR.FULL_RESET;
};

export function color256(color, isForeground = true) {
    const prefix = isForeground ? SGR.COLOR_256.FG_PREFIX : SGR.COLOR_256.BG_PREFIX;
    return ANSI.CSI + prefix + color + SGR.FINAL;
};

export function color256Text(text = '', color, isForeground = true) {
    const prefix = isForeground ? SGR.COLOR_256.FG_PREFIX : SGR.COLOR_256.BG_PREFIX;
    return ANSI.CSI + prefix + color + SGR.FINAL + text + SGR.FULL_RESET;
};

export const ANSI_CODES = Object.freeze({
    ANSI,
    SGR,
});

export default ANSI_CODES