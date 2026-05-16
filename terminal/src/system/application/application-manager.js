import { ApplicationRegistry } from './application-registry.js'
import { Application } from './application.js'

/**
 * ApplicationManager - A class for managing applications
 */
export class ApplicationManager {
    /**
     * Creates a new ApplicationManager instance
     * @param {ServiceProvider} serviceProvider - The service provider instance
     */
    constructor(serviceProvider) {
        this._serviceProvider = serviceProvider;

        this._applicationRegistry = new ApplicationRegistry();
        this._programApplicationMap = new Map();
    }

    /**
     * Gets the application registry
     * @returns {ApplicationRegistry} - The application registry
     */
    getRegistry() {
        return this._applicationRegistry;
    }

    /**
     * Installs an application
     * @param {Application} application - The application to install
     * @param {Shell} shell - The shell instance
     * @returns {ApplicationManager} - The application manager instance
     */
    install(application, shell) {
        const manifest = application.getManifest();
        this._applicationRegistry.register(application, manifest.dependencies);
        if (manifest.type === 'cli') {
            shell.registerPrograms(manifest);
            if (Array.isArray(manifest.programs)) {
                for (const program of manifest.programs) {
                    this._programApplicationMap.set(program.name, application.getName());
                }
            }
        }
        if (application.onInstall) {
            application.onInstall(this);
        }
        return this;
    }

    /**
     * Uninstalls an application
     * @param {Application} application - The application to uninstall
     * @returns {ApplicationManager} - The application manager instance
     */
    uninstall(application) {
        if (!this._applicationRegistry.getApplication(application.getName())) return this;
        if (application.onUninstall) {
            application.onUninstall(this);
        }
        const manifest = application.getManifest();
        if (manifest.type === 'cli' && Array.isArray(manifest.programs)) {
            for (const program of manifest.programs) {
                this._programApplicationMap.delete(program.name);
            }
        }
        this._applicationRegistry.unregister(application.getName());
        return this;
    }

    /**
     * Executes a program
     * @param {string} programName - The name of the program to execute
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {Promise<string|null>} - The result of the program execution or null if the program was not found
     */
    async execute(programName, commandLine) {
        const applicationName = this._programApplicationMap.get(programName);
        if (!applicationName) return null;
        const application = this._applicationRegistry.getApplication(applicationName);
        if (!application) return null;
        const context = {};
        const dependencies = this._applicationRegistry.getDependencies(applicationName);
        for (const dependency of dependencies) {
            context[dependency] = this._serviceProvider.get(dependency);
        }
        return await application.main(commandLine, context);
    }
}

export default ApplicationManager