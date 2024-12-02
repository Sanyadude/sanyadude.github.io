import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UISizeMode, UIView, UIEdgeSet, UIIcon, UIOffset } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_ICON_COLOR, TASK_BAR_NETWORK_DEFAULT_ICON, TASK_BAR_NETWORK_CONTAINER_HEIGHT, TASK_BAR_NETWORK_CONTAINER_RIGHT, TASK_BAR_NETWORK_CONTAINER_WIDTH, TASK_BAR_NETWORK_ICON_HEIGHT, TASK_BAR_NETWORK_ICON_WIDTH, TASK_BAR_NETWORK_ICONS } from '../../config/desktop-config.js'

export class TaskBarNetwork {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.isOnline = null;

        this.networkContainer = new UIView({
            frame: new UIRect(TASK_BAR_NETWORK_CONTAINER_RIGHT, 0, TASK_BAR_NETWORK_CONTAINER_WIDTH, TASK_BAR_NETWORK_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        })
        this.networkIcon = new UIIcon({
            frame: new UIRect(0, 0, TASK_BAR_NETWORK_ICON_WIDTH, TASK_BAR_NETWORK_ICON_HEIGHT),
            svg: TASK_BAR_NETWORK_DEFAULT_ICON,
            iconColor: TASK_BAR_ICON_COLOR,
            padding: new UIOffset(3)
        })

        this.networkContainer
            .getUIElement()
            .onMouseEnter((uiElement, event) => {
                this.networkIcon.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.networkIcon.backgroundColor = null;
            })

        this.networkContainer.addSubview(this.networkIcon);

        EventEmitter.subscribe('system-network-status-changed', (payload) => {
            this.isOnline = payload.isOnline;
            this.networkIcon.svg = this.isOnline
                ? TASK_BAR_NETWORK_ICONS.on
                : TASK_BAR_NETWORK_ICONS.off;
        });
    }
}

export default TaskBarNetwork