import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIRect, UISizeMode, UIView, UIEdgeSet, UIIcon, UIOffset } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_ICON_COLOR, TASK_BAR_AUDIO_VOLUME_CONTAINER_HEIGHT, TASK_BAR_AUDIO_VOLUME_CONTAINER_RIGHT, TASK_BAR_AUDIO_VOLUME_CONTAINER_WIDTH, TASK_BAR_AUDIO_VOLUME_ICON_HEIGHT, TASK_BAR_AUDIO_VOLUME_ICON_WIDTH, AUDIO_VOLUME_ICONS, AUDIO_VOLUME_DEFAULT_ICON, TASK_BAR_HEIGHT } from '../../config/desktop-config.js'

const onWidgetOpenedMouseDown = (uiElement, event) => {
    event.stopPropagation();
}

const onClick = (context, event) => {
    EventEmitter.emit('widget-control', {
        name: 'audio',
        action: 'toggle',
        coords: {
            x: (widget) => context.windowDesktopApplication.width + 1 - widget.container.frame.width,
            y: (widget) => context.windowDesktopApplication.height - TASK_BAR_HEIGHT + 1 - widget.container.frame.height
        }
    });
}

export class TaskBarAudioVolume {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.currentVolume = 0;

        this.audioVolumeContainer = new UIView({
            frame: new UIRect(TASK_BAR_AUDIO_VOLUME_CONTAINER_RIGHT, 0, TASK_BAR_AUDIO_VOLUME_CONTAINER_WIDTH, TASK_BAR_AUDIO_VOLUME_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        })
        this.audioVolumeIcon = new UIIcon({
            frame: new UIRect(0, 0, TASK_BAR_AUDIO_VOLUME_ICON_WIDTH, TASK_BAR_AUDIO_VOLUME_ICON_HEIGHT),
            svg: AUDIO_VOLUME_DEFAULT_ICON,
            iconColor: TASK_BAR_ICON_COLOR,
            padding: new UIOffset(2)
        })

        this.audioVolumeContainer
            .getUIElement()
            .onMouseEnter((uiElement, event) => {
                this.audioVolumeIcon.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.audioVolumeIcon.backgroundColor = null;
            })
            .onClick((uiElement, event) => {
                onClick(this, event);
            })

        this.audioVolumeContainer.addSubview(this.audioVolumeIcon);

        EventEmitter.subscribe('system-media-control-audio-volume-changed', (payload) => {
            this.currentVolume = payload.audioVolume;
            if (this.currentVolume >= 66 && this.currentVolume <= 100) {
                this.audioVolumeIcon.svg = AUDIO_VOLUME_ICONS.high;
            } else if (this.currentVolume >= 33 && this.currentVolume < 66) {
                this.audioVolumeIcon.svg = AUDIO_VOLUME_ICONS.normal;
            } else if (this.currentVolume > 0 && this.currentVolume < 33) {
                this.audioVolumeIcon.svg = AUDIO_VOLUME_ICONS.low;
            } else if (this.currentVolume == 0) {
                this.audioVolumeIcon.svg = AUDIO_VOLUME_ICONS.mute;
            }
        });

        EventEmitter.subscribe('widget-audio-opened', (payload) => {
            this.audioVolumeContainer
                .getUIElement()
                .onMouseDown(onWidgetOpenedMouseDown)
        });
        EventEmitter.subscribe('widget-audio-closed', (payload) => {
            this.audioVolumeContainer
                .getUIElement()
                .offMouseDown(onWidgetOpenedMouseDown)
        });
    }
}

export default TaskBarAudioVolume