import { NETWORK_STATUS } from './network-status.js'

/**
 * SystemNetwork - A class for managing the system network
 */
export class SystemNetwork {
    /**
     * Creates a new SystemNetwork instance
     */
    constructor() {
        this.isOnline = window.navigator.onLine;
        
        this._onlineHandler = null;
        this._offlineHandler = null;

        this._init();
    }

    /**
     * Initializes the SystemNetwork instance
     */
    _init() {
        this._onlineHandler = () => {
            this.isOnline = true;
        };
        
        this._offlineHandler = () => {
            this.isOnline = false;
        };

        window.addEventListener('online', this._onlineHandler);
        window.addEventListener('offline', this._offlineHandler);
    }

    /**
     * Gets the status of the network
     * @returns {string} - The status of the network
     */
    getStatus() {
        return this.isOnline ? NETWORK_STATUS.ONLINE : NETWORK_STATUS.OFFLINE;
    }

    /**
     * Disposes the SystemNetwork instance
     */
    dispose() {
        window.removeEventListener('online', this._onlineHandler);
        window.removeEventListener('offline', this._offlineHandler);
    }

}

export default SystemNetwork