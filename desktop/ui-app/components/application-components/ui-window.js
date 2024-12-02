import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIIcon, UITextLabel, UIView, UISizeMode, UIRect, UIEdgeSet, UIOffset, UIImageView } from '../../../ui-tool-kit/index.js'
import { WINDOW_ACTION_ICON_CLOSE_BG_HOVER_COLOR, WINDOW_ACTION_ICON_CLOSE_HOVER_COLOR, WINDOW_ACTION_ICON_CLOSE_SVG, WINDOW_ACTION_ICON_HOVER_COLOR, WINDOW_ACTION_ICON_MAXIMIZE_SVG, WINDOW_ACTION_ICON_MINIMIZE_SVG, WINDOW_ACTION_ICON_PADDING, WINDOW_ACTION_ICON_RESTORE_SVG, WINDOW_BACKGROUND_COLOR, WINDOW_BORDER, WINDOW_BORDER_WIDTH, WINDOW_HEADER_PADDING, WINDOW_SHADOW } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'

const startDrag = (context, uiElement, event) => {
    if (!context._config.draggable) return;
    context._dragged = {
        startX: event.clientX,
        startY: event.clientY,
        deltaX: context.container.getUIElement().getOffsetLeft(),
        deltaY: context.container.getUIElement().getOffsetTop()
    };
    const onMove = (event) => {
        event.preventDefault();
        if (!context._dragged) return;
        context.container.frame.x = event.clientX - context._dragged.startX + context._dragged.deltaX;
        context.container.frame.y = event.clientY - context._dragged.startY + context._dragged.deltaY;
        context.onDrag();
        EventEmitter.emit('window-drag', { window: context, event });
    }
    const onMouseUp = (event) => {
        event.preventDefault();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onMouseUp);
        context._dragged = false;
        context.onDragEnd();
        EventEmitter.emit('window-drag-end', { window: context, event });
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
    context.onDragStart();
    EventEmitter.emit('window-drag-start', { window: context, event });
}

const restore = (context) => {
    const isMaximized = context._maximized != false;
    const isMinimized = context._minimized;
    if (isMinimized) {
        context._opened = true;
        context._minimized = false;
        context.container.show();
        EventEmitter.emit('window-minimize-restore', { window: context });
        context.onMinimizeRestore();
    }
    if (isMaximized) {
        const maximizedRestore = context._maximized?.restoreFrame;
        context.restoreIconContainer.hide();
        context.maximizeIconContainer.show();
        context._maximized = false;
        context.container.frame = maximizedRestore;
        context.body.frame.width = context.container.frame.width - 2 * WINDOW_BORDER_WIDTH;
        context.body.frame.height = context.container.frame.height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        context.header.frame.width = context.container.frame.width - 2 * WINDOW_BORDER_WIDTH;
        context.headerTextLabel.frame.width = maximizedRestore.width - context.headerActions.frame.width - context.headerIcon.frame.width;
        EventEmitter.emit('window-maximize-restore', { window: context });
        context.onMaximizeRestore();
    }
}

const maximize = (context) => {
    if (!context._config.maximizable) return;
    context.restoreIconContainer.show();
    context.maximizeIconContainer.hide();
    context._maximized = { restoreFrame: context.container.frame.copy() };
    EventEmitter.emit('window-maximize', { window: context });
    context.onMaximize();
}

const minimize = (context) => {
    if (!context._config.minimizable) return;
    context._minimized = true;
    context.container.hide();
    EventEmitter.emit('window-minimize', { window: context });
    context.onMinimize();
}

const open = (context) => {
    context._opened = true;
    context._minimized = false;
    context.container.show();
    EventEmitter.emit('window-open', { window: context });
    context.onOpen();
}

const close = (context) => {
    context._opened = false;
    context._minimized = false;
    context.container.hide();
    EventEmitter.emit('window-close', { window: context });
    context.onClose();
}

const iconConfig = (iconSize) => ({
    frame: new UIRect(0, 0, iconSize, iconSize),
    widthMode: UISizeMode.frameSize,
    heightMode: UISizeMode.frameSize,
    padding: new UIOffset(WINDOW_ACTION_ICON_PADDING)
})

const iconContainerConfig = (iconSize) => ({
    frame: new UIRect(0, 0, iconSize + WINDOW_ACTION_ICON_PADDING * 2, iconSize),
    widthMode: UISizeMode.frameSize,
    heightMode: UISizeMode.frameSize,
    padding: new UIOffset(WINDOW_ACTION_ICON_PADDING, UIEdgeSet.horizontal),
    backgroundColor: null
})

export class UIWindow {
    constructor(config) {
        const defaultConfig = {
            frame: UIRect.zero,
            font: SystemUIFont.default,
            showIcon: false,
            icon: null,
            name: 'UIModalWindowHeader',
            draggable: true,
            minimizable: true,
            maximizable: true,
            zIndex: 1
        };
        const mergedConfig = Object.assign(defaultConfig, config);
        this._config = mergedConfig || {};
        this._init();
    }

    _configure() {
        this._opened = false;
        this._maximized = false;
        this._minimized = false;
        this._dragged = false;

        this.bodyContent = null;
        this.container = new UIView({
            frame: this._config.frame,
            initialPosition: false,
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: WINDOW_BACKGROUND_COLOR,
            border: WINDOW_BORDER,
            shadow: WINDOW_SHADOW,
            isHidden: true,
            zIndex: this._config.zIndex
        });
        const headerWidth = this._config.frame.width - 2 * WINDOW_BORDER_WIDTH;
        const headerHeight = this._config.font.fontSize + 2 * WINDOW_HEADER_PADDING;
        this.header = new UIView({
            frame: new UIRect(0, 0, headerWidth, headerHeight),
            heightMode: UISizeMode.frameSize,
            widthMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: new UIOffset(WINDOW_HEADER_PADDING),
            clipToFrame: true
        });
        const headerActionsWidth = (1 + (this._config.minimizable ? 1 : 0) + (this._config.maximizable ? 1 : 0)) * (headerHeight + 2 * WINDOW_ACTION_ICON_PADDING);
        this.headerActions = new UIView({
            frame: new UIRect(0, 0, headerActionsWidth, headerHeight),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        });
        const headerIconWidth = this._config.showIcon ? headerHeight : 0;
        this.headerIcon = new UIImageView({
            frame: new UIRect(0, 0, headerIconWidth, headerHeight),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: new UIOffset(6),
            image: this._config.icon
        });
        const headerTextLabelWidth = this.container.frame.width - this.headerActions.frame.width - this.headerIcon.frame.width;
        this.headerTextLabel = new UITextLabel({
            frame: new UIRect(this.headerIcon.frame.width, 0, headerTextLabelWidth, headerHeight),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            font: this._config.font.copy().setLineHeight(headerHeight),
            text: this._config.name,
            textTruncate: true
        });
        this.minimizeIconContainer = new UIView(iconContainerConfig(headerHeight));
        this.minimizeIcon = new UIIcon(Object.assign(iconConfig(headerHeight), {
            svg: WINDOW_ACTION_ICON_MINIMIZE_SVG,
        }));
        this.maximizeIconContainer = new UIView(iconContainerConfig(headerHeight));
        this.maximizeIcon = new UIIcon(Object.assign(iconConfig(headerHeight), {
            svg: WINDOW_ACTION_ICON_MAXIMIZE_SVG,
        }));
        this.restoreIconContainer = new UIView(iconContainerConfig(headerHeight));
        this.restoreIcon = new UIIcon(Object.assign(iconConfig(headerHeight), {
            svg: WINDOW_ACTION_ICON_RESTORE_SVG,
        }));
        this.closeIconContainer = new UIView(iconContainerConfig(headerHeight));
        this.closeIcon = new UIIcon(Object.assign(iconConfig(headerHeight), {
            svg: WINDOW_ACTION_ICON_CLOSE_SVG,
        }));

        this.closeIconContainer.addSubview(this.closeIcon);

        if (this._config.minimizable) {
            this.minimizeIconContainer.addSubview(this.minimizeIcon);
            this.headerActions.addSubview(this.minimizeIconContainer);
        }

        if (this._config.maximizable) {
            this.maximizeIconContainer.addSubview(this.maximizeIcon);
            this.restoreIconContainer.addSubview(this.restoreIcon);
            this.headerActions.addSubviews([this.maximizeIconContainer, this.restoreIconContainer]);
        }

        this.headerActions.addSubview(this.closeIconContainer);

        this.body = new UIView({
            frame: new UIRect(0, this.header.frame.height, this.container.frame.width - 2 * WINDOW_BORDER_WIDTH, this.container.frame.height - this.header.frame.height - 2 * WINDOW_BORDER_WIDTH),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            clipToFrame: true
        });

        if (this._config.showIcon) {
            this.header.addSubview(this.headerIcon);
        }
        this.header.addSubviews([this.headerTextLabel, this.headerActions]);
        this.container.addSubviews([this.header, this.body]);

        this.header.getUIElement()
            .setCursorDefault()
            .setUserSelectNone()
            .onDoubleClick((uiElement, event) => {
                if (this._maximized)
                    restore(this)
                else
                    maximize(this)
            })
            .onMouseDown((uiElement, event) => startDrag(this, uiElement, event))

        this.headerActions
            .getUIElement()
            .onMouseDown((uiElement, event) => event.stopPropagation())
        this.headerIcon
            .getUIElement()
            .onMouseDown((uiElement, event) => event.preventDefault())

        this.minimizeIconContainer
            .getUIElement()
            .onMouseEnter(() => this.minimizeIconContainer.backgroundColor = WINDOW_ACTION_ICON_HOVER_COLOR)
            .onMouseLeave(() => this.minimizeIconContainer.backgroundColor = null)
            .onMouseUp(() => minimize(this))
        this.maximizeIconContainer
            .getUIElement()
            .onMouseEnter(() => this.maximizeIconContainer.backgroundColor = WINDOW_ACTION_ICON_HOVER_COLOR)
            .onMouseLeave(() => this.maximizeIconContainer.backgroundColor = null)
            .onMouseUp(() => maximize(this))
        this.restoreIconContainer
            .getUIElement()
            .hide()
            .onMouseEnter(() => this.restoreIconContainer.backgroundColor = WINDOW_ACTION_ICON_HOVER_COLOR)
            .onMouseLeave(() => this.restoreIconContainer.backgroundColor = null)
            .onMouseUp(() => restore(this))
        this.closeIconContainer
            .getUIElement()
            .onMouseEnter(() => {
                this.closeIconContainer.backgroundColor = WINDOW_ACTION_ICON_CLOSE_BG_HOVER_COLOR;
                this.closeIcon.iconColor = WINDOW_ACTION_ICON_CLOSE_HOVER_COLOR;
            })
            .onMouseLeave(() => {
                this.closeIconContainer.backgroundColor = null;
                this.closeIcon.iconColor = null;
            })
            .onMouseUp(() => close(this))

        return this;
    }

    _init() {
        this._configure();
        return this;
    }

    onOpen() { }

    onClose() { }

    onMinimize() { }

    onMaximize() { }

    onMinimizeRestore() { }

    onMaximizeRestore() { }

    onDragStart() { }

    onDrag() { }

    onDragEnd() { }

    open() {
        open(this);
    }

    close() {
        close(this);
    }

    minimize() {
        minimize(this);
    }

    maximize() {
        maximize(this);

    }

    restore() {
        restore(this);
    }

    setBodyContent(uiComponent) {
        this.removeBodyContent();
        this.body.addSubview(uiComponent);
        this.bodyContent = uiComponent;
    }

    removeBodyContent() {
        if (!this.bodyContent) return;
        this.body.removeSubview(this.bodyContent);
        this.bodyContent = null;
    }
}

export default {
    UIWindow
}