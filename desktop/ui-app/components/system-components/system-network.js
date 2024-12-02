import EventEmitter from '../../../event-emmiter/event-emmiter.js'

export const SYSTEM_NETWORK_STATUS = Object.freeze({
    online: 'ONLINE',
    offline: 'OFFLINE',
})

const NAVIGATOR_STATUS = window.navigator.onLine ? SYSTEM_NETWORK_STATUS.online : SYSTEM_NETWORK_STATUS.offline;

export class SystemNetwork {
    constructor() {
        this.status = NAVIGATOR_STATUS;
        this.isOnline = this.status == SYSTEM_NETWORK_STATUS.online;
        this._init();
    }

    _init() {
        window.addEventListener('online', () => {
            this.status = SYSTEM_NETWORK_STATUS.online;
            this.isOnline = true;
            EventEmitter.emit('system-network-status-changed', { status: this.status, isOnline: this.isOnline });
        });
        window.addEventListener('offline', () => {
            this.status = SYSTEM_NETWORK_STATUS.offline;
            this.isOnline = false;
            EventEmitter.emit('system-network-status-changed', { status: this.status, isOnline: this.isOnline });
        });

        EventEmitter.emit('system-network-status-changed', { status: this.status, isOnline: this.isOnline });
    }

}

export default SystemNetwork;