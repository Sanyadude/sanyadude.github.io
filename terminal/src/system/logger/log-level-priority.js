import { LOG_LEVEL } from './log-level.js'

/**
 * LOG_LEVEL_PRIORITY - The priority of the log levels
 * @enum {number}
 */
export const LOG_LEVEL_PRIORITY = Object.freeze({
    [LOG_LEVEL.ERROR]: 1,
    [LOG_LEVEL.WARN]: 2,
    [LOG_LEVEL.INFO]: 3,
    [LOG_LEVEL.DEBUG]: 4
});

export default LOG_LEVEL_PRIORITY