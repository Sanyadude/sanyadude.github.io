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
     * Gets all applications
     * @returns {Application[]} - The applications
     */
    getApplications() {
        return Array.from(this._registry.values()).map(entry => entry.application);
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
        if (!applicationEntry) return null;
        return applicationEntry.dependencies;
    }

    /**
     * Registers an application
     * @param {Application} application - The application to register
     * @param {string[]} dependencies - The dependencies of the application
     * @returns {ApplicationRegistry} - The application registry instance
     */
    register(application, dependencies = []) {
        this._registry.set(application.getName(), {
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