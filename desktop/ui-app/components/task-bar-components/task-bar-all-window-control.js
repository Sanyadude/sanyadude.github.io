import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UIEdgeSet, UISizeMode, UIView, UIBorder } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_ALL_WINDOW_BUTTON_BORDER_COLOR, TASK_BAR_ALL_WINDOW_BUTTON_WIDTH, TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_ALL_WINDOW_BUTTON_HEIGHT } from '../../config/desktop-config.js'

export class TaskBarAllWindowControl {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.allWindowsControlContainer = new UIView({
            frame: new UIRect(0, 0, TASK_BAR_ALL_WINDOW_BUTTON_WIDTH, TASK_BAR_ALL_WINDOW_BUTTON_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            border: new UIBorder(1, TASK_BAR_ALL_WINDOW_BUTTON_BORDER_COLOR, UIEdgeSet.left),
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        })
        
        this.allWindowsControlContainer
            .getUIElement()
            .setCursorDefault()
            .onClick((uiElement, event) => {
                EventEmitter.emit('task-bar-all-windows-click');
            })
            .onMouseEnter((uiElement, event) => {
                this.allWindowsControlContainer.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.allWindowsControlContainer.backgroundColor = null;
            })
    }
}

export default TaskBarAllWindowControl