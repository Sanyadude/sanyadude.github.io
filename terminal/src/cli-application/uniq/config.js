export const DEFAULT_GROUP_METHOD = 'separate';
export const DEFAULT_ALL_REPEATED_METHOD = 'none';

export const GROUP_METHODS = Object.freeze([
    'separate',
    'prepend',
    'append',
    'both',
]);

export const ALL_REPEATED_METHODS = Object.freeze([
    'none',
    'prepend',
    'separate',
]);

export const CONFIG = Object.freeze({
    DEFAULT_GROUP_METHOD,
    DEFAULT_ALL_REPEATED_METHOD,
    GROUP_METHODS,
    ALL_REPEATED_METHODS,
});

export default CONFIG