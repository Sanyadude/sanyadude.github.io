/**
 * PROCESS_STATUS - The status of a process
 * @enum {string}
 */
export const PROCESS_STATUS = Object.freeze({
    NEW: 'new',
    RUNNING: 'running',
    STOPPED: 'stopped',
    TERMINATED: 'terminated',
    KILLED: 'killed'
});

export default PROCESS_STATUS