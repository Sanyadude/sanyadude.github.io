export class EventEmitter {
    static eventListeners = {};

    static subscribe(name, callback, options) {
        if (!this.eventListeners[name]) {
            this.eventListeners[name] = [];
        }
        const optionsDefault = {
            emitted: 0
        };
        this.eventListeners[name].push({ 
            callback: callback,
            options: Object.assign(optionsDefault, options) 
        });
    }

    static on(name, callback, options) {
        this.subscribe(name, callback, options);
    }

    static subscribeOnce(name, callback, options) {
        const optionsDefault = {
            emitTimes: 1
        };
        this.subscribe(name, callback, Object.assign(optionsDefault, options));
    }

    static once(name, callback, options) {
        this.subscribeOnce(name, callback, options);
    }

    static unsubscribe(name, callback) {
        const listeners = this.eventListeners[name];
        if (!listeners) return;
        this.eventListeners[name] = listeners.filter(listener => listener.callback != callback);
    }

    static off(name, callback) {
        this.unsubscribe(name, callback);
    }

    static emit(name, payload) {
        const listeners = this.eventListeners[name];
        if (!listeners) return;
        listeners.forEach(listener => {
            listener.callback.call(null, payload, listener.options);
            listener.options.emitted++;
            if(!listener.options.emitTimes || listener.options.emitTimes > listener.options.emitted) return;
            this.unsubscribe(name, listener.callback);
        });
    }

    static trigger(name, payload) {
        this.emit(name, payload);
    }
}

export default EventEmitter