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
    README_FILE, LICENSES_FILE 
} from '../../config/file-system-config.js'
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
     * Loads the OS
     */
    async boot(rootContainerElement) {
        this.rootContainerElement = rootContainerElement;
        this.serviceProvider.add('systemUser', this.settingsProvider.getUser());
        this.serviceProvider.add('systemHost', this.settingsProvider.getHost());
        this.serviceProvider.add('systemTime', this.settingsProvider.getTime());

        this.fileSystemManager = new FileSystemManager(DEFAULT_ROOT_DIRECTORY_NAME);
        this.serviceProvider.add('fileSystemManager', this.fileSystemManager);

        this.fileSystemExplorer = new FileSystemExplorer(this.fileSystemManager);
        this.serviceProvider.add('fileSystemExplorer', this.fileSystemExplorer);

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

        const terminalResolver = new TerminalResolver();
        const Terminal = await terminalResolver.resolve();
        this.terminal = new Terminal(this.rootContainerElement, this.serviceProvider);
        this.serviceProvider.add('terminal', this.terminal.api());

        this.shell.setTerminal(this.terminal.api());
        this.shell.setProcessManager(this.processManager);

        for (const folder of DEFAULT_FOLDERS) {
            this.fileSystemManager.createFromJSON('', folder);
        }
        for (const folder of DEFAULT_USERS_FOLDERS) {
            this.fileSystemManager.createDirectory(`${DEFAULT_USERS_FOLDER}/${this.settingsProvider.getUser().getName()}/${folder}`);
        }
        for (const app of Object.values(CLI_APPS)) {
            this.install(app);
        }
        for (const app of this.terminal.getCliApplications()) {
            this.install(app);
        }
        this.fileSystemManager.createFile(`${README_FILE.name}`, README_FILE.content);
        this.fileSystemManager.createFile(`${LICENSES_FILE.name}`, LICENSES_FILE.content);
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