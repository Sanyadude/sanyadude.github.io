import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UISizeMode, UIView, UIEdgeSet, UITextLabel, UITextAlign } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_HEIGHT, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_HEIGHT, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_RIGHT, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_WIDTH } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'

const onWidgetOpenedMouseDown = (uiElement, event) => {
    event.stopPropagation();
}

const onClick = (context, event) => {
    EventEmitter.emit('widget-control', {
        name: 'keyboard-language',
        action: 'toggle',
        coords: {
            x: (widget) => context.windowDesktopApplication.width + 1 - widget.container.frame.width,
            y: (widget) => context.windowDesktopApplication.height - TASK_BAR_HEIGHT + 1 - widget.container.frame.height
        }
    });
}

export class TaskBarKeyboardLanguage {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.keyboardLanguageContainer = new UIView({
            frame: new UIRect(TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_RIGHT, 0, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_WIDTH, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        })
        this.keyboardLanguageLabel = new UITextLabel({
            frame: new UIRect(0, 0, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_WIDTH, TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textAlign: UITextAlign.center,
            font: SystemUIFont.defaultWith(TASK_BAR_KEYBOARD_LANGUAGE_CONTAINER_HEIGHT),
            text: ''
        })

        this.keyboardLanguageContainer
            .getUIElement()
            .onMouseEnter((uiElement, event) => {
                this.keyboardLanguageContainer.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.keyboardLanguageContainer.backgroundColor = null;
            })
            .onClick((uiElement, event) => {
                onClick(this, event);
            })

        this.keyboardLanguageContainer.addSubview(this.keyboardLanguageLabel);

        EventEmitter.subscribe('system-keyboard-language-changed', (payload) => {
            this.keyboardLanguageLabel.text = payload.language.name3Self.toUpperCase();
        });

        EventEmitter.subscribe('widget-keyboard-language-opened', (payload) => {
            this.keyboardLanguageContainer
                .getUIElement()
                .onMouseDown(onWidgetOpenedMouseDown)
        });
        EventEmitter.subscribe('widget-keyboard-language-closed', (payload) => {
            this.keyboardLanguageContainer
                .getUIElement()
                .offMouseDown(onWidgetOpenedMouseDown)
        });
    }
}

export default TaskBarKeyboardLanguage