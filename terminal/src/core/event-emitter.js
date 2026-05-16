/**
 * EventEmitter - A class for event emission and subscription
 */
export class EventEmitter {
    /**
     * Creates a new EventEmitter
     * @param {object} options - The options for the EventEmitter
     * @param {string} options.name - The name of the EventEmitter
     */
    constructor(options = {}) {
        const defaultOptions = {
            name: 'event-emitter',
        };
        this._options = { ...defaultOptions, ...(options || {}) };
        this._name = this._options.name;
        this._eventListeners = {};
    }

    /**
     * Subscribes to an event
     * @param {string} name - The name of the event
     * @param {Function} callback - The callback to call when the event is emitted
     * @param {object} options - The options for the event
     * @returns {EventEmitter} The EventEmitter
     */
    subscribe(name, callback, options = {}) {
        if (typeof name !== 'string' || name === '') {
            throw new Error('Event name must be a non-empty string');
        }
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        if (!this._eventListeners[name]) {
            this._eventListeners[name] = [];
        }
        const optionsDefault = {
            emitted: 0
        };
        const clonedOptions = Object.assign({}, optionsDefault, options);
        this._eventListeners[name].push({ 
            callback: callback,
            options: clonedOptions
        });
        return this;
    }

    /**
     * Alias for subscribe
     * @param {string} name - The name of the event
     * @param {Function} callback - The callback to call when the event is emitted
     * @param {object} options - The options for the event
     * @returns {EventEmitter} The EventEmitter
     */
    on(name, callback, options = {}) {
        return this.subscribe(name, callback, options);
    }

    /**
     * Subscribes to an event once
     * @param {string} name - The name of the event
     * @param {Function} callback - The callback to call when the event is emitted
     * @param {object} options - The options for the event
     * @returns {EventEmitter} The EventEmitter
     */
    subscribeOnce(name, callback, options = {}) {
        const clonedOptions = Object.assign({}, { emitTimes: 1 }, options);
        return this.subscribe(name, callback, clonedOptions);
    }

    /**
     * Alias for subscribeOnce
     * @param {string} name - The name of the event
     * @param {Function} callback - The callback to call when the event is emitted
     * @param {object} options - The options for the event
     * @returns {EventEmitter} The EventEmitter
     */
    once(name, callback, options = {}) {
        return this.subscribeOnce(name, callback, options);
    }

    /**
     * Unsubscribes from an event
     * @param {string} name - The name of the event
     * @param {Function} callback - The callback to unsubscribe
     * @returns {EventEmitter} The EventEmitter
     */
    unsubscribe(name, callback) {
        if (typeof name !== 'string') return this;
        const listeners = this._eventListeners[name];
        if (!listeners) return this;
        this._eventListeners[name] = listeners.filter(listener => listener.callback !== callback);
        if (this._eventListeners[name].length === 0) {
            delete this._eventListeners[name];
        }
        return this;
    }

    /**
     * Alias for unsubscribe
     * @param {string} name - The name of the event
     * @param {Function} callback - The callback to unsubscribe
     * @returns {EventEmitter} The EventEmitter
     */
    off(name, callback) {
        return this.unsubscribe(name, callback);
    }

    /**
     * Emits an event
     * @param {string} name - The name of the event
     * @param {object} payload - The payload to emit
     * @returns {EventEmitter} The EventEmitter
     */
    emit(name, payload) {
        if (typeof name !== 'string') return this;
        const listeners = this._eventListeners[name];
        if (!listeners) return this;
        listeners.forEach(listener => {
            listener.callback.call(this, payload, listener.options);
            listener.options.emitted++;
            if(!listener.options.emitTimes || listener.options.emitTimes > listener.options.emitted) return;
            this.unsubscribe(name, listener.callback);
        });
        return this;
    }

    /**
     * Alias for emit
     * @param {string} name - The name of the event
     * @param {object} payload - The payload to emit
     * @returns {EventEmitter} The EventEmitter
     */
    trigger(name, payload) {
        return this.emit(name, payload);
    }
}

/**
 * Creates a event emitter factory
 * @param {object} options - The options for the event emitter factory
 * @returns {Object} The event emitter factory
 */
export const createEventEmitterFactory = () => {
    return {
        eventEmitter: (options = {}) => new EventEmitter(options),
    }
}

export default EventEmitter