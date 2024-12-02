import { UIWindow } from './ui-window.js'
import { UIView, UISize, UISizeMode, UIEdgeSet, UIRect, UIEdge } from '../../../ui-tool-kit/index.js'
import { WINDOW_BORDER_WIDTH, WINDOW_RESIZABLE_AREA_WIDTH, WINDOW_RESIZABLE_MIN_HEIGHT, WINDOW_RESIZABLE_MIN_WIDTH } from '../../config/desktop-config.js'
import EventEmitter from '../../../event-emmiter/event-emmiter.js'

const resize = (context, uiElement, event, onMove) => {
    event.preventDefault();
    if (!context._config.resizable) return;
    context._resized = {
        startFrame: context.container.frame.copy(),
        startX: event.clientX,
        startY: event.clientY
    };
    const onMouseUp = (event) => {
        event.preventDefault();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onMouseUp);
        EventEmitter.emit('window-resize-end', { window: context, event });
        context.onResizeEnd();
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
    EventEmitter.emit('window-resize-start', { window: context, event });
    context.onResizeStart();
}

const resizeLeft = (context, uiElement, event) => {
    const onMoveListenerLeft = (event) => {
        event.preventDefault();
        const width = context._resized.startFrame.width + context._resized.startX - event.clientX;
        const minWidth = context._config.minSize.width;
        if (width <= minWidth) return;
        const left = context._resized.startFrame.x + event.clientX - context._resized.startX;
        context.container.frame.width = width;
        context.container.frame.x = left;
        context.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
        context.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
        context.headerTextLabel.frame.width = width - context.headerActions.frame.width - context.headerIcon.frame.width;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerLeft)
}

const resizeRight = (context, uiElement, event) => {
    const onMoveListenerRight = (event) => {
        event.preventDefault();
        const width = context._resized.startFrame.width + event.clientX - context._resized.startX;
        const minWidth = context._config.minSize.width;
        if (width <= minWidth) return;
        context.container.frame.width = width;
        context.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
        context.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
        context.headerTextLabel.frame.width = width - context.headerActions.frame.width - context.headerIcon.frame.width;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerRight)
}

const resizeTop = (context, uiElement, event) => {
    const onMoveListenerTop = (event) => {
        event.preventDefault();
        const height = context._resized.startFrame.height + context._resized.startY - event.clientY;
        const minHeight = context._config.minSize.height;
        if (height <= minHeight) return;
        const top = context._resized.startFrame.y + event.clientY - context._resized.startY;
        context.container.frame.height = height;
        context.container.frame.y = top;
        context.body.frame.height = height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerTop)
}

const resizeBottom = (context, uiElement, event) => {
    const onMoveListenerBottom = (event) => {
        event.preventDefault();
        const height = context._resized.startFrame.height + event.clientY - context._resized.startY;
        const minHeight = context._config.minSize.height;
        if (height <= minHeight) return;
        context.container.frame.height = height;
        context.body.frame.height = height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerBottom)
}

const resizeLeftTop = (context, uiElement, event) => {
    const onMoveListenerLeftTop = (event) => {
        event.preventDefault();
        const width = context._resized.startFrame.width + context._resized.startX - event.clientX;
        const minWidth = context._config.minSize.width;
        if (width > minWidth) {
            const left = context._resized.startFrame.x + event.clientX - context._resized.startX;
            context.container.frame.width = width;
            context.container.frame.x = left;
            context.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.headerTextLabel.frame.width = width - context.headerActions.frame.width - context.headerIcon.frame.width;
        }
        const height = context._resized.startFrame.height + context._resized.startY - event.clientY;
        const minHeight = context._config.minSize.height;
        if (height > minHeight) {
            const top = context._resized.startFrame.y + event.clientY - context._resized.startY;
            context.container.frame.height = height;
            context.container.frame.y = top;
            context.body.frame.height = height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        }
        if (width <= minWidth && height <= minHeight) return;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerLeftTop)
}

const resizeRightTop = (context, uiElement, event) => {
    const onMoveListenerRightTop = (event) => {
        event.preventDefault();
        const width = context._resized.startFrame.width + event.clientX - context._resized.startX;
        const minWidth = context._config.minSize.width;
        if (width > minWidth) {
            context.container.frame.width = width;
            context.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.headerTextLabel.frame.width = width - context.headerActions.frame.width - context.headerIcon.frame.width;
        }
        const height = context._resized.startFrame.height + context._resized.startY - event.clientY;
        const minHeight = context._config.minSize.height;
        if (height > minHeight) {
            const top = context._resized.startFrame.y + event.clientY - context._resized.startY;
            context.container.frame.height = height;
            context.container.frame.y = top;
            context.body.frame.height = height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        }
        if (width <= minWidth && height <= minHeight) return;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerRightTop)
}

const resizeLeftBottom = (context, uiElement, event) => {
    const onMoveListenerLeftBottom = (event) => {
        event.preventDefault();
        const width = context._resized.startFrame.width + context._resized.startX - event.clientX;
        const minWidth = context._config.minSize.width;
        if (width > minWidth) {
            const left = context._resized.startFrame.x + event.clientX - context._resized.startX;
            context.container.frame.width = width;
            context.container.frame.x = left;
            context.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.headerTextLabel.frame.width = width - context.headerActions.frame.width - context.headerIcon.frame.width;
        }
        const height = context._resized.startFrame.height + event.clientY - context._resized.startY;
        const minHeight = context._config.minSize.height;
        if (height > minHeight) {
            context.container.frame.height = height;
            context.body.frame.height = height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        }
        if (width <= minWidth && height <= minHeight) return;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerLeftBottom)
}

const resizeRightBottom = (context, uiElement, event) => {
    const onMoveListenerRightBottom = (event) => {
        event.preventDefault();
        const width = context._resized.startFrame.width + event.clientX - context._resized.startX;
        const minWidth = context._config.minSize.width;
        if (width > minWidth) {
            context.container.frame.width = width;
            context.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
            context.headerTextLabel.frame.width = width - context.headerActions.frame.width - context.headerIcon.frame.width;
        }
        const height = context._resized.startFrame.height + event.clientY - context._resized.startY;
        const minHeight = context._config.minSize.height;
        if (height > minHeight) {
            context.container.frame.height = height;
            context.body.frame.height = height - context.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        }
        if (width <= minWidth && height <= minHeight) return;
        EventEmitter.emit('window-resize', { window: context, event });
        context.onResize();
    }
    resize(context, uiElement, event, onMoveListenerRightBottom)
}

export class UIResizableWindow extends UIWindow {
    constructor(config) {
        const defaultConfig = {
            minSize: new UISize(WINDOW_RESIZABLE_MIN_WIDTH, WINDOW_RESIZABLE_MIN_HEIGHT),
            resizableEdges: UIEdgeSet.all,
            resizableAreaWidth: WINDOW_RESIZABLE_AREA_WIDTH,
            resizable: true
        };
        const mergedConfig = Object.assign(defaultConfig, config);
        super(mergedConfig);
    }

    _configure() {
        super._configure();
        if (this._config.resizableEdges.includes(UIEdge.left)) {
            this._resizeLeft = new UIView({
                frame: new UIRect(-this._config.resizableAreaWidth, 0, this._config.resizableAreaWidth, 0),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.fullSize,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeLeft);
            this._resizeLeft
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorEastWestResize()
                .onMouseDown((uiElement, event) => resizeLeft(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.right)) {
            this._resizeRight = new UIView({
                frame: new UIRect(-this._config.resizableAreaWidth, 0, this._config.resizableAreaWidth, 0),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.fullSize,
                anchor: UIEdgeSet.topRight,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeRight);
            this._resizeRight
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorEastWestResize()
                .onMouseDown((uiElement, event) => resizeRight(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.top)) {
            this._resizeTop = new UIView({
                frame: new UIRect(0, -this._config.resizableAreaWidth, 0, this._config.resizableAreaWidth),
                widthMode: UISizeMode.fullSize,
                heightMode: UISizeMode.frameSize,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeTop);
            this._resizeTop
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorNorthSouthResize()
                .onMouseDown((uiElement, event) => resizeTop(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.bottom)) {
            this._resizeBottom = new UIView({
                frame: new UIRect(0, -this._config.resizableAreaWidth, 0, this._config.resizableAreaWidth),
                widthMode: UISizeMode.fullSize,
                heightMode: UISizeMode.frameSize,
                anchor: UIEdgeSet.bottomLeft,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeBottom);
            this._resizeBottom
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorNorthSouthResize()
                .onMouseDown((uiElement, event) => resizeBottom(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.left)
            && this._config.resizableEdges.includes(UIEdge.top)) {
            this._resizeLeftTop = new UIView({
                frame: new UIRect(-this._config.resizableAreaWidth, -this._config.resizableAreaWidth, this._config.resizableAreaWidth, this._config.resizableAreaWidth),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.frameSize,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeLeftTop);
            this._resizeLeftTop
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorNorthWestSouthEastResize()
                .onMouseDown((uiElement, event) => resizeLeftTop(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.right)
            && this._config.resizableEdges.includes(UIEdge.top)) {
            this._resizeRightTop = new UIView({
                frame: new UIRect(-this._config.resizableAreaWidth, -this._config.resizableAreaWidth, this._config.resizableAreaWidth, this._config.resizableAreaWidth),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.frameSize,
                anchor: UIEdgeSet.topRight,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeRightTop);
            this._resizeRightTop
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorNorthEastSouthWestResize()
                .onMouseDown((uiElement, event) => resizeRightTop(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.left)
            && this._config.resizableEdges.includes(UIEdge.bottom)) {
            this._resizeLeftBottom = new UIView({
                frame: new UIRect(-this._config.resizableAreaWidth, -this._config.resizableAreaWidth, this._config.resizableAreaWidth, this._config.resizableAreaWidth),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.frameSize,
                anchor: UIEdgeSet.bottomLeft,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeLeftBottom);
            this._resizeLeftBottom
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorNorthEastSouthWestResize()
                .onMouseDown((uiElement, event) => resizeLeftBottom(this, uiElement, event))
        }
        if (this._config.resizableEdges.includes(UIEdge.right)
            && this._config.resizableEdges.includes(UIEdge.bottom)) {
            this._resizeRightBottom = new UIView({
                frame: new UIRect(-this._config.resizableAreaWidth, -this._config.resizableAreaWidth, this._config.resizableAreaWidth, this._config.resizableAreaWidth),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.frameSize,
                anchor: UIEdgeSet.bottomRight,
                initialPosition: false,
                zIndex: 1
            });
            this.container.addSubview(this._resizeRightBottom);
            this._resizeRightBottom
                .getUIElement()
                .resetDisplay()
                .resetBoxSizing()
                .setCursorNorthWestSouthEastResize()
                .onMouseDown((uiElement, event) => resizeRightBottom(this, uiElement, event))
        }

    }

    onResizeStart() {}

    onResizeEnd() {}

    onResize() {}

    resize(width = WINDOW_RESIZABLE_MIN_WIDTH, height = WINDOW_RESIZABLE_MIN_HEIGHT) {
        EventEmitter.emit('window-resize-start', { window: this });
        this.onResizeStart();
        this.container.frame.width = width;
        this.container.frame.height = height;
        this.body.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
        this.body.frame.height = height - this.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
        this.header.frame.width = width - 2 * WINDOW_BORDER_WIDTH;
        this.headerTextLabel.frame.width = width - this.headerActions.frame.width - this.headerIcon.frame.width;
        EventEmitter.emit('window-resize', { window: this });
        this.onResize();
        EventEmitter.emit('window-resize', { window: this });
        this.onResizeEnd();
    }
}

export default UIResizableWindow