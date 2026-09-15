export const DEFAULT_TIME_TYPE = 'written';
export const DEFAULT_WIDTH = 80;
export const DEFAULT_PADDING = 2;

export const ATTRIBUTE_TYPES = Object.freeze({
    'D': 'directory',
    'H': 'hidden',
    'R': 'readonly',
});

export const SORT_TYPES = Object.freeze({
    'N': 'name',
    'S': 'size',
    'D': 'date',
    'E': 'extension',
    'G': 'group',
});

export const TIME_TYPES = Object.freeze({
    'C': 'created',
    'A': 'accessed',
    'W': 'written',
});

export const CONFIG = Object.freeze({
    DEFAULT_TIME_TYPE,
    DEFAULT_WIDTH,
    DEFAULT_PADDING,
    ATTRIBUTE_TYPES,
    SORT_TYPES,
    TIME_TYPES,
});

export default CONFIG