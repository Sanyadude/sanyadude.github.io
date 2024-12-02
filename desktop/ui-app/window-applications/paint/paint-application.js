import Application from '../../components/application-components/application.js'
import { APP_ROOT_PATH } from '../../config/config.js'
import PaintApplicationWindow from './paint-application-window.js'

const APP_PATH = `${APP_ROOT_PATH}/window-applications/paint`;
const NAME = 'Not a Paint';
const APP_ID = 'paint';

export class PaintApplication extends Application {
    constructor() {
        super({
            id: APP_ID,
            appName: NAME,
            appPath: APP_PATH,
            appIconPath: `${APP_PATH}/assets/icon.png`,
            applicationWindowClass: PaintApplicationWindow
        });
    }

}

export default PaintApplication