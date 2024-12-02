import ApplicationRoot from './application-root.js'
import ApplicationManager from './application-manager.js'
import Desktop from './desktop-components/desktop.js'
import TaskBar from './task-bar-components/task-bar.js'
import EventEmitter from '../../event-emmiter/event-emmiter.js'
import SystemManager from './system-components/system-manager.js'
import LoadingScreen from './loading-components/loading-screen-component.js'

const WINDOWS_DESKTOP_APPLICATION_LOADING_DELAY = 0;

export class WindowsDesktopApplication {
    constructor(rootElement) {
        //root
        this.applicationRoot = new ApplicationRoot(rootElement);
        //size
        this.width = this.applicationRoot.width;
        this.height = this.applicationRoot.height;
        //desktop
        this.loadingScreen = new LoadingScreen(this);
        this.desktop = new Desktop(this);
        this.taskBar = new TaskBar(this);
        //applications management
        this.applicationManager = new ApplicationManager(this);
        //system management
        this.systemManager = new SystemManager();
        //init
        this._init();
    }

    getSize() {
        return {
            width: this.width,
            height: this.height
        }
    }

    installApplication(application) {
        const applicationId = this.applicationManager.installApplication(application);
        return applicationId;
    }

    addApplicationShortcut(applicationId, shortcutName, action) {
        const shortcut = this.applicationManager.createApplicationShortcut(applicationId, shortcutName, action);
        this.desktop.addShortcut(shortcut);
        return shortcut;
    }

    addShortcut(shortcutConfig) {
        const shortcut = this.desktop.createShortcut(shortcutConfig);
        this.desktop.addShortcut(shortcut);
        return shortcut;
    }

    _init() {
        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.width = payload.width;
            this.height = payload.height;
        });

        this.loadingTimeoutHandler = setTimeout(() => EventEmitter.emit('windows-desktop-application-initialized', { application: this }), WINDOWS_DESKTOP_APPLICATION_LOADING_DELAY);
    }
}

export default WindowsDesktopApplication