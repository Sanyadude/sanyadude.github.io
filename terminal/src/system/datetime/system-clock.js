/**
 * SystemClock - A class for managing the clock
 */
export class SystemClock {
    /**
     * Gets the current time in milliseconds
     * @returns {number} - The current time in milliseconds
     */
    static get NOW() { return Date.now(); }
    static get STEP_INTERVAL() { return 1000; }

    /**
     * Creates a new Clock instance
     * @param {number} startTime - The start time in milliseconds
     */
    constructor(startTime = SystemClock.NOW) {
        this.timeoutHandler = null;
        this.startTime = isNaN(startTime) ? SystemClock.NOW : startTime;
        this.startTimeOffset = SystemClock.NOW - this.startTime;
        this.currentTime = this.startTime;
        this.ticks = 0;
    }

    /**
     * Gets the current date
     * @returns {Date} - The current date
     */
    get currentDate() {
        return new Date(this.currentTime);
    }

    /**
     * Starts the clock
     */
    start() {
        let expectedTime = SystemClock.NOW - this.startTimeOffset;
        const step = () => {
            const prevTime = this.currentTime;
            this.currentTime = SystemClock.NOW - this.startTimeOffset;
            let drift = this.currentTime - expectedTime;
            if (drift > SystemClock.STEP_INTERVAL) {
                const correction = Math.floor(drift / SystemClock.STEP_INTERVAL);
                expectedTime = expectedTime + (correction * SystemClock.STEP_INTERVAL);
                drift = drift - (correction * SystemClock.STEP_INTERVAL);
            }
            expectedTime = expectedTime + SystemClock.STEP_INTERVAL;
            this.ticks++;
            this.timeoutHandler = setTimeout(() => step(), Math.max(0, SystemClock.STEP_INTERVAL - drift));
        }
        step();
    }

    /**
     * Stops the clock
     */
    stop() {
        clearTimeout(this.timeoutHandler);
    }

    /**
     * Disposes the SystemClock instance resources
     */
    dispose() {
        this.stop();
    }
}

export default SystemClock