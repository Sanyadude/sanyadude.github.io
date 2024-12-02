import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect } from '../../../ui-tool-kit/index.js'
import UIResizableWindow from './ui-resizable-window.js'

export class ApplicationWindow {
    constructor(processId, app) {
        this.processId = processId;

        this.appId = app.id;
        this.appName = app.appName;
        this.appPath = app.appPath;
        this.appIcon = app.icon;

        this.window = null;
        this.task = null;

        this._init();
    }

    getWindowConfig(config) {
        return Object.assign({
            frame: new UIRect(10, 10, 800, 600),
            name: this.appName,
            icon: this.appIcon,
            showIcon: true
        }, config);
    }

    _init() {
        this.window = new UIResizableWindow(this.getWindowConfig());
        this.window.onClose = () => this.stop();
        this.window.onMinimize = () => EventEmitter.emit('application-window-minimized', { processId: this.processId });
        this.window.onMinimizeRestore = () => EventEmitter.emit('application-window-minimize-restored', { processId: this.processId });
    }

    start() {
        EventEmitter.emit('application-window-start', { applicationWindow: this });
    }

    stop() {
        EventEmitter.emit('application-window-stop', { applicationWindow: this });
    }

    openWindow() {
        this.window.open();
    }

    closeWindow() {
        this.window.close();
    }

    minimizeWindow() {
        this.window.minimize();
    }

    maximizeWindow() {
        this.window.maximize();
    }

    restoreWindow() {
        this.window.restore();
    }

    dispose() {

    }
}

export default ApplicationWindow