import Application from '../../components/application-components/application.js'
import { APP_ROOT_PATH } from '../../config/config.js'
import GalleryApplicationWindow from './gallery-application-window.js'

const APP_PATH = `${APP_ROOT_PATH}/window-applications/gallery`;
const NAME = 'Not a gallery';
const APP_ID = 'gallery';

export class GalleryApplication extends Application {
    constructor() {
        super({
            id: APP_ID,
            appName: NAME,
            appPath: APP_PATH,
            appIconPath: `${APP_PATH}/assets/icon.png`,
            applicationWindowClass: GalleryApplicationWindow
        });
    }

}

export default GalleryApplication