import { BrowserAPI } from '../../core/core.js'
import { ServiceProvider } from './service-provider.js'
import { SystemSettingsProvider } from './system-settings-provider.js'
import { Logger } from '../logger/logger.js'
import { Shell } from '../shell/shell.js'
import { TaskScheduler } from '../task-scheduler/task-scheduler.js'
import { FileSystemManager } from '../file-system/file-system-manager.js'
import { FileSystemExplorer } from '../file-system/file-system-explorer.js'
import { ApplicationManager } from '../application/application-manager.js'
import { ProcessManager } from '../process/process-manager.js'
import {
    DEFAULT_USER_NAME, DEFAULT_HOST_NAME, DEFAULT_HOST_ADDRESS, DEFAULT_ROOT_DIRECTORY_NAME,
    DEFAULT_FOLDERS, DEFAULT_PROGRAM_FOLDER, DEFAULT_USERS_FOLDER, DEFAULT_USERS_FOLDERS,
    README_FILE, LICENSES_FILE, FILE_SYSTEM_STORE_NAME, FILE_SYSTEM_STORE_VALUE_KEY
} from '../../config/file-system-config.js'
import { DATABASE_NAME, DATABASE_VERSION } from '../../config/database-config.js'
import { CLI_APPS } from '../../config/cli-apps.js'
import { TerminalResolver } from '../../application/terminal/terminal-resolver.js'

/**
 * BootLoader - Represents the boot loader for the OS
 */
export class BootLoader {
    /**
     * Creates a new BootLoader instance
     */
    constructor() {
        this.serviceProvider = new ServiceProvider();
        this.settingsProvider = new SystemSettingsProvider(DEFAULT_USER_NAME, DEFAULT_HOST_NAME, DEFAULT_HOST_ADDRESS);
        this.database = BrowserAPI.createDatabase({
            name: DATABASE_NAME,
            version: DATABASE_VERSION,
            stores: [FILE_SYSTEM_STORE_NAME],
        });
    }

    /**
     * Gets the service provider
     * @returns {ServiceProvider} - The service provider
     */
    getServiceProvider() {
        return this.serviceProvider;
    }

    /**
     * Gets the settings provider
     * @returns {SystemSettingsProvider} - The settings provider
     */
    getSettingsProvider() {
        return this.settingsProvider;
    }

    /**
     * Loads the file system from the database
     * @returns {Promise<FileSystemManager|null>} - The file system manager or null if it was not found
     */
    async _loadFileSystemFromDatabase() {
        try {
            const value = await this.database.get(FILE_SYSTEM_STORE_NAME, FILE_SYSTEM_STORE_VALUE_KEY);
            if (value) {
                return FileSystemManager.fromJSON(value);
            }
        } catch (error) {}
        return null;
    }

    /**
     * Boots the file system
     * @param {FileSystemManager} fileSystemManager - The file system manager
     */
    _bootFileSystem(fileSystemManager = null) {
        this.fileSystemManager = fileSystemManager ? fileSystemManager : new FileSystemManager(DEFAULT_ROOT_DIRECTORY_NAME);
        this.serviceProvider.add('fileSystemManager', this.fileSystemManager);
        this.fileSystemExplorer = new FileSystemExplorer(this.fileSystemManager);
        this.serviceProvider.add('fileSystemExplorer', this.fileSystemExplorer);
    }

    /**
     * Seeds the file system
     * @param {Application[]} cliApps - The CLI applications
     */
    _seedFileSystem(cliApps) {
        for (const folder of DEFAULT_FOLDERS) {
            this.fileSystemManager.createFromJSON('', folder);
        }
        const userName = this.settingsProvider.getUser().getName();
        for (const folder of DEFAULT_USERS_FOLDERS) {
            this.fileSystemManager.createDirectory(`${DEFAULT_USERS_FOLDER}/${userName}/${folder}`);
        }
        for (const app of cliApps) {
            this.fileSystemManager.createDirectory(`${DEFAULT_PROGRAM_FOLDER}/${app.getName()}`);
            this.fileSystemManager.createFile(`${DEFAULT_PROGRAM_FOLDER}/${app.getName()}/${app.getName()}.js`, app.constructor.toString());
        }
        this.fileSystemManager.createFile(`${README_FILE.name}`, README_FILE.content);
        this.fileSystemManager.createFile(`${LICENSES_FILE.name}`, LICENSES_FILE.content);
    }

    /**
     * Boots the applications
     * @param {Application[]} cliApps - The CLI applications
     */
    _bootApplications(cliApps) {
        for (const app of cliApps) {
            this.applicationManager.install(app, this.shell);
        }
    }

    /**
     * Boots the settings
     */
    _bootSettings() {
        this.serviceProvider.add('systemUser', this.settingsProvider.getUser());
        this.serviceProvider.add('systemHost', this.settingsProvider.getHost());
        this.serviceProvider.add('systemTime', this.settingsProvider.getTime());
    }

    /**
     * Boots the core services
     */
    _bootCoreServices() {
        this.logger = new Logger();
        this.serviceProvider.add('logger', this.logger);

        this.taskScheduler = new TaskScheduler();
        this.serviceProvider.add('taskScheduler', this.taskScheduler);

        this.applicationManager = new ApplicationManager(this.serviceProvider);
        this.serviceProvider.add('applicationManager', this.applicationManager);

        this.processManager = new ProcessManager(this.serviceProvider);
        this.serviceProvider.add('processManager', this.processManager);

        this.shell = new Shell(this.serviceProvider, this.settingsProvider);
        this.serviceProvider.add('shell', this.shell);

        this.shell.setProcessManager(this.processManager);
    }

    /**
     * Boots the terminal
     * @returns {Promise<void>} - The terminal
     */
    async _bootTerminal() {
        const terminalResolver = new TerminalResolver();
        const Terminal = await terminalResolver.resolve();
        this.terminal = new Terminal(this.rootContainerElement, this.serviceProvider);
        this.serviceProvider.add('terminal', this.terminal.api());

        this.shell.setTerminal(this.terminal.api());
    }

    /**
     * Loads the OS
     */
    async boot(rootContainerElement) {
        this.rootContainerElement = rootContainerElement;

        this._bootSettings();
        this._bootCoreServices();

        const fileSystemManager = await this._loadFileSystemFromDatabase();
        this._bootFileSystem(fileSystemManager);

        await this._bootTerminal();

        let cliApps = [...Object.values(CLI_APPS), ...this.terminal.getCliApplications()];
        this._bootApplications(cliApps);

        if (fileSystemManager) return;
        this._seedFileSystem(cliApps);
    }

    /**
     * Installs an application
     * @param {Application} application - The application to install
     * @returns {BootLoader} - The BootLoader instance
     */
    install(application) {
        this.applicationManager.install(application, this.shell);
        this.fileSystemManager.createDirectory(`${DEFAULT_PROGRAM_FOLDER}/${application.getName()}`);
        this.fileSystemManager.createFile(`${DEFAULT_PROGRAM_FOLDER}/${application.getName()}/${application.getName()}.js`, application.constructor.toString());
        return this;
    }
}

export default BootLoader