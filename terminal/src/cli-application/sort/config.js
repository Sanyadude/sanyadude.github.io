export const DEFAULT_SORT_TYPE = 'string';

export const SORT_TYPES = Object.freeze([
    'general-numeric',
    'human-numeric',
    'month',
    'numeric',
    'random',
    'version',
    'string',
]);

export const MONTHS = Object.freeze([
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]);

export const HUMAN_NUMERIC_UNITS = Object.freeze({
    K: 1,
    M: 2,
    G: 3,
    T: 4,
    P: 5,
    E: 6,
    Z: 7,
    Y: 8,
    R: 9,
    Q: 10,
});

export const CONFIG = Object.freeze({
    DEFAULT_SORT_TYPE,
    SORT_TYPES,
    MONTHS,
    HUMAN_NUMERIC_UNITS,
});

export default CONFIG;
