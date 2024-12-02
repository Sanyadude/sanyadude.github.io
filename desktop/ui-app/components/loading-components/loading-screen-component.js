import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIIcon, UIRect, UISizeMode, UITextAlign, UITextLabel, UIView } from '../../../ui-tool-kit/index.js'
import { LOADING_SCREEN_BACKGROUND_COLOR, LOADING_SCREEN_ICON_COLOR, LOADING_SCREEN_TEXT_COLOR, LOADING_SCREEN_ICON_WIDTH, LOADING_SCREEN_ICON_HEIGHT, LOADING_SCREEN_TEXT_WIDTH, LOADING_SCREEN_TEXT_HEIGHT, LOADING_SCREEN_CONTENT_MARGIN, LOADING_SCREEN_CONTENT_WIDTH, LOADING_SCREEN_CONTENT_HEIGHT } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'
import { SvgSet } from '../../config/svg-set.js'

export class LoadingScreen {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.loadingScreenContainer = new UIView({
            frame: new UIRect(0, 0, this.windowDesktopApplication.width, this.windowDesktopApplication.height),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            backgroundColor: LOADING_SCREEN_BACKGROUND_COLOR,
            zIndex: 999
        });

        this.loadingScreenContentContainer = new UIView({
            frame: new UIRect((this.windowDesktopApplication.width - LOADING_SCREEN_CONTENT_WIDTH) / 2, (this.windowDesktopApplication.height - LOADING_SCREEN_CONTENT_HEIGHT) / 2, LOADING_SCREEN_CONTENT_WIDTH, LOADING_SCREEN_CONTENT_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });

        this.loadingScreenWindowIcon = new UIIcon({
            frame: new UIRect((LOADING_SCREEN_CONTENT_WIDTH - LOADING_SCREEN_ICON_WIDTH) / 2, 0, LOADING_SCREEN_ICON_WIDTH, LOADING_SCREEN_ICON_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            svg: SvgSet.window,
            iconColor: LOADING_SCREEN_ICON_COLOR
        });

        this.loadingScreenTextLabel = new UITextLabel({
            frame: new UIRect(0, LOADING_SCREEN_ICON_HEIGHT + LOADING_SCREEN_CONTENT_MARGIN, LOADING_SCREEN_TEXT_WIDTH, LOADING_SCREEN_TEXT_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textColor: LOADING_SCREEN_TEXT_COLOR,
            textAlign: UITextAlign.center,
            font: SystemUIFont.xxxLargeWith(LOADING_SCREEN_TEXT_HEIGHT),
            text: 'Loading your APP...'
        });

        this.loadingScreenContainer
            .getUIElement()
            .setUserSelectNone()

        this.loadingScreenContentContainer.addSubviews([this.loadingScreenWindowIcon, this.loadingScreenTextLabel]);
        this.loadingScreenContainer.addSubviews([this.loadingScreenContentContainer]);
        
        this.windowDesktopApplication.applicationRoot.addComponent(this.loadingScreenContainer);

        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.loadingScreenContainer.frame = new UIRect(0, 0, payload.width, payload.height);
            this.loadingScreenContentContainer.frame = new UIRect((payload.width - LOADING_SCREEN_CONTENT_WIDTH) / 2, (payload.height - LOADING_SCREEN_CONTENT_HEIGHT) / 2, LOADING_SCREEN_CONTENT_WIDTH, LOADING_SCREEN_CONTENT_HEIGHT);
        });

        EventEmitter.subscribe('windows-desktop-application-initialized', (payload) => {
            this.hide();
        });
    }

    show() {
        this.loadingScreenContainer.show();
    }

    hide() {
        this.loadingScreenContainer.hide();
    }
}

export default LoadingScreen