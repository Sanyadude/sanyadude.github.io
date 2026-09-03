import { BrowserAPI } from '../../core/core.js'
import { ServiceProvider } from './service-provider.js'
import { SystemSettingsProvider } from './system-settings-provider.js'
import { ConfigProvider } from './config-provider.js'
import { Logger } from '../logger/logger.js'
import { ConsoleLogTarget } from '../logger/targets/console-log-target.js'
import { Shell } from '../shell/shell.js'
import { TaskScheduler } from '../task-scheduler/task-scheduler.js'
import { FileSystemManager } from '../file-system/file-system-manager.js'
import { FileSystemExplorer } from '../file-system/file-system-explorer.js'
import { ApplicationManager } from '../application/application-manager.js'
import { ProcessManager } from '../process/process-manager.js'
import {
    DEFAULT_ROOT_DIRECTORY_NAME, DEFAULT_FOLDERS, DEFAULT_PROGRAM_FOLDER, DEFAULT_USERS_FOLDER, DEFAULT_USERS_FOLDERS,
    README_FILE, LICENSE_FILE, FILE_SYSTEM_STORE_NAME, FILE_SYSTEM_STORE_VALUE_KEY
} from '../../config/file-system-config.js'
import { DATABASE_NAME, DATABASE_VERSION } from '../../config/database-config.js'
import { 
    CONFIG_STORE_NAME, CONFIG_STORE_VALUE_KEY, 
    DEFAULT_USER_NAME, DEFAULT_HOST_NAME, DEFAULT_HOST_ADDRESS 
} from '../../config/boot-config.js'
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
            stores: [FILE_SYSTEM_STORE_NAME, CONFIG_STORE_NAME],
        });
        this.logger = new Logger({
            targets: [new ConsoleLogTarget()]
        });
        this.initialState = {
            actions: [],
            configs: {},
            terminalVersion: null
        };
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
     * Gets the database
     * @returns {Database} - The database
     */
    getDatabase() {
        return this.database;
    }

    /**
     * Gets the logger
     * @returns {Logger} - The logger
     */
    getLogger() {
        return this.logger;
    }

    /**
     * Loads the URL parameters
     */
    _loadUrlParams() {
        const urlParams = BrowserAPI.getUrlParamsAsJson();
        for (const [key, value] of Object.entries(urlParams)) {
            if (key === 'terminal-version') {
                this.initialState.terminalVersion = Number(value);
                continue;
            }
            if (key === 'actions') {
                this.initialState.actions.push(...value.split(','));
                continue;
            }
            this.initialState.configs[key] = value;
        }

        if (Object.keys(urlParams).length > 0) {
            this.logger.info(`URL parameters loaded: ${JSON.stringify(urlParams)}`);
        }
    }

    /**
     * Triggers the before boot actions
     */
    async _triggerBeforeBootActions() {
        const triggeredActions = [];
        for (const action of this.initialState.actions) {
            switch (action) {
                case 'destroy-database':
                    await this.database.destroy();
                    triggeredActions.push(action);
                    break;
            }
        }

        if (triggeredActions.length > 0) {
            this.logger.info(`Before boot actions triggered: ${JSON.stringify(triggeredActions)}`);
        }
    }

    /**
     * Triggers the after boot actions
     */
    async _triggerAfterBootActions() {
        const triggeredActions = [];
        for (const action of this.initialState.actions) {
            //
        }
        if (triggeredActions.length > 0) {
            this.logger.info(`After boot actions triggered: ${JSON.stringify(triggeredActions)}`);
        }
    }

    /**
     * Loads the config from the database
     * @returns {Promise<ConfigProvider|null>} - The config provider or null if it was not found
     */
    async _loadConfigFromDatabase() {
        try {
            const value = await this.database.get(CONFIG_STORE_NAME, CONFIG_STORE_VALUE_KEY);
            if (value) {
                return ConfigProvider.fromJSON(value, () => this._saveConfigToDatabase());
            }
        } catch (error) {
            this.logger?.error(error);
        }
        return null;
    }

    /**
     * Saves the config to the database
     * @returns {Promise<void>} - The config provider
     */
    async _saveConfigToDatabase() {
        await this.database.put(
            CONFIG_STORE_NAME,
            this.configProvider.toJSON(),
            CONFIG_STORE_VALUE_KEY
        );
    }

    /**
     * Saves the file system to the database
     * @returns {Promise<void>} - The file system manager
     */
    async _saveFileSystemToDatabase() {
        await this.database.put(
            FILE_SYSTEM_STORE_NAME,
            this.fileSystemManager.toJSON(),
            FILE_SYSTEM_STORE_VALUE_KEY
        );
    }

    /**
     * Boots the configurations
     */
    _bootConfigurations(configProvider) {
        this.configProvider = configProvider ? configProvider : new ConfigProvider({}, () => this._saveConfigToDatabase());
        this.serviceProvider.add('configProvider', this.configProvider);
        for (const [key, value] of Object.entries(this.initialState.configs)) {
            this.configProvider.set(key, value);
        }

        this.logger.info(`Config provider initialized`);
        if (Object.keys(this.initialState.configs).length > 0) {
            this.logger.info(`Initial configs loaded: ${JSON.stringify(this.initialState.configs)}`);
        }
    }

    /**
     * Boots the settings
     */
    _bootSettings() {
        this.serviceProvider.add('systemUser', this.settingsProvider.getUser());
        this.serviceProvider.add('systemHost', this.settingsProvider.getHost());
        this.serviceProvider.add('systemTime', this.settingsProvider.getTime());

        this.logger.info(`System settings initialized`);
    }

    /**
     * Boots the core services
     */
    _bootCoreServices() {
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

        this.logger.info(`Core services initialized`);
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
        } catch (error) {
            this.logger?.error(error);
        }
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

        this.logger.info(`File system initialized`);
    }

    /**
     * Boots the terminal
     * @returns {Promise<void>} - The terminal
     */
    async _bootTerminal() {
        const terminalResolver = new TerminalResolver();
        const Terminal = await terminalResolver.resolve(this.initialState.terminalVersion);
        this.terminal = new Terminal(this.rootContainerElement, this.serviceProvider);
        this.serviceProvider.add('terminal', this.terminal.api());

        this.shell.setTerminal(this.terminal.api());

        this.logger.info(`Terminal initialized`);
    }

    /**
     * Boots the applications
     * @param {Application[]} cliApps - The CLI applications
     */
    _bootApplications(cliApps) {
        for (const app of cliApps) {
            this.applicationManager.install(app, this.shell);
        }

        this.logger.info(`Applications installed`);
    }

    /**
     * Seeds the file system
     * @param {Application[]} cliApps - The CLI applications
     */
    async _seedFileSystem(cliApps) {
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
        const seedFiles = [README_FILE, LICENSE_FILE];
        for (const file of seedFiles) {
            const response = await BrowserAPI.fetchFile(file.url);
            const content = new TextDecoder().decode(response);
            this.fileSystemManager.createFile(file.name, content);
        }

        this.logger.info(`File system seeded`);
    }

    /**
     * Loads the OS
     */
    async boot(rootContainerElement) {
        this.rootContainerElement = rootContainerElement;
        this.logger.info(`Booting started`);

        this._loadUrlParams();
        await this._triggerBeforeBootActions();

        const configProvider = await this._loadConfigFromDatabase();
        this._bootConfigurations(configProvider);

        this._bootSettings();
        this._bootCoreServices();

        const fileSystemManager = await this._loadFileSystemFromDatabase();
        this._bootFileSystem(fileSystemManager);

        await this._bootTerminal();

        let cliApps = [...Object.values(CLI_APPS), ...this.terminal.getCliApplications()];
        this._bootApplications(cliApps);

        if (!fileSystemManager) {
            await this._seedFileSystem(cliApps);
        }

        await this._triggerAfterBootActions();

        this.logger.info(`Booting completed`);
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