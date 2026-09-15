/**
 * Creates a flag specification.
 * @param {object} spec - The flag fields
 * @returns {object} - A normalized flag specification
 */
export function flag({ name, short = null, long = null, description = '' }) {
    return {
        name,
        short,
        long,
        description,
        value: null,
        defaultValue: null,
    };
}

/**
 * Creates an option specification which accepts a value.
 * @param {object} spec - The option fields
 * @returns {object} - A normalized option specification
 */
export function option({
    name,
    short = null,
    long = null,
    description = '',
    value,
    defaultValue = null,
}) {
    return {
        name,
        short,
        long,
        description,
        value: {
            name: value.name,
            required: value.required !== false,
        },
        defaultValue,
    };
}

/**
 * Creates a positional argument specification.
 * @param {object} spec - The argument fields
 * @returns {object} - A normalized argument specification
 */
export function argument({ name, description = '', required = true, repeatable = false }) {
    return { name, description, required, repeatable };
}

/**
 * Creates a subcommand specification.
 * @param {object} spec - The command fields
 * @returns {object} - A normalized command specification
 */
export function command({ name, description = '', required = true }) {
    return { name, description, required };
}

export default {
    flag,
    option,
    argument,
    command,
}