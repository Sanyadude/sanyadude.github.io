import Application from '../../components/application-components/application.js'
import { APP_ROOT_PATH } from '../../config/config.js'
import BrowserApplicationWindow from './browser-application-window.js'

const APP_PATH = `${APP_ROOT_PATH}/window-applications/browser`;
const NAME = 'Not a browser';
const APP_ID = 'browser';

export class BrowserApplication extends Application {
    constructor() {
        super({
            id: APP_ID,
            appName: NAME,
            appPath: APP_PATH,
            appIconPath: `${APP_PATH}/assets/icon.png`,
            applicationWindowClass: BrowserApplicationWindow
        });
    }

}

export default BrowserApplication