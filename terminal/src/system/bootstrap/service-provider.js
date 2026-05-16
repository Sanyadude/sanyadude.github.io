/**
 * ServiceProvider - A class for managing services
 */
export class ServiceProvider {
    /**
     * Creates a new ServiceProvider instance
     */
    constructor() {
        this._services = new Map();
    }

    /**
     * Adds a service to the service provider
     * @param {string} name - The name of the service
     * @param {object} service - The service to add
     * @returns {ServiceProvider} - The service provider instance
     */
    add(name, service) {
        this._services.set(name, service);
        return this;
    }

    /**
     * Removes a service from the service provider
     * @param {string} name - The name of the service
     * @returns {ServiceProvider} - The service provider instance
     */
    remove(name) {
        this._services.delete(name);
        return this;
    }

    /**
     * Gets a service from the service provider
     * @param {string} name - The name of the service
     * @returns {object} - The service
     */
    get(name) {
        return this._services.get(name);
    }
}

export default ServiceProvider