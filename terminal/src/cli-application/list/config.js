export const DEFAULT_WIDTH = 80;
export const DEFAULT_PADDING = 2;
export const DEFAULT_FORMAT = 'across';
export const DEFAULT_SORT_TYPE = 'name';
export const DEFAULT_INDICATOR_STYLE = 'none';
export const DEFAULT_COLOR_RULE = 'auto';
export const DEFAULT_TIME_TYPE = 'modification';
export const DEFAULT_TIME_STYLE = 'locale';
export const DEFAULT_QUOTING_STYLE = 'shell-escape';

export const SORT_TYPES = Object.freeze([
    'none', 
    'size', 
    'time', 
    'version', 
    'extension', 
    'name', 
    'width'
]);
export const TIME_TYPES = Object.freeze([
    'access',
    'atime',
    'use',
    'modification',
    'mtime',
    'status',
    'ctime',
    'birth',
    'creation'
]);
export const TIME_STYLES = Object.freeze([
    'full-iso',
    'long-iso',
    'iso',
    'locale',
]);
export const QUOTING_STYLES = Object.freeze([
    'literal',
    'locale',
    'shell',
    'shell-always',
    'shell-escape',
    'shell-escape-always',
    'c',
    'escape',
]);
export const FORMATS = Object.freeze([
    'across',
    'commas',
    'horizontal',
    'long',
    'single-column',
    'verbose',
    'vertical',
]);
export const INDICATOR_STYLES = Object.freeze([
    'none',
    'slash',
    'file-type',
    'classify',
]);
export const COLOR_RULES = Object.freeze([
    'always',
    'never',
    'auto',
]);
export const SI_UNITS_SIZE_MAP = Object.freeze({
    'k': 1,
    'M': 2,
    'G': 3,
    'T': 4,
    'P': 5,
    'E': 6,
    'Z': 7,
    'Y': 8,
    'R': 9,
    'Q': 10,
});
export const BINARY_UNITS_SIZE_MAP = Object.freeze({
    'K': 1,
    'M': 2,
    'G': 3,
    'T': 4,
    'P': 5,
    'E': 6,
    'Z': 7,
    'Y': 8,
    'R': 9,
    'Q': 10,
});
export const DECIMAL_UNITS_SIZE_MAP = Object.freeze({
    'KB': 1,
    'MB': 2,
    'GB': 3,
    'TB': 4,
    'PB': 5,
    'EB': 6,
    'ZB': 7,
    'YB': 8,
    'RB': 9,
    'QB': 10,
});
export const C_ESCAPE_MAP = Object.freeze({
    '\x07': '\\a',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\v': '\\v',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\',
});
export const COLORS = Object.freeze({
    DIRECTORY: '34',
    EXECUTABLE: '32',
    DEFAULT: '0'
});
export const AUTO_COLOR_ENABLED = true;

export const CONFIG = Object.freeze({
    DEFAULT_WIDTH,
    DEFAULT_PADDING,
    DEFAULT_FORMAT,
    DEFAULT_SORT_TYPE,
    DEFAULT_INDICATOR_STYLE,
    DEFAULT_COLOR_RULE,
    DEFAULT_TIME_TYPE,
    DEFAULT_TIME_STYLE,
    DEFAULT_QUOTING_STYLE,
    SORT_TYPES,
    TIME_TYPES,
    TIME_STYLES,
    QUOTING_STYLES,
    FORMATS,
    INDICATOR_STYLES,
    COLOR_RULES,
    C_ESCAPE_MAP,
    COLORS,
    AUTO_COLOR_ENABLED,
    SI_UNITS_SIZE_MAP,
    BINARY_UNITS_SIZE_MAP,
    DECIMAL_UNITS_SIZE_MAP,
});

export default CONFIG