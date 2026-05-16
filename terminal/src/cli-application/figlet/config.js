export const HORIZONTAL_MIRROR_MAP = Object.freeze({
    // slashes
    '/': '\\',
    '\\': '/',
    // brackets
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
    '<': '>',
    '>': '<',
    // pipes & arrows
    '«': '»',
    '»': '«',
    // letters
    'b': 'd',
    'd': 'b',
    'p': 'q',
    'q': 'p',
    // math / misc
    '≤': '≥',
    '≥': '≤'
});
export const VERTICAL_MIRROR_MAP = Object.freeze({
    // slashes
    '/': '\\',
    '\\': '/',
    // arrows / carets
    '^': 'v',
    'v': '^',
    'V': '^',
    // punctuation
    '.': '\'',
    '\'': '.',
    ',': '`',
    '`': ',',
    // brackets
    '⌈': '⌊',
    '⌊': '⌈',
    '⌉': '⌋',
    '⌋': '⌉',
    // box drawing
    '¯': '_',
    '_': '¯'
});
export const BORDER_STYLES = Object.freeze({
    none: Object.freeze({
        topLeft: '', topRight: '', bottomLeft: '', bottomRight: '',
        horizontal: '', vertical: ''
    }),
    ascii: Object.freeze({
        topLeft: '+', topRight: '+', bottomLeft: '+', bottomRight: '+',
        horizontal: '-', vertical: '|'
    }),
    single: Object.freeze({
        topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘',
        horizontal: '─', vertical: '│'
    }),
    double: Object.freeze({
        topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝',
        horizontal: '═', vertical: '║'
    }),
    rounded: Object.freeze({
        topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯',
        horizontal: '─', vertical: '│'
    })
});

export const DEFAULT_FONT_NAME = 'standard';
export const DEFAULT_WIDTH = 80;
export const DEFAULT_CHARACTER_CODE = 32;

export const CONFIG = Object.freeze({
    DEFAULT_FONT_NAME,
    DEFAULT_WIDTH,
    DEFAULT_CHARACTER_CODE,
    HORIZONTAL_MIRROR_MAP, 
    VERTICAL_MIRROR_MAP, 
    BORDER_STYLES 
});

export default CONFIG