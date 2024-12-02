import ApplicationWindow from '../../components/application-components/application-window.js'
import { UIButton, UIColor, UIIcon, UIRect, UIEdgeSet, UISize, UISizeMode, UIState, UITextField, UIView, UIWebView, UIDisplayMode, UIOffset, UIBorder } from '../../../ui-tool-kit/index.js'
import { APP_ROOT_PATH } from '../../config/config.js'
import { WINDOW_RESIZABLE_MIN_HEIGHT } from '../../config/desktop-config.js'
import { KEYBOARD_BUTTONS_NAME_CODE_MAP } from '../../config/keyboard-buttons.js'
import { SvgSet } from '../../config/svg-set.js'

const BROWSER_APP_PATH = `${APP_ROOT_PATH}/window-applications/browser`;
const CUSTOM_WEB_SITE_URL = `${location.origin}${BROWSER_APP_PATH}/web-site/index.html`;
const SEARCH_BAR_HEIGHT = 50;
const SEARCH_BAR_ELEMENTS_HEIGHT = 40;
const SEARCH_BAR_BACKGROUND_COLOR = new UIColor(.93, .93, .93);
const SEARCH_BAR_PADDING = 5;
const HOME_BUTTON_ICON_SVG = SvgSet.house;
const PREV_BUTTON_ICON_SVG = SvgSet.arrowLeft;
const NEXT_BUTTON_ICON_SVG = SvgSet.arrowRight;
const RELOAD_BUTTON_ICON_SVG = SvgSet.rotateRight;
const BUTTON_ICON_COLOR = new UIColor(0, 0, 0);
const BUTTON_ICON_COLOR_DISABLED = new UIColor(.8, .8, .8);

const resize = (context) => {
    context.container.frame = new UIRect(0, 0, context.window.body.frame.width, context.window.body.frame.height);
    context.searchBar.frame = new UIRect(0, 0, context.window.body.frame.width, SEARCH_BAR_HEIGHT);
    context.search.frame = new UIRect(0, 0, context.window.body.frame.width - 2 * SEARCH_BAR_PADDING - 4 * SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT);
    context.webView.frame = new UIRect(0, SEARCH_BAR_HEIGHT, context.window.body.frame.width, context.window.body.frame.height - SEARCH_BAR_HEIGHT);
    context.webViewOverlay.frame = new UIRect(0, SEARCH_BAR_HEIGHT, context.window.body.frame.width, context.window.body.frame.height - SEARCH_BAR_HEIGHT);
}

const createButton = () => {
    return new UIButton({
        frame: new UIRect(0, 0, SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT),
        widthMode: UISizeMode.frameSize,
        heightMode: UISizeMode.frameSize,
        borderRadius: 20,
        maring: new UIOffset(5, UIEdgeSet.horizontal),
        states: {
            normal: new UIState({
                backgroundColor: null
            }),
            hovered: new UIState({
                backgroundColor: SEARCH_BAR_BACKGROUND_COLOR
            })
        }
    })
}

const updatePrevNextButtonsState = (context) => {
    if (context.history.length == 1) {
        context.prevIcon.iconColor = BUTTON_ICON_COLOR_DISABLED;
        context.nextIcon.iconColor = BUTTON_ICON_COLOR_DISABLED;
    } else {
        if (context.historyCurrentIndex == 0) {
            context.prevIcon.iconColor = BUTTON_ICON_COLOR_DISABLED;
        } else {
            context.prevIcon.iconColor = BUTTON_ICON_COLOR;
        }
        if (context.historyCurrentIndex == context.history.length - 1) {
            context.nextIcon.iconColor = BUTTON_ICON_COLOR_DISABLED;
        } else {
            context.nextIcon.iconColor = BUTTON_ICON_COLOR;
        }
    }
}

const onLoad = (context, uiElement) => {
    let text = context.appName;
    let url = '';
    try {
        const contentWindow = uiElement.getContentWindowDocument();
        const contentName = contentWindow ? contentWindow.title : 'WebSite';
        text = contentName;
        url = contentWindow.location.href;
    } catch (error) {
        text = context.appName;
        url = context.webView.url;
    }
    context.window.headerTextLabel.text = text;
    context.task.label.text = text;
    context.search.value = url;
    context.webView._url = url;
}

export class BrowserApplicationWindow extends ApplicationWindow {
    getWindowConfig() {
        return super.getWindowConfig({
            minSize: new UISize(400, WINDOW_RESIZABLE_MIN_HEIGHT)
        });
    }

    _init() {
        super._init();

        this.homeUrl = CUSTOM_WEB_SITE_URL;
        this.history = [];
        this.historyCurrentIndex = -1;

        this.container = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, this.window.body.frame.height),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.searchBar = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, SEARCH_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            displayMode: UIDisplayMode.flex,
            padding: new UIOffset(SEARCH_BAR_PADDING)
        })
        this.prevButton = createButton();
        this.prevButton.onClick = () => this.goToPrev();
        this.prevIcon = new UIIcon({
            frame: new UIRect(0, 0, SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT),
            svg: PREV_BUTTON_ICON_SVG,
            padding: new UIOffset(12)
        })
        this.nextButton = createButton();
        this.nextButton.onClick = () => this.goToNext();
        this.nextIcon = new UIIcon({
            frame: new UIRect(0, 0, SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT),
            svg: NEXT_BUTTON_ICON_SVG,
            padding: new UIOffset(12)
        })
        this.reloadButton = createButton();
        this.reloadButton.onClick = () => this.reload();
        this.reloadIcon = new UIIcon({
            frame: new UIRect(0, 0, SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT),
            svg: RELOAD_BUTTON_ICON_SVG,
            padding: new UIOffset(12)
        })
        this.homeButton = createButton();
        this.homeButton.onClick = () => this.goToHome();
        this.homeIcon = new UIIcon({
            frame: new UIRect(0, 0, SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT),
            svg: HOME_BUTTON_ICON_SVG,
            padding: new UIOffset(12)
        })
        this.search = new UITextField({
            frame: new UIRect(0, 0, this.window.body.frame.width - 2 * SEARCH_BAR_PADDING - 4 * SEARCH_BAR_ELEMENTS_HEIGHT, SEARCH_BAR_ELEMENTS_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: SEARCH_BAR_BACKGROUND_COLOR,
            borderRadius: 20,
            border: new UIBorder(2, UIColor.transparent),
            padding: new UIOffset(10)
        })
        this.search.getTextFieldInputElement()
            .onFocus(() => {
                this.search.border = new UIBorder(2, new UIColor(.06, .32, .98));
                this.search.backgroundColor = UIColor.white;
                this.search.selectText();
            })
            .onBlur(() => {
                this.search.border = new UIBorder(2, UIColor.transparent);
                this.search.backgroundColor = SEARCH_BAR_BACKGROUND_COLOR;
            });
        this.webView = new UIWebView({
            frame: new UIRect(0, SEARCH_BAR_HEIGHT, this.window.body.frame.width, this.window.body.frame.height - SEARCH_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.webViewOverlay = new UIView({
            frame: new UIRect(0, SEARCH_BAR_HEIGHT, this.window.body.frame.width, this.window.body.frame.height - SEARCH_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.webViewOverlay.hide();

        this.prevButton.addSubview(this.prevIcon);
        this.nextButton.addSubview(this.nextIcon);
        this.homeButton.addSubview(this.homeIcon);
        this.reloadButton.addSubview(this.reloadIcon);
        this.searchBar.addSubviews([this.prevButton, this.nextButton]);
        this.searchBar.addSubview(this.reloadButton);
        this.searchBar.addSubview(this.homeButton);
        this.searchBar.addSubview(this.search);
        this.container.addSubviews([this.searchBar, this.webView, this.webViewOverlay]);
        this.window.setBodyContent(this.container);

        this.window.onResizeStart = () => {
            this.webViewOverlay.show();
        }
        this.window.onResize = () => {
            resize(this);
        }
        this.window.onResizeEnd = () => {
            this.webViewOverlay.hide();
        }
        this.window.onDragStart = () => {
            this.webViewOverlay.show();
        }
        this.window.onDragEnd = () => {
            this.webViewOverlay.hide();
        }
        this.window.onMaximize = () => {
            resize(this);
        }
        this.window.onMaximizeRestore = () => {
            resize(this);
        }

        this.search.getUIElement().onKeyUp((uiElement, event) => {
            if (event.keyCode != KEYBOARD_BUTTONS_NAME_CODE_MAP.ENTER) return;
            this.goToUrl(this.search.value);
        })

        this.webView.getIFrameElement().onLoad((uiElement, event) => {
            onLoad(this, uiElement);
        })
    }

    setHome(url) {
        this.homeUrl = url;
    }

    goToHome() {
        this.goToUrl(this.homeUrl);
    }

    goToUrl(url) {
        this.webView.url = url;
        this.history = this.history.slice(0, this.historyCurrentIndex + 1);
        this.history.push(url);
        this.historyCurrentIndex = this.history.length - 1;
        updatePrevNextButtonsState(this);
    }

    goToNext() {
        if (this.historyCurrentIndex + 1 > this.history.length - 1) return;
        this.historyCurrentIndex++;
        this.search.value = this.history[this.historyCurrentIndex];
        this.webView.url = this.history[this.historyCurrentIndex];
        updatePrevNextButtonsState(this);
    }

    goToPrev() {
        if (this.historyCurrentIndex <= 0) return;
        this.historyCurrentIndex--;
        this.search.value = this.history[this.historyCurrentIndex];
        this.webView.url = this.history[this.historyCurrentIndex];
        updatePrevNextButtonsState(this);
    }

    reload() {
        this.webView.reload();
    }
}

export default BrowserApplicationWindow