import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIImage } from '../../../ui-tool-kit/index.js'
import IconSet from '../../config/icon-set.js'

export class Application {
    constructor({ id, appName, appPath, applicationWindowClass, appIconPath } = {}) {
        this.id = id;
        this.appName = appName;
        this.appPath = appPath;
        this.icon = appIconPath 
            ? new UIImage(appName, appIconPath)
            : IconSet.file.copy();
        this.applicationWindowClass = applicationWindowClass;
    }

    startProcess(callback) {
        EventEmitter.emit('application-process-start', { appId: this.id, callback: callback });
    }

    createApplicationWindow(processId) {
        const applicationWindow = new this.applicationWindowClass(processId, this);
        return applicationWindow;
    }

}

export default Application