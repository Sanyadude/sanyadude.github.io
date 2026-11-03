export const DEFAULT_FILE_MODE = 0o666;
export const DEFAULT_DIRECTORY_MODE = 0o777;

export const MODE_BITS = Object.freeze({
    owner: Object.freeze({
        read: 0o400,
        write: 0o200,
        execute: 0o100,
    }),
    group: Object.freeze({
        read: 0o040,
        write: 0o020,
        execute: 0o010,
    }),
    other: Object.freeze({
        read: 0o004,
        write: 0o002,
        execute: 0o001,
    }),
});

export default {
    DEFAULT_FILE_MODE,
    DEFAULT_DIRECTORY_MODE,
    MODE_BITS,
};