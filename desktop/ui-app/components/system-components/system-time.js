import EventEmitter from '../../../event-emmiter/event-emmiter.js'

const now = Date.now();

export class SystemTime {
    constructor(startTime = now) {
        this.stepInterval = 1000;
        this.timeoutHandler = null;
        this.startTime = startTime;
        this.startTimeOffset = now - startTime
        this.currentTime = startTime;
        this.ticks = 0;

        this._init();
    }

    _init() {
        this.start();
    }

    start() {
        let expectedTime = Date.now() - this.startTimeOffset;
        const step = () => {
            const prevTime = this.currentTime;
            this.currentTime = Date.now() - this.startTimeOffset;
            let drift = this.currentTime - expectedTime;
            if (drift > this.stepInterval) {
                const correction = Math.floor(drift / this.stepInterval);
                expectedTime = expectedTime + (correction * this.stepInterval);
                drift = drift - (correction * this.stepInterval);
            }
            expectedTime = expectedTime + this.stepInterval;
            EventEmitter.emit('system-time-tick', { startTime: this.startTime, currentTime: this.currentTime, tickTime: this.currentTime - prevTime });
            this.timeoutHandler = setTimeout(() => step(), Math.max(0, this.stepInterval - drift));
        }
        step();
    }

    stop() {
        clearTimeout(this.timeoutHandler);
    }
}

export default SystemTime;