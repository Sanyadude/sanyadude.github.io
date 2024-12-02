import { UIImageView, UIRect, UIEdgeSet, UISizeMode, UITextLabel, UIView, UIOffset } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_TASK_HEIGHT, TASK_BAR_TASK_WIDTH, TASK_BAR_TASK_ICON_WIDTH, TASK_BAR_TASK_ICON_HEIGHT, TASK_BAR_TASK_ICON_PADDING, TASK_BAR_TASK_LABEL_WIDTH, TASK_BAR_TASK_LABEL_HEIGHT, TASK_BAR_TASK_BOTTOM_BORDER_COLOR, TASK_BAR_TASK_BOTTOM_BORDER_FRAME, TASK_BAR_TASK_SELECTED_BOTTOM_BORDER_FRAME, TASK_BAR_TASK_BACKGROUND_COLOR, TASK_BAR_TASK_SELECTED_BACKGROUND_COLOR, TASK_BAR_TEXT_COLOR, TASK_BAR_TASK_DEFAULT_IMAGE, TASK_BAR_TASK_DEFAULT_TEXT } from '../../config/desktop-config.js'
import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { SystemUIFont } from '../../config/fonts.js'

const START_MOVING_THRESHOLD = 5;

const mouseDownHandler = (context, uiElement, event) => {
    context._dragged = {
        startFrame: context.container.frame.copy(),
        moved: false,
        startX: event.clientX,
        deltaX: context.container.getUIElement().getOffsetLeft()
    };
    const onMove = (event) => {
        event.preventDefault();
        if (!context._dragged) return;
        let newX = event.clientX - context._dragged.startX + context._dragged.deltaX;
        if (!context._dragged.moved 
            && Math.abs(newX - context._dragged.startFrame.x) < START_MOVING_THRESHOLD) return;
        if (newX < 0) {
            newX = 0;
        }
        if (newX > context.container.superView.frame.width - context.container.frame.width) {
            newX = context.container.superView.frame.width - context.container.frame.width;
        }
        const currentIndex = context.container.superView.subViews.findIndex(subView => subView === context.container);
        const newIndex = Math.round(newX / context.container.frame.width);
        if (currentIndex != newIndex) {
            const subViews = context.container.superView.subViews;
            let currentView = subViews.splice(currentIndex, 1)[0];
            subViews.splice(newIndex, 0, currentView);
            EventEmitter.emit('taskbar-task-position-update', { task: context, event });
        }
        context._dragged.moved = true;
        context.container.frame.x = newX;
        EventEmitter.emit('task-drag', { task: context, event });
    }
    const onMouseUp = (event) => {
        event.preventDefault();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onMouseUp);
        const isMoved = context._dragged.moved;
        context._dragged = false;
        EventEmitter.emit('taskbar-task-position-update', { task: context, event });
        EventEmitter.emit('task-drag-end', { task: context, event });
        if (isMoved) return;
        EventEmitter.emit('taskbar-task-click', { task: context, processId: context.processId });
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
    EventEmitter.emit('task-drag-start', { task: context, event });
}

export class UITaskbarTask {
    constructor(processId, config) {
        this.processId = processId;
        const defaultConfig = {
            text: TASK_BAR_TASK_DEFAULT_TEXT,
            iconImage: TASK_BAR_TASK_DEFAULT_IMAGE
        };
        const mergedConfig = Object.assign(defaultConfig, config);
        this._config = mergedConfig || {};
        this._init();
    }

    _init() {
        this._configure();
        delete this._config;
        return this;
    }

    _configure() {
        this.container = new UIView({
            frame: new UIRect(0, 0, TASK_BAR_TASK_WIDTH, TASK_BAR_TASK_HEIGHT),
            heightMode: UISizeMode.frameSize,
            widthMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.icon = new UIImageView({
            image: this._config.iconImage,
            frame: new UIRect(0, 0, TASK_BAR_TASK_ICON_WIDTH, TASK_BAR_TASK_ICON_HEIGHT),
            heightMode: UISizeMode.frameSize,
            widthMode: UISizeMode.frameSize,
            padding: new UIOffset(TASK_BAR_TASK_ICON_PADDING)
        });
        this.label = new UITextLabel({
            frame: new UIRect(TASK_BAR_TASK_ICON_WIDTH, 0, TASK_BAR_TASK_LABEL_WIDTH, TASK_BAR_TASK_LABEL_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            text: this._config.text,
            font: SystemUIFont.defaultWith(TASK_BAR_TASK_ICON_HEIGHT),
            textColor: TASK_BAR_TEXT_COLOR,
            textTruncate: true
        });
        this.bottomBorder = new UIView({
            frame: TASK_BAR_TASK_BOTTOM_BORDER_FRAME,
            heightMode: UISizeMode.frameSize,
            widthMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.bottomLeft,
            backgroundColor: TASK_BAR_TASK_BOTTOM_BORDER_COLOR
        })
        this.container.addSubviews([this.icon, this.label, this.bottomBorder]);

        this.icon
            .getUIElement()
            .onMouseDown((uiElement, event) => event.preventDefault());
        this.container
            .getUIElement()
            .setCursorDefault()
            .setUserSelectNone()
            .onMouseDown((uiElement, event) => mouseDownHandler(this, uiElement, event));
        
        this.selected = false;
    }

    select() {
        this.selected = true;
        this.container.backgroundColor = TASK_BAR_TASK_SELECTED_BACKGROUND_COLOR;
        this.bottomBorder.frame = TASK_BAR_TASK_SELECTED_BOTTOM_BORDER_FRAME;
    }

    deselect() {
        this.selected = false;
        this.container.backgroundColor = TASK_BAR_TASK_BACKGROUND_COLOR;
        this.bottomBorder.frame = TASK_BAR_TASK_BOTTOM_BORDER_FRAME;
    }

}

export default UITaskbarTask