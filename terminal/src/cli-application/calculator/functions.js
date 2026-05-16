/**
 * Built-in math functions available in expressions
 * @type {Object<string, Function>}
 */
export const FUNCTIONS = Object.freeze({
    sqrt:  (a) => Math.sqrt(a),
    sin:   (a) => Math.sin(a),
    cos:   (a) => Math.cos(a),
    tan:   (a) => Math.tan(a),
    abs:   (a) => Math.abs(a),
    ceil:  (a) => Math.ceil(a),
    floor: (a) => Math.floor(a),
    round: (a) => Math.round(a),
    log:   (a, b) => b !== undefined ? Math.log(a) / Math.log(b) : Math.log(a),
    ln:    (a) => Math.log(a),
    log2:  (a) => Math.log2(a),
    log10: (a) => Math.log10(a),
    min:   (...a) => Math.min(...a),
    max:   (...a) => Math.max(...a),
    pow:   (a, b) => Math.pow(a, b),
});

export default FUNCTIONS