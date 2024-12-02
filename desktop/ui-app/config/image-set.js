import { UIImage } from '../../ui-tool-kit/index.js'
import { IMAGE_ASSETS_PATH } from './config.js'

export class ImageSet {
    static get desktopBackground() {
        return new UIImage('Desktop Background', `${IMAGE_ASSETS_PATH}/desktop-background.jpg`);
    }
}

export default ImageSet