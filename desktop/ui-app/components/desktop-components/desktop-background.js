import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIImage, UIImageView, UIRect, UISizeMode } from '../../../ui-tool-kit/index.js'
import { DESKTOP_DEFAULT_BACKGROUND_IMAGE } from '../../config/desktop-config.js'

export class DesktopBackground {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.background = new UIImageView({
            frame: new UIRect(0, 0, this.windowDesktopApplication.width, this.windowDesktopApplication.height),
            widthMode: UISizeMode.frameSize, 
            heightMode: UISizeMode.frameSize, 
            initialPosition: false
        });

        this.background
            .getImgElement()
            .setObjectFitCover()
        
        this.setBackgroundImage(DESKTOP_DEFAULT_BACKGROUND_IMAGE.src);
        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.background.frame = new UIRect(0, 0, payload.width, payload.height);
        });
        EventEmitter.subscribe('desktop-space-drop-files', (payload) => {
            const file = payload.files[0];
            if (!file.type.startsWith('image/')) return; 
            const reader = new FileReader();
            reader.onload = (e) => this.setBackgroundImage(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    setBackgroundImage(path) {
        this.background.isHidden = false;
        this.background.image = new UIImage('desktop-background', path);
    }

    removeBackgroundImage() {
        this.background.isHidden = true;
        this.background.image = null;
    }
    
}

export default DesktopBackground