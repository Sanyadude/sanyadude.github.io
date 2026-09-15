/**
 * ApplicationExecutionContext - Combines DI services with per-run runtime data.
 */
export class ApplicationExecutionContext {
    /**
     * Creates a new ApplicationExecutionContext instance
     * @param {object} services - The services
     * @param {object} runtime - The runtime
     */
    constructor(services = {}, runtime = {}) {
        this._services = { ...services };
        this._runtime = runtime;
        for (const [name, service] of Object.entries(this._services)) {
            this[name] = service;
        }
    }

    /**
     * Gets the runtime
     * @returns {object} - The runtime
     */
    getRuntime() {
        return this._runtime;
    }

    /**
     * @param {string} name
     * @returns {any}
     */
    get(name) {
        return this._services[name];
    }

    /**
     * @param {string} name
     * @returns {any}
     */
    require(name) {
        const service = this._services[name];
        if (!service) {
            throw new Error(`Missing dependency: ${name}`);
        }
        return service;
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return Object.prototype.hasOwnProperty.call(this._services, name);
    }

    /**
     * @returns {Object<string, any>}
     */
    getServices() {
        return { ...this._services };
    }
}

export default ApplicationExecutionContext