import { SCHEDULED_TASK_TYPE } from './scheduled-task-type.js'
import { SCHEDULED_TASK_STATUS } from './scheduled-task-status.js'

/**
 * ScheduledTask - A class for a scheduled task
 */
export class ScheduledTask {
    /**
     * Creates a new scheduled task
     * @param {number} id - The id of the task
     * @param {string} name - The name of the task
     * @param {Function} callback - The callback to execute when the task is executed
     * @param {object} options - The options for the scheduled task
     */
    constructor(id, name, callback, options = {}) {
        this.id = id;
        this.name = name || `Task-${id}`;
        this.callback = callback;

        this.status = SCHEDULED_TASK_STATUS.PENDING;

        this.type = options.type || SCHEDULED_TASK_TYPE.IMMEDIATE;
        this.interval = options.interval || null; // milliseconds
        this.delay = options.delay || 0; // milliseconds
        this.scheduledTime = options.scheduledTime || null; // timestamp
        this.maxExecutions = options.maxExecutions || null; // number of times to execute, null = infinite
        
        this.onStart = options.onStart || null;
        this.onComplete = options.onComplete || null;
        this.onError = options.onError || null;

        this.executionCount = 0;
        this.lastExecutionTime = null;
        this.nextExecutionTime = null;
        this.errorCount = 0;
        this.lastError = null;

        this._timeoutId = null;
        this._intervalId = null;
        
        this._setNextExecutionTime();
    }

    /**
     * Sets the next execution time for the task
     */
    _setNextExecutionTime() {
        const now = Date.now();
        if (this.type === SCHEDULED_TASK_TYPE.SCHEDULE && this.scheduledTime) {
            this.nextExecutionTime = this.scheduledTime;
        } else if (this.type === SCHEDULED_TASK_TYPE.DELAY) {
            this.nextExecutionTime = now + this.delay;
        } else if (this.type === SCHEDULED_TASK_TYPE.INTERVAL) {
            this.nextExecutionTime = now + (this.interval || 0);
        } else {
            this.nextExecutionTime = now;
        }
    }

    /**
     * Executes the on start callback
     */
    _executeOnStart() {
        if (!this.onStart) return;
        this.onStart(this);
    }

    /**
     * Executes the on complete callback
     */
    _executeOnComplete() {
        if (!this.onComplete) return;
        this.onComplete(this);
    }

    /**
     * Executes the on error callback
     * @param {Error} error - The error that occurred
     */
    _executeOnError(error) {
        if (!this.onError) return;
        this.onError(this, error);
    }
    
    /**
     * Handles the success of the task
     */
    _handleSuccess() {
        this.errorCount = 0;
        this.lastError = null;
        this._executeOnComplete();
        if (this.type === SCHEDULED_TASK_TYPE.INTERVAL 
            && (this.maxExecutions === null || this.executionCount < this.maxExecutions)) {
            this.status = SCHEDULED_TASK_STATUS.PENDING;
            this.nextExecutionTime = Date.now() + (this.interval || 0);
            return;
        }
        this.status = SCHEDULED_TASK_STATUS.COMPLETED;
    }
    
    /**
     * Handles the error of the task
     * @param {Error} error - The error that occurred
     */
    _handleError(error) {
        this.errorCount++;
        this.lastError = error;
        this._executeOnError(error);
        if (this.type === SCHEDULED_TASK_TYPE.INTERVAL 
            && (this.maxExecutions === null || this.executionCount < this.maxExecutions)) {
            this.status = SCHEDULED_TASK_STATUS.PENDING;
            this.nextExecutionTime = Date.now() + (this.interval || 0);
            return;
        }
        this.status = SCHEDULED_TASK_STATUS.ERROR;
    }

    /**
     * Executes the task
     * @returns {boolean} True if the task was executed, false otherwise
     */
    execute() {
        if (this.status !== SCHEDULED_TASK_STATUS.PENDING) return false;
        this.status = SCHEDULED_TASK_STATUS.RUNNING;
        this.lastExecutionTime = Date.now();
        this.executionCount++;
        this._executeOnStart();
        let callbackResult;
        try {
            callbackResult = this.callback(this);
        } catch (error) {
            this._handleError(error);
            return true;
        }
        // Handle promise-based callbacks
        if (callbackResult && typeof callbackResult.then === 'function') {
            callbackResult.then(() => this._handleSuccess()).catch((error) => this._handleError(error));
        } else {
            this._handleSuccess();
        }
        return true;
    }
    
    /**
     * Cancels the task
     */
    cancel() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
        this.status = SCHEDULED_TASK_STATUS.CANCELLED;
    }
    
    /**
     * Pauses the task
     */
    pause() {
        if (this.status !== SCHEDULED_TASK_STATUS.RUNNING && this.status !== SCHEDULED_TASK_STATUS.PENDING) return;
        this.cancel();
        this.status = SCHEDULED_TASK_STATUS.PAUSED;
    }
    
    /**
     * Resumes the task
     */
    resume() {
        if (this.status !== SCHEDULED_TASK_STATUS.PAUSED) return;
        this.status = SCHEDULED_TASK_STATUS.PENDING;
        this._setNextExecutionTime();
    }
}

export default ScheduledTask