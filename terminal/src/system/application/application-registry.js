/**
 * ApplicationRegistry - A class for managing applications
 */
export class ApplicationRegistry {
    /**
     * Creates a new ApplicationRegistry instance
     */
    constructor() {
        this._registry = new Map();
    }

    /**
     * Gets a registry entry by name
     * @param {string} name - The name of the registry entry
     * @returns {Object<Application, string[]>} - The registry entry
     */
    get(name) {
        const entry = this._registry.get(name);
        if (!entry) return null;
        return entry;
    }

    /**
     * Checks if an application is registered by name
     * @param {string} name - The name of the application
     * @returns {boolean} - True if the application is registered, false otherwise
     */
    has(name) {
        return this._registry.has(name);
    }

    /**
     * Gets all applications and their dependencies
     * @returns {Object<Application, string[]>} - The applications and their dependencies
     */
    values() {
        return [...this._registry.values()];
    }

    /**
     * Gets an application by name
     * @param {string} name - The name of the application
     * @returns {Application} - The application
     */
    getApplication(name) {
        const applicationEntry = this._registry.get(name);
        if (!applicationEntry) return null;
        return applicationEntry.application;
    }

    /**
     * Gets the dependencies of an application by name
     * @param {string} name - The name of the application
     * @returns {string[]} - The dependencies of the application
     */
    getDependencies(name) {
        const applicationEntry = this._registry.get(name);
        if (!applicationEntry) return [];
        return [...applicationEntry.dependencies];
    }

    /**
     * Registers an application
     * @param {Application} application - The application to register
     * @param {string[]} dependencies - The dependencies of the application
     * @returns {ApplicationRegistry} - The application registry instance
     * @throws {Error} - If the application is already registered
     */
    register(application, dependencies = []) {
        const name = application.getName();
        if (this._registry.has(name)) {
            throw new Error(`Application "${name}" is already registered`);
        }
        this._registry.set(name, {
            application,
            dependencies,
        });
        return this;
    }

    /**
     * Unregisters an application
     */
    unregister(name) {
        this._registry.delete(name);
        return this;
    }
}   

export default ApplicationRegistry