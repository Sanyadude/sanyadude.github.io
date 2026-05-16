/**
 * SCHEDULED_TASK_STATUS - The status of a scheduled task
 * @enum {string}
 */
export const SCHEDULED_TASK_STATUS = Object.freeze({
    PENDING: 'pending',
    RUNNING: 'running',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    ERROR: 'error'
});

export default SCHEDULED_TASK_STATUS