/**
 * Application - A class for representing an application
 */
export class Application {
    /**
     * Creates a new Application instance
     * @param {string} name - The name of the application (required)
     * @param {object} manifest - The manifest of the application
     * @param {object} metadata - The metadata of the application
     */
    constructor(name, manifest = {}, metadata = {}) {
        if (!name || typeof name !== 'string') {
            throw new Error('Application name must be a non-empty string');
        }
        this._name = name;
        this._manifest = manifest;
        this._metadata = metadata;
    }

    /**
     * Returns the name of the application
     * @returns {string} - The name of the application
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the version of the application
     * @returns {string} - The version of the application
     */
    getVersion() {
        return this._manifest.version || '';
    }

    /**
     * Returns the description of the application
     * @returns {string} - The description of the application
     */
    getDescription() {
        return this._manifest.description || '';
    }

    /**
     * Returns the metadata of the application
     * @returns {Object} - The metadata of the application
     */
    getMetadata() {
        return this._metadata;
    }

    /**
     * Returns the manifest of the application
     * @returns {object} - The manifest of the application
     */
    getManifest() {
        return this._manifest;
    }

    /**
     * Called when the application is installed
     * @param {AppInstaller} appInstaller - The app installer instance
     */
    onInstall(appInstaller) {
        return this;
    }

    /**
     * Called when the application is uninstalled
     * @param {AppInstaller} appInstaller - The app installer instance
     */
    onUninstall(appInstaller) {
        return this;
    }

    /**
     * Called by system to run application
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the application
     * @returns {Promise<string>} - The result of the command execution
     */ 
    async main(commandLine, context = {}) {
        return '';
    }
}

export default Application