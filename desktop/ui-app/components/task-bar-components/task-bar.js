import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UIEdgeSet, UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_BACKGROUND_COLOR, TASK_BAR_TEXT_COLOR, TASK_BAR_HEIGHT } from '../../config/desktop-config.js'
import UITaskbarTask from './ui-taskbar-task.js'
import TaskBarSearch from './task-bar-search.js'
import TaskBarStart from './task-bar-start.js'
import TaskBarStatus from './task-bar-status.js'
import TaskBarTasks from './task-bar-tasks.js'

export class TaskBar {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.taskBarStart = new TaskBarStart(windowDesktopApplication);
        this.taskBarSearch = new TaskBarSearch(windowDesktopApplication);
        this.taskBarTasks = new TaskBarTasks(windowDesktopApplication);
        this.taskBarStatus = new TaskBarStatus(windowDesktopApplication);

        this._init();
    }

    _init() {
        this.taskBarContainer = new UIView({
            frame: new UIRect(0, 0, this.windowDesktopApplication.width, TASK_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.bottomLeft,
            backgroundColor: TASK_BAR_BACKGROUND_COLOR,
            textColor: TASK_BAR_TEXT_COLOR,
            zIndex: 1
        });

        this.taskBarContainer.addSubviews([this.taskBarStart.iconContainer, this.taskBarSearch.searchContainer, this.taskBarSearch.searchPlaceholder, this.taskBarSearch.searchIcon, this.taskBarSearch.searchTextField, this.taskBarTasks.tasksContainer, this.taskBarStatus.statusContainer]);

        this.windowDesktopApplication.applicationRoot.addComponent(this.taskBarContainer);

        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.taskBarContainer.frame = new UIRect(0, 0, payload.width, TASK_BAR_HEIGHT);
        })
        EventEmitter.subscribe('taskbar-task-position-update', (payload) => {
            const subViews = this.taskBarTasks.tasksContainer.subViews;
            subViews.forEach((subView, index) => {
                subView.frame.x = index * subView.frame.width;
            })
        })
    }

    createTask(processId, config) {
        return new UITaskbarTask(processId, config);
    }

    addTask(task) {
        if (!task) return;
        if (this.taskBarTasks.tasksContainer.subViews.length > 0) {
            const lastTask = this.taskBarTasks.tasksContainer.getLastSubview();
            task.container.frame.x = lastTask.frame.x + lastTask.frame.width;
        }
        this.taskBarTasks.tasksContainer.addSubview(task.container);
    }

    removeTask(task) {
        if (!task) return;
        this.taskBarTasks.tasksContainer.removeSubview(task.container);
    }

}

export default TaskBar