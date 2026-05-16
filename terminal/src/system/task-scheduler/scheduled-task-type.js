/**
 * SCHEDULED_TASK_TYPE - The type of a scheduled task
 * @enum {string}
 */
export const SCHEDULED_TASK_TYPE = Object.freeze({
    INTERVAL: 'interval',
    DELAY: 'delay',
    SCHEDULE: 'schedule',
    IMMEDIATE: 'immediate'
});

export default SCHEDULED_TASK_TYPE