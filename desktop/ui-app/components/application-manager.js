import EventEmitter from '../../event-emmiter/event-emmiter.js'
import { UIRect } from '../../ui-tool-kit/index.js'
import { AUTO_MAXIMIZE_WINDOW_X_THRESHOLD, TASK_BAR_HEIGHT, WINDOW_ACTIVE_BORDER_COLOR, WINDOW_BORDER_COLOR, WINDOW_BORDER_WIDTH } from '../config/desktop-config.js'
import ApplicationProcess from './application-components/application-process.js'

const getIdGenerator = () => {
    let id = 0;
    return {
        current: () => id,
        next: () => ++id
    }
}

const activateApplicationWindow = (applicationWindow) => {
    applicationWindow.window._active = true;
    applicationWindow.window.container.border.color = WINDOW_ACTIVE_BORDER_COLOR;
    EventEmitter.emit('window-activate', { window: applicationWindow.window });
    applicationWindow.window.onActivate?.();
    EventEmitter.emit('application-window-activated', { processId: applicationWindow.processId });
}

const deactivateApplicationWindow = (applicationWindow) => {
    applicationWindow.window._active = false;
    applicationWindow.window.container.border.color = WINDOW_BORDER_COLOR;
    EventEmitter.emit('window-deactivate', { window: applicationWindow.window });
    applicationWindow.window.onDeactivate?.();
    EventEmitter.emit('application-window-deactivated', { processId: applicationWindow.processId });
}

const activate = (payload, context) => {
    const applicationWindowsOrdered = Object.values(context.applicationProcesses).map(x => x.applicationWindow).sort((a, b) => {
        return a.window.container.zIndex - b.window.container.zIndex;
    })
    const currentWindowIndex = applicationWindowsOrdered.findIndex(x => x == payload.applicationWindow);
    applicationWindowsOrdered.push(applicationWindowsOrdered.splice(currentWindowIndex, 1)[0]);
    for (let i = 0; i < applicationWindowsOrdered.length; i++) {
        const applicationWindow = applicationWindowsOrdered[i];
        applicationWindow.window.container.zIndex = context.startWindowsZIndex + i;
        if (applicationWindow === payload.applicationWindow) {
            activateApplicationWindow(applicationWindow);
            continue;
        }
        deactivateApplicationWindow(applicationWindow);
    }
}

const onDrag = (payload, context) => {
    if (payload.window._maximized) {
        const maximizedXRatio = payload.event.clientX / (payload.window.header.frame.width - payload.window.headerActions.frame.width);
        payload.window.restore();
        const restoredXOffset = Math.round((payload.window.header.frame.width - payload.window.headerActions.frame.width) * maximizedXRatio);
        payload.window.container.frame.x = payload.event.clientX - restoredXOffset;
        payload.window._dragged.deltaX = payload.event.clientX - restoredXOffset;
    }
    if (payload.window._maximizedLeft) {
        const maximizedXRatio = payload.event.clientX / (payload.window.header.frame.width - payload.window.headerActions.frame.width);
        payload.window.resize(payload.window._maximizedLeft?.restoreFrame.width, payload.window._maximizedLeft?.restoreFrame.height);
        const restoredXOffset = Math.round((payload.window.header.frame.width - payload.window.headerActions.frame.width) * maximizedXRatio);
        payload.window.container.frame.x = payload.event.clientX - restoredXOffset;
        payload.window._dragged.deltaX = payload.event.clientX - restoredXOffset;
        payload.window._maximizedLeft = false;
    }
    if (payload.window._maximizedRight) {
        const maximizedXRatio = (payload.event.clientX - (context.windowDesktopApplication.width / 2)) / (payload.window.header.frame.width - payload.window.headerActions.frame.width);
        payload.window.resize(payload.window._maximizedRight?.restoreFrame.width, payload.window._maximizedRight?.restoreFrame.height);
        const restoredXOffset = Math.round((payload.window.header.frame.width - payload.window.headerActions.frame.width) * maximizedXRatio);
        payload.window.container.frame.x = payload.event.clientX - restoredXOffset;
        payload.window._dragged.deltaX = payload.event.clientX - restoredXOffset;
        payload.window._maximizedRight = false;
    }
    if (payload.event.clientY <= 0) {
        payload.window.container.frame.x = payload.event.clientX - payload.window._dragged.startX + payload.window._dragged.deltaX;
        payload.window.container.frame.y = payload.window._dragged.deltaY - payload.window._dragged.startY;
    }
    if (payload.event.clientY >= (context.windowDesktopApplication.height - TASK_BAR_HEIGHT)) {
        payload.window.container.frame.x = payload.event.clientX - payload.window._dragged.startX + payload.window._dragged.deltaX;
        payload.window.container.frame.y = payload.window._dragged.deltaY - payload.window._dragged.startY + context.windowDesktopApplication.height - TASK_BAR_HEIGHT;
    }
}

const onDragEnd = (payload, context) => {
    if (payload.event.clientY <= 0) {
        payload.window.maximize();
    }
    if (payload.event.clientX <= AUTO_MAXIMIZE_WINDOW_X_THRESHOLD) {
        payload.window._maximizedLeft = { restoreFrame: payload.window.container.frame.copy() };
        payload.window.container.frame.x = 0;
        payload.window.container.frame.y = 0;
        payload.window.resize(context.windowDesktopApplication.width / 2, context.windowDesktopApplication.height - TASK_BAR_HEIGHT);
    }
    if (payload.event.clientX >= (context.windowDesktopApplication.width - AUTO_MAXIMIZE_WINDOW_X_THRESHOLD)) {
        payload.window._maximizedRight = { restoreFrame: payload.window.container.frame.copy() };
        payload.window.container.frame.x = context.windowDesktopApplication.width / 2;
        payload.window.container.frame.y = 0;
        payload.window.resize(context.windowDesktopApplication.width / 2, context.windowDesktopApplication.height - TASK_BAR_HEIGHT);
    }
}

const onApplicationWindowStart = (payload, context) => {
    const application = context.applications[payload.applicationWindow.appId];
    if (!application) return null;
    context.windowDesktopApplication.desktop.addWindow(payload.applicationWindow.window);
    context.windowDesktopApplication.taskBar.addTask(payload.applicationWindow.task);
    payload.applicationWindow.openWindow();
    activate({ applicationWindow: payload.applicationWindow }, context);
}

const onApplicationWindowStop = (payload, context) => {
    context.windowDesktopApplication.desktop.removeWindow(payload.applicationWindow.window);
    context.windowDesktopApplication.taskBar.removeTask(payload.applicationWindow.task);
    EventEmitter.emit('taskbar-task-position-update', { task: payload.applicationWindow.task });
    payload.applicationWindow.dispose();
    delete context.applicationProcesses[payload.applicationWindow.processId];
}

const onTaskBarTaskClick = (payload, context) => {
    const applicationProcess = context.applicationProcesses[payload.processId];
    if (applicationProcess.applicationWindow.window._minimized) {
        applicationProcess.applicationWindow.restoreWindow();
    } else if (applicationProcess.applicationWindow.window._active) {
        applicationProcess.applicationWindow.minimizeWindow();
        return;
    }
    activate({ applicationWindow: applicationProcess.applicationWindow }, context);
}

const onAllWindowsClick = (context) => {
    const isAnyWindowOpened = Object.values(context.applicationProcesses).some(x => !x.applicationWindow.window._minimized);
    if (isAnyWindowOpened) {
        context.minimizeAll();
    } else {
        context.restoreMinimizedAll();
    }
}

export class ApplicationManager {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.applications = {};

        this.applicationProcesses = {};
        this.processIdGenerator = getIdGenerator();

        this.startWindowsZIndex = 1;
        this._init();
    }

    _init() {
        EventEmitter.subscribe('application-window-start', (payload) => {
            onApplicationWindowStart(payload, this);
        });
        EventEmitter.subscribe('application-window-stop', (payload) => {
            onApplicationWindowStop(payload, this);
        });
        EventEmitter.subscribe('window-maximize', (payload) => {
            payload.window.container.frame = new UIRect(0, 0, this.windowDesktopApplication.width, this.windowDesktopApplication.height - TASK_BAR_HEIGHT);
            payload.window.body.frame.width = payload.window.container.frame.width - 2 * WINDOW_BORDER_WIDTH;
            payload.window.body.frame.height = payload.window.container.frame.height - payload.window.header.frame.height - 2 * WINDOW_BORDER_WIDTH;
            payload.window.header.frame.width = payload.window.container.frame.width - 2 * WINDOW_BORDER_WIDTH;
            payload.window.headerTextLabel.frame.width = this.windowDesktopApplication.width - payload.window.headerActions.frame.width - payload.window.headerIcon.frame.width;
        });
        EventEmitter.subscribe('window-drag', (payload) => {
            onDrag(payload, this);
        });
        EventEmitter.subscribe('window-drag-end', (payload) => {
            onDragEnd(payload, this);
        });
        EventEmitter.subscribe('taskbar-task-click', (payload) => {
            onTaskBarTaskClick(payload, this);
        });
        EventEmitter.subscribe('application-window-minimized', (payload) => {
            const applicationProcess = this.applicationProcesses[payload.processId];
            if (!applicationProcess.task) return;
            applicationProcess.task.deselect();
        })
        EventEmitter.subscribe('application-window-activated', (payload) => {
            const applicationProcess = this.applicationProcesses[payload.processId];
            if (!applicationProcess.task) return;
            applicationProcess.task.select();
        })
        EventEmitter.subscribe('application-window-deactivated', (payload) => {
            const applicationProcess = this.applicationProcesses[payload.processId];
            if (!applicationProcess.task) return;
            applicationProcess.task.deselect();
        })
        EventEmitter.subscribe('task-bar-all-windows-click', () => {
            onAllWindowsClick(this);
        });
        EventEmitter.subscribe('application-process-start', (payload) => {
            this.createApplicationProcess(payload.appId, payload.callback);
        });
    }

    createProcess() {
        return new ApplicationProcess(this.processIdGenerator.next());
    }

    installApplication(application) {
        this.applications[application.id] = application;
        return application.id;
    }

    createApplicationProcess(applicationId, callback) {
        const application = this.applications[applicationId];
        if (!application) return null;

        const process = this.createProcess();
        this.applicationProcesses[process.id] = process;

        const applicationWindow = application.createApplicationWindow(process.id);
        process.applicationWindow = applicationWindow;

        const task = this.windowDesktopApplication.taskBar.createTask(applicationWindow.processId, { text: application.appName, iconImage: application.icon });
        process.task = task;
        applicationWindow.task = task;

        applicationWindow.window.container.getUIElement()
            .onMouseDown(() => activate({ applicationWindow: applicationWindow }, this));
        applicationWindow.window.headerActions.getUIElement()
            .onMouseDown(() => activate({ applicationWindow: applicationWindow }, this));

        if (!callback) return process;
        callback(process);
        
        return process;
    }

    createApplicationShortcut(applicationId, shortcutName, action) {
        const application = this.applications[applicationId];
        if (!application) return null;
        const shortcut = this.windowDesktopApplication.desktop.createShortcut({
            name: shortcutName,
            iconImage: application.icon,
            action: () => this.createApplicationProcess(applicationId, action)
        });
        return shortcut;
    }

    minimizeAll() {
        Object.values(this.applicationProcesses).forEach(process => {
            process.applicationWindow.minimizeWindow();
            deactivateApplicationWindow(process.applicationWindow);
        });
    }

    restoreMinimizedAll() {
        Object.values(this.applicationProcesses).forEach(process => {
            process.applicationWindow.restoreWindow();
        });
    }

}

export default ApplicationManager