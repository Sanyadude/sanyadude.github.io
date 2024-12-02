import { UIIcon, UIOffset, UIRect, UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_HEIGHT, TASK_BAR_ICON_COLOR, TASK_BAR_START_HOVER_ICON_COLOR, TASK_BAR_START_ICON_PADDING, TASK_BAR_START_ICON_SVG, TASK_BAR_START_ICON_WIDTH } from '../../config/desktop-config.js'

export class TaskBarStart {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.iconContainer = new UIView({
            frame: new UIRect(0, 0, TASK_BAR_START_ICON_WIDTH, TASK_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.icon = new UIIcon({
            frame: new UIRect(0, 0, TASK_BAR_START_ICON_WIDTH, TASK_BAR_HEIGHT),
            padding: new UIOffset(TASK_BAR_START_ICON_PADDING),
            iconColor: TASK_BAR_ICON_COLOR,
            svg: TASK_BAR_START_ICON_SVG
        })
        this.icon
            .getUIElement()
            .onMouseEnter((uiElement, event) => {
                this.icon.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
                this.icon.iconColor = TASK_BAR_START_HOVER_ICON_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.icon.backgroundColor = null;
                this.icon.iconColor = TASK_BAR_ICON_COLOR
            })

        this.iconContainer.addSubview(this.icon);
    }
}

export default TaskBarStart