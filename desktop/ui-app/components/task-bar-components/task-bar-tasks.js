import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HEIGHT, TASK_BAR_START_ICON_WIDTH, TASK_BAR_SEARCH_BAR_CONTAINER_WIDTH, TASK_BAR_STATUS_WIDTH } from '../../config/desktop-config.js'

const TASK_BAR_TASKS_CONTAINER_LEFT = TASK_BAR_START_ICON_WIDTH + TASK_BAR_SEARCH_BAR_CONTAINER_WIDTH;

const getTaskBarTasksContainerWidth = (width) => {
    return width - TASK_BAR_START_ICON_WIDTH - TASK_BAR_SEARCH_BAR_CONTAINER_WIDTH - TASK_BAR_STATUS_WIDTH;
}

export class TaskBarTasks {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.tasksContainer = new UIView({
            frame: new UIRect(TASK_BAR_TASKS_CONTAINER_LEFT, 0, getTaskBarTasksContainerWidth(this.windowDesktopApplication.width), TASK_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            clipToFrame: true
        })

        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.tasksContainer.frame = new UIRect(TASK_BAR_TASKS_CONTAINER_LEFT, 0, getTaskBarTasksContainerWidth(payload.width), TASK_BAR_HEIGHT);
        });
    }
}

export default TaskBarTasks