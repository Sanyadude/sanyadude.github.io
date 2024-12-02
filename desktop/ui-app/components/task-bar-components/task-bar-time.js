import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UISizeMode, UIView, UITextLabel, UITextAlign, UIColor, UIEdgeSet } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_TIME_CONTAINER_HEIGHT, TASK_BAR_TIME_CONTAINER_RIGHT, TASK_BAR_TIME_CONTAINER_WIDTH } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'

const onTimeTick = (context, date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${day}.${month}.${year}`;
    context.dateLabel.text = dateString;
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    context.timeLabel.text = timeString;
}

export class TaskBarTime {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.timeContainer = new UIView({
            frame: new UIRect(TASK_BAR_TIME_CONTAINER_RIGHT, 0, TASK_BAR_TIME_CONTAINER_WIDTH, TASK_BAR_TIME_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight,
            font: SystemUIFont.defaultWith(TASK_BAR_TIME_CONTAINER_HEIGHT / 2)
        })
        this.timeLabel = new UITextLabel({
            frame: new UIRect(0, 0, TASK_BAR_TIME_CONTAINER_WIDTH, TASK_BAR_TIME_CONTAINER_HEIGHT / 2),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textAlign: UITextAlign.center,
            text: ''
        })
        this.dateLabel = new UITextLabel({
            frame: new UIRect(0, TASK_BAR_TIME_CONTAINER_HEIGHT / 2, TASK_BAR_TIME_CONTAINER_WIDTH, TASK_BAR_TIME_CONTAINER_HEIGHT / 2),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textAlign: UITextAlign.center,
            text: ''
        })

        this.timeContainer
            .getUIElement()
            .onMouseEnter((uiElement, event) => {
                this.timeContainer.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.timeContainer.backgroundColor = null;
            })

        this.timeContainer.addSubviews([this.timeLabel, this.dateLabel]);

        EventEmitter.subscribe('system-time-tick', (payload) => {
            const date = new Date(payload.currentTime);
            onTimeTick(this, date);
        });
    }
}

export default TaskBarTime