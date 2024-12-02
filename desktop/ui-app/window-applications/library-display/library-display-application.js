import Application from '../../components/application-components/application.js'
import { APP_ROOT_PATH } from '../../config/config.js'
import { LibraryDisplayApplicationWindow } from './library-display-application-window.js'

const APP_PATH = `${APP_ROOT_PATH}/window-applications/library-display`
const NAME = 'UIToolKit description';
const APP_ID = 'libraryDisplay';

export class LibraryDisplayApplication extends Application {
    constructor() {
        super({
            id: APP_ID,
            appName: NAME,
            appPath: APP_PATH,
            applicationWindowClass: LibraryDisplayApplicationWindow
        });
    }

}

export default LibraryDisplayApplication