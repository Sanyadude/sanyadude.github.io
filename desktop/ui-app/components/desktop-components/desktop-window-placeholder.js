import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { AUTO_MAXIMIZE_WINDOW_X_THRESHOLD, DESKTOP_WINDOW_PLACEHOLDER_BACKGROUND_COLOR, DESKTOP_WINDOW_PLACEHOLDER_BORDER, DESKTOP_WINDOW_PLACEHOLDER_PADDING, TASK_BAR_HEIGHT, WINDOW_SHADOW } from '../../config/desktop-config.js'

const getPlaceholderHalfWidth = (width) => {
    return (width - 2 * DESKTOP_WINDOW_PLACEHOLDER_PADDING) / 2 - DESKTOP_WINDOW_PLACEHOLDER_PADDING;
}
const getPlaceholderWidth = (width) => {
    return width - 2 * DESKTOP_WINDOW_PLACEHOLDER_PADDING;
}
const getPlaceholderHeight = (height) => {
    return height - TASK_BAR_HEIGHT - 2 * DESKTOP_WINDOW_PLACEHOLDER_PADDING;
}
const getRightPlaceholderX = (width) => {
    return width / 2 + DESKTOP_WINDOW_PLACEHOLDER_PADDING;
}

const onDrag = (payload, context) => {
    let resizeFullScreen = false;
    if (payload.event.clientY <= 0) {
        context.desktopSpace.addComponent(context.desktopWindowFullScreenPlaceholder);
        context.desktopWindowFullScreenPlaceholder.zIndex = payload.window.container.zIndex - 1;
        resizeFullScreen = true;
    } else {
        context.desktopSpace.removeComponent(context.desktopWindowFullScreenPlaceholder);
    }
    if (payload.event.clientX <= AUTO_MAXIMIZE_WINDOW_X_THRESHOLD && !resizeFullScreen) {
        context.desktopSpace.addComponent(context.desktopWindowLeftScreenPlaceholder);
        context.desktopWindowLeftScreenPlaceholder.zIndex = payload.window.container.zIndex - 1;
    } else {
        context.desktopSpace.removeComponent(context.desktopWindowLeftScreenPlaceholder);
    }
    if (payload.event.clientX >= (context.windowDesktopApplication.width - AUTO_MAXIMIZE_WINDOW_X_THRESHOLD) && !resizeFullScreen) {
        context.desktopSpace.addComponent(context.desktopWindowRightScreenPlaceholder);
        context.desktopWindowRightScreenPlaceholder.zIndex = payload.window.container.zIndex - 1;
    } else {
        context.desktopSpace.removeComponent(context.desktopWindowRightScreenPlaceholder);
    }
}

const onDragEnd = (payload, context) => {
    context.desktopSpace.removeComponents([
        context.desktopWindowFullScreenPlaceholder,
        context.desktopWindowLeftScreenPlaceholder,
        context.desktopWindowRightScreenPlaceholder
    ]);
}

export class DesktopWindowMaximizePlaceholder {
    constructor(windowDesktopApplication, desktopSpace) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.desktopSpace = desktopSpace;

        this._init();
    }

    _init() {
        this.desktopWindowFullScreenPlaceholder = new UIView({
            frame: new UIRect(DESKTOP_WINDOW_PLACEHOLDER_PADDING, DESKTOP_WINDOW_PLACEHOLDER_PADDING, getPlaceholderWidth(this.windowDesktopApplication.width), getPlaceholderHeight(this.windowDesktopApplication.height)),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: DESKTOP_WINDOW_PLACEHOLDER_BACKGROUND_COLOR,
            border: DESKTOP_WINDOW_PLACEHOLDER_BORDER,
            shadow: WINDOW_SHADOW,
            initialPosition: false
        });

        this.desktopWindowLeftScreenPlaceholder = new UIView({
            frame: new UIRect(DESKTOP_WINDOW_PLACEHOLDER_PADDING, DESKTOP_WINDOW_PLACEHOLDER_PADDING, getPlaceholderHalfWidth(this.windowDesktopApplication.width), getPlaceholderHeight(this.windowDesktopApplication.height)),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: DESKTOP_WINDOW_PLACEHOLDER_BACKGROUND_COLOR,
            border: DESKTOP_WINDOW_PLACEHOLDER_BORDER,
            shadow: WINDOW_SHADOW,
            initialPosition: false
        });

        this.desktopWindowRightScreenPlaceholder = new UIView({
            frame: new UIRect(getRightPlaceholderX(this.windowDesktopApplication.width), DESKTOP_WINDOW_PLACEHOLDER_PADDING, getPlaceholderHalfWidth(this.windowDesktopApplication.width), getPlaceholderHeight(this.windowDesktopApplication.height)),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: DESKTOP_WINDOW_PLACEHOLDER_BACKGROUND_COLOR,
            border: DESKTOP_WINDOW_PLACEHOLDER_BORDER,
            shadow: WINDOW_SHADOW,
            initialPosition: false
        });

        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.desktopWindowFullScreenPlaceholder.frame = new UIRect(DESKTOP_WINDOW_PLACEHOLDER_PADDING, DESKTOP_WINDOW_PLACEHOLDER_PADDING, getPlaceholderWidth(payload.width), getPlaceholderHeight(payload.height));
            this.desktopWindowLeftScreenPlaceholder.frame = new UIRect(DESKTOP_WINDOW_PLACEHOLDER_PADDING, DESKTOP_WINDOW_PLACEHOLDER_PADDING, getPlaceholderHalfWidth(payload.width), getPlaceholderHeight(payload.height));
            this.desktopWindowRightScreenPlaceholder.frame = new UIRect(getRightPlaceholderX(payload.width), DESKTOP_WINDOW_PLACEHOLDER_PADDING, getPlaceholderHalfWidth(payload.width), getPlaceholderHeight(payload.height));
        });
        EventEmitter.subscribe('window-drag', (payload) => {
            onDrag(payload, this);
        });
        EventEmitter.subscribe('window-drag-end', (payload) => {
            onDragEnd(payload, this);
        });
    }
}

export default DesktopWindowMaximizePlaceholder