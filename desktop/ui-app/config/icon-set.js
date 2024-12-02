import { UIImage } from '../../ui-tool-kit/index.js'
import { ICON_ASSETS_PATH } from './config.js'

export class IconSet {
    static get folder() {
        return new UIImage('Folder', `${ICON_ASSETS_PATH}/folder.ico`);
    }

    static get file() {
        return new UIImage('File', `${ICON_ASSETS_PATH}/file.ico`);
    }

    static get fileApplication() {
        return new UIImage('Application File', `${ICON_ASSETS_PATH}/file-application.ico`);
    }

    static get fileDll() {
        return new UIImage('Dll File', `${ICON_ASSETS_PATH}/file-dll.ico`);
    }

    static get fileDocument() {
        return new UIImage('Document File', `${ICON_ASSETS_PATH}/file-document.ico`);
    }

    static get fileImage() {
        return new UIImage('Image File', `${ICON_ASSETS_PATH}/file-image.ico`);
    }

    static get fileMusic() {
        return new UIImage('Music File', `${ICON_ASSETS_PATH}/file-music.ico`);
    }

    static get fileVideo() {
        return new UIImage('Video File', `${ICON_ASSETS_PATH}/file-video.ico`);
    }

    static get recycleBinEmpty() {
        return new UIImage('Recycle Bin Empty', `${ICON_ASSETS_PATH}/recycle-bin-empty.ico`);
    }

    static get recycleBinFull() {
        return new UIImage('Recycle Bin Full', `${ICON_ASSETS_PATH}/recycle-bin-full.ico`);
    }

    static get shortcutArrow() {
        return new UIImage('', `${ICON_ASSETS_PATH}/shortcut-arrow.png`);
    }
}

export default IconSet