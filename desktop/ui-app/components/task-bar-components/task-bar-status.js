import { UIRect, UIEdgeSet, UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HEIGHT, TASK_BAR_STATUS_WIDTH } from '../../config/desktop-config.js'
import TaskBarAllWindowControl from './task-bar-all-window-control.js'
import TaskBarKeyboardLanguage from './task-bar-keyboard-language.js'
import TaskBarNetwork from './task-bar-network.js'
import TaskBarNotification from './task-bar-notification.js'
import TaskBarAudioVolume from './task-bar-audio-volume.js'
import TaskBarTime from './task-bar-time.js'

export class TaskBarStatus {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.taskBarAllWindowControl = new TaskBarAllWindowControl(windowDesktopApplication);
        this.taskBarTime = new TaskBarTime(windowDesktopApplication);
        this.taskBarNotification = new TaskBarNotification(windowDesktopApplication);
        this.taskBarKeyboardLanguage = new TaskBarKeyboardLanguage(windowDesktopApplication);
        this.taskBarAudioVolume = new TaskBarAudioVolume(windowDesktopApplication);
        this.taskBarNetwork = new TaskBarNetwork(windowDesktopApplication);

        this._init();
    }

    _init() {
        this.statusContainer = new UIView({
            frame: new UIRect(0, 0, TASK_BAR_STATUS_WIDTH, TASK_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        })
        
        this.statusContainer
            .getUIElement()
            .setUserSelectNone()

        this.statusContainer.addSubviews([
            this.taskBarNetwork.networkContainer,
            this.taskBarAudioVolume.audioVolumeContainer,
            this.taskBarKeyboardLanguage.keyboardLanguageContainer, 
            this.taskBarTime.timeContainer, 
            this.taskBarNotification.notificationContainer, 
            this.taskBarAllWindowControl.allWindowsControlContainer
        ]);
    }
}

export default TaskBarStatus