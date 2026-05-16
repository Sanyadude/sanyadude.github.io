import { SCHEDULED_TASK_TYPE } from './scheduled-task-type.js'
import { SCHEDULED_TASK_STATUS } from './scheduled-task-status.js'
import { ScheduledTask } from './scheduled-task.js'

/**
 * Generates a unique task id
 * @returns {number} - The next task id
 */
const nextId = (() => {
    let id = 0;
    return () => ++id;
})();

/**
 * TaskScheduler - A class for a task scheduler
 */
export class TaskScheduler {
    /**
     * Creates a new task scheduler
     */
    constructor() {
        this.tasks = new Map();
        this.isRunning = false;
        this.checkInterval = 1000; // milliseconds - how often to check scheduled tasks
        
        this._checkIntervalId = null;
        
        this._init();
    }
    
    /**
     * Initializes the scheduler
     */
    _init() {
        // initialize the scheduler
    }
    
    /**
     * Stops the scheduler
     */
    _stopScheduler() {
        if (!this._checkIntervalId) return;
        clearInterval(this._checkIntervalId);
        this._checkIntervalId = null;
    }
    
    /**
     * Processes the scheduled tasks
     */
    _processScheduledTasks() {
        const now = Date.now();
        this.tasks.forEach((task) => {
            if (task.status !== SCHEDULED_TASK_STATUS.PENDING || task.nextExecutionTime > now) return;
            task.execute();
        });
    }

    /**
     * Schedules a new task
     * @param {string} name - The name of the task
     * @param {Function} callback - The callback to execute when the task is executed
     * @param {object} options - The options for the scheduled task
     * @returns {number} The id of the scheduled task
     */
    schedule(name, callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        const id = nextId();
        const task = new ScheduledTask(id, name, callback, options);
        this.tasks.set(id, task);
        if (task.type === SCHEDULED_TASK_TYPE.IMMEDIATE && task.delay === 0) {
            task.execute();
        }
        return id;
    }

    /**
     * Schedules a new task at a specific time
     * @param {string} name - The name of the task
     * @param {Function} callback - The callback to execute when the task is executed
     * @param {Date} scheduledTime - The time to schedule the task at
     * @param {object} options - The options for the scheduled task
     * @returns {number} The id of the scheduled task
     */
    scheduleAt(name, callback, scheduledTime, options = {}) {
        const timestamp = scheduledTime instanceof Date ? scheduledTime.getTime() : scheduledTime;
        return this.schedule(name, callback, {
            ...options,
            type: SCHEDULED_TASK_TYPE.SCHEDULE,
            scheduledTime: timestamp
        });
    }

    /**
     * Schedules a new task after a delay
     * @param {string} name - The name of the task
     * @param {Function} callback - The callback to execute when the task is executed
     * @param {number} delay - The delay in milliseconds
     * @param {object} options - The options for the scheduled task
     * @returns {number} The id of the scheduled task
     */
    scheduleAfter(name, callback, delay, options = {}) {
        return this.schedule(name, callback, {
            ...options,
            type: SCHEDULED_TASK_TYPE.DELAY,
            delay: delay
        });
    }

    /**
     * Schedules a new task at a specific interval
     * @param {string} name - The name of the task
     * @param {Function} callback - The callback to execute when the task is executed
     * @param {number} interval - The interval in milliseconds
     * @param {object} options - The options for the scheduled task
     * @returns {number} The id of the scheduled task
     */
    scheduleInterval(name, callback, interval, options = {}) {
        return this.schedule(name, callback, {
            ...options,
            type: SCHEDULED_TASK_TYPE.INTERVAL,
            interval: interval
        });
    }

    /**
     * Gets a task by its id
     * @param {number} taskId - The id of the task
     * @returns {ScheduledTask} The task
     */
    getTask(taskId) {
        return this.tasks.get(taskId) || null;
    }

    /**
     * Gets all tasks
     * @returns {ScheduledTask[]} All tasks
     */
    getAllTasks() {
        return Array.from(this.tasks.values());
    }

    /**
     * Pauses a task by its id
     * @param {number} taskId - The id of the task
     * @returns {boolean} True if the task was paused, false otherwise
     */
    pauseTask(taskId) {
        const task = this.getTask(taskId);
        if (!task) return false;
        task.pause();
        return true;
    }

    /**
     * Pauses all tasks
     */
    pauseAllTasks() {
        this.tasks.forEach((task) => this.pauseTask(task.id));
    }

    /**
     * Resumes a task by its id
     * @param {number} taskId - The id of the task
     * @returns {boolean} True if the task was resumed, false otherwise
     */
    resumeTask(taskId) {
        const task = this.getTask(taskId);
        if (!task) return false;
        task.resume();
        return true;
    }

    /**
     * Resumes all tasks
     */
    resumeAllTasks() {
        this.tasks.forEach((task) => this.resumeTask(task.id));
    }

    /**
     * Cancels a task by its id
     * @param {number} taskId - The id of the task
     * @returns {boolean} True if the task was cancelled, false otherwise
     */
    cancelTask(taskId) {
        const task = this.getTask(taskId);
        if (!task) return false;
        task.cancel();
        return true;
    }

    /**
     * Cancels all tasks
     */
    cancelAllTasks() {
        this.tasks.forEach((task) => this.cancelTask(task.id));
    }

    /**
     * Removes a task by its id
     * @param {number} taskId - The id of the task
     * @returns {boolean} True if the task was removed, false otherwise
     */
    removeTask(taskId) {
        const task = this.getTask(taskId);
        if (!task) return false;
        task.cancel();
        this.tasks.delete(taskId);
        return true;
    }

    /**
     * Removes all tasks
     */
    removeAllTasks() {
        this.tasks.forEach((task) => this.removeTask(task.id));
    }

    /**
     * Starts the scheduler
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        clearInterval(this._checkIntervalId);
        this._checkIntervalId = setInterval(() => {
            this._processScheduledTasks();
        }, this.checkInterval);
    }

    /**
     * Stops the scheduler
     */
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this._checkIntervalId) {
            clearInterval(this._checkIntervalId);
            this._checkIntervalId = null;
        }
    }

    /**
     * Disposes the scheduler
     */
    dispose() {
        this.stop();
        this.removeAllTasks();
    }
}

export default TaskScheduler