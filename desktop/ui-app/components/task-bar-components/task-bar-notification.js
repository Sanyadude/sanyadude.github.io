import { UIRect, UISizeMode, UIView, UIEdgeSet, UIIcon, UIOffset } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_NOTIFICATION_ICON_HEIGHT, TASK_BAR_NOTIFICATION_ICON_WIDTH, TASK_BAR_NOTIFICATION_CONTAINER_HEIGHT, TASK_BAR_NOTIFICATION_CONTAINER_RIGHT, TASK_BAR_NOTIFICATION_CONTAINER_WIDTH, TASK_BAR_NOTIFICATION_ICON, TASK_BAR_ICON_COLOR } from '../../config/desktop-config.js'

export class TaskBarNotification {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.notificationContainer = new UIView({
            frame: new UIRect(TASK_BAR_NOTIFICATION_CONTAINER_RIGHT, 0, TASK_BAR_NOTIFICATION_CONTAINER_WIDTH, TASK_BAR_NOTIFICATION_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        })
        this.notificationIcon = new UIIcon({
            frame: new UIRect(0, 0, TASK_BAR_NOTIFICATION_ICON_WIDTH, TASK_BAR_NOTIFICATION_ICON_HEIGHT),
            svg: TASK_BAR_NOTIFICATION_ICON,
            iconColor: TASK_BAR_ICON_COLOR,
            padding: new UIOffset(12)
        })

        this.notificationContainer
            .getUIElement()
            .onMouseEnter((uiElement, event) => {
                this.notificationIcon.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.notificationIcon.backgroundColor = null;
            })

        this.notificationContainer.addSubview(this.notificationIcon);
    }
}

export default TaskBarNotification