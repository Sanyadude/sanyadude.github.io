/**
 * SystemTime - A class for managing the system time
 */
export class SystemTime {
    /**
     * Creates a new SystemTime instance
     */
    constructor(startDate = new Date().getTime()) {
        this._uptimeStartPerformance = performance.now();
        this._startDate = startDate;
        this._startPerformance = performance.now();
    }

    /**
     * Gets the start date of the system
     * @returns {number} The start date of the system
     */
    getStartDate() {
        return this._startDate;
    }

    /**
     * Gets the uptime of the system in milliseconds
     * @returns {number} The uptime of the system in milliseconds
     */
    getUptime() {
        return performance.now() - this._uptimeStartPerformance;
    }

    /**
     * Gets the current time in milliseconds
     * @returns {number} The current time in milliseconds
     */
    getTime() {
        return this._startDate + (performance.now() - this._startPerformance);
    }

    /**
     * Sets the start date of the system
     * @param {number} startDate - The start date of the system
     */
    setTime(timestamp = new Date().getTime()) {
        this._startDate = timestamp;
        this._startPerformance = performance.now();
    }
}

export default SystemTime