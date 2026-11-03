/**
 * ApplicationExecutionContext - Combines DI services with per-run runtime data.
 */
export class ApplicationExecutionContext {
    /**
     * Creates a new ApplicationExecutionContext instance
     * @param {object} services The services
     * @param {object} runtime The runtime
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
     * @returns {object} The runtime
     */
    getRuntime() {
        return this._runtime;
    }

    /**
     * Gets a service
     * @param {string} name The name of the service
     * @returns {object} The service
     */
    get(name) {
        return this._services[name];
    }

    /**
     * Requires a service
     * @param {string} name The name of the service
     * @returns {object} The service
     */
    require(name) {
        const service = this._services[name];
        if (!service) {
            throw new Error(`Missing dependency: ${name}`);
        }
        return service;
    }

    /**
     * Checks if a service exists
     * @param {string} name The name of the service
     * @returns {boolean} Whether the service exists
     */
    has(name) {
        return Object.prototype.hasOwnProperty.call(this._services, name);
    }

    /**
     * Gets all services
     * @returns {Object<string, object>} The services
     */
    getServices() {
        return { ...this._services };
    }
}

export default ApplicationExecutionContext