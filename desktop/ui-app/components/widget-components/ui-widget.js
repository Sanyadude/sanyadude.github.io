import { UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { WIDGET_BACKGROUND_COLOR, WIDGET_BORDER, WIDGET_DEFAULT_FRAME, WIDGET_SHADOW, WIDGET_TEXT_COLOR, WIDGET_ZINDEX } from '../../config/desktop-config.js'
import SystemUIFont from '../../config/fonts.js'

export class UIWidget {
    constructor(name, config) {
        this.name = name;
        const defaultConfig = {
            frame: WIDGET_DEFAULT_FRAME
        };
        const mergedConfig = Object.assign(defaultConfig, config);
        this._config = mergedConfig || {};
        this._init();
    }

    _init() {
        this._configure();
        delete this._config;
    }

    _configure() {
        this.container = new UIView({
            frame: this._config.frame,
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textColor: WIDGET_TEXT_COLOR,
            font: SystemUIFont.default,
            backgroundColor: WIDGET_BACKGROUND_COLOR,
            border: WIDGET_BORDER,
            shadow: WIDGET_SHADOW,
            zIndex: WIDGET_ZINDEX
        })
    }
}

export default UIWidget