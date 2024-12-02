import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import UIWidget from './ui-widget.js'
import { UIEdgeSet, UIIcon, UIOffset, UIRect, UISizeMode, UISlider, UITextAlign, UITextLabel } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_ICON_COLOR, AUDIO_VOLUME_DEFAULT_ICON, AUDIO_VOLUME_ICONS, WIDGET_AUDIO_VOLUME_HEIGHT, WIDGET_AUDIO_VOLUME_ICON_HEIGHT, WIDGET_AUDIO_VOLUME_ICON_WIDTH, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_HEIGHT, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_PADDING, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_WIDTH, WIDGET_AUDIO_VOLUME_SLIDER_HEIGHT, WIDGET_AUDIO_VOLUME_SLIDER_THUMB_BACKGROUND_COLOR, WIDGET_AUDIO_VOLUME_SLIDER_TRACK_BACKGROUND_COLOR, WIDGET_AUDIO_VOLUME_SLIDER_TRACK_FILL_BACKGROUND_COLOR, WIDGET_AUDIO_VOLUME_SLIDER_WIDTH, WIDGET_AUDIO_VOLUME_VALUE_LABEL_HEIGHT, WIDGET_AUDIO_VOLUME_VALUE_LABEL_WIDTH, WIDGET_AUDIO_VOLUME_WIDTH, WIDGET_AUDIO_VOLUME_SLIDER_THUMB_FRAME_BORDER_RADIUS, WIDGET_AUDIO_VOLUME_SLIDER_THUMB_FRAME_HEIGHT, WIDGET_AUDIO_VOLUME_SLIDER_THUMB_FRAME_WIDTH, WIDGET_AUDIO_VOLUME_SLIDER_PADDING, TASK_BAR_HEIGHT } from '../../config/desktop-config.js'
import SystemUIFont from '../../config/fonts.js'

const onVolumeChanged = (volume, context) => {
    context.currentVolume = volume;
    context.slider.setValue(volume, true);
    context.valueLabel.text = context.currentVolume;
    if (context.currentVolume >= 66 && context.currentVolume <= 100) {
        context.icon.svg = AUDIO_VOLUME_ICONS.high;
    } else if (context.currentVolume >= 33 && context.currentVolume < 66) {
        context.icon.svg = AUDIO_VOLUME_ICONS.normal;
    } else if (context.currentVolume > 0 && context.currentVolume < 33) {
        context.icon.svg = AUDIO_VOLUME_ICONS.low;
    } else if (context.currentVolume == 0) {
        context.icon.svg = AUDIO_VOLUME_ICONS.mute;
    }
}

export class AudioVolumeWidget extends UIWidget {
    constructor() {
        super('audio', { frame: new UIRect(0, 0, WIDGET_AUDIO_VOLUME_WIDTH, WIDGET_AUDIO_VOLUME_HEIGHT) });
    }

    _configure() {
        super._configure();
        this.currentVolume = 0;

        this.outputLabel = new UITextLabel({
            frame: new UIRect(0, 0, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_WIDTH, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: new UIOffset(WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_PADDING, UIEdgeSet.horizontal),
            font: SystemUIFont.xLargeWith(WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_HEIGHT),
            text: '-',
            textTruncate: true
        })
        this.icon = new UIIcon({
            frame: new UIRect(0, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_HEIGHT, WIDGET_AUDIO_VOLUME_ICON_WIDTH, WIDGET_AUDIO_VOLUME_ICON_HEIGHT),
            initialPosition: false,
            svg: AUDIO_VOLUME_DEFAULT_ICON,
            iconColor: TASK_BAR_ICON_COLOR,
            padding: new UIOffset(15)
        })
        this.slider = new UISlider({
            frame: new UIRect(WIDGET_AUDIO_VOLUME_ICON_WIDTH, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_HEIGHT, WIDGET_AUDIO_VOLUME_SLIDER_WIDTH, WIDGET_AUDIO_VOLUME_SLIDER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: WIDGET_AUDIO_VOLUME_SLIDER_PADDING,
            trackBackgroundColor: WIDGET_AUDIO_VOLUME_SLIDER_TRACK_BACKGROUND_COLOR,
            trackBorder: null,
            trackFillBackgroundColor: WIDGET_AUDIO_VOLUME_SLIDER_TRACK_FILL_BACKGROUND_COLOR,
            thumbFrame: new UIRect(0, 0, WIDGET_AUDIO_VOLUME_SLIDER_THUMB_FRAME_WIDTH, WIDGET_AUDIO_VOLUME_SLIDER_THUMB_FRAME_HEIGHT),
            thumbBackgroundColor: WIDGET_AUDIO_VOLUME_SLIDER_THUMB_BACKGROUND_COLOR,
            thumbBorderRadius: WIDGET_AUDIO_VOLUME_SLIDER_THUMB_FRAME_BORDER_RADIUS,
            value: this.currentVolume
        })
        this.valueLabel = new UITextLabel({
            frame: new UIRect(WIDGET_AUDIO_VOLUME_ICON_WIDTH + WIDGET_AUDIO_VOLUME_SLIDER_WIDTH, WIDGET_AUDIO_VOLUME_OUTPUT_LABEL_HEIGHT, WIDGET_AUDIO_VOLUME_VALUE_LABEL_WIDTH, WIDGET_AUDIO_VOLUME_VALUE_LABEL_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textAlign: UITextAlign.center,
            font: SystemUIFont.xxxxLargeWith(WIDGET_AUDIO_VOLUME_VALUE_LABEL_HEIGHT),
            text: this.currentVolume
        })

        this.slider.onValueChanged = (value => {
            EventEmitter.emit('system-media-control-audio-volume-change', { audioVolume: value })
        })

        this.outputLabel
            .getUIElement()
            .setUserSelectNone()

        this.slider
            .getUIElement()
            .setCursorDefault()

        this.valueLabel
            .getUIElement()
            .setUserSelectNone()

        this.container.addSubviews([this.outputLabel, this.icon, this.slider, this.valueLabel]);

        EventEmitter.subscribe('system-media-control-audio-volume-changed', (payload) => {
            onVolumeChanged(payload.audioVolume, this);
        });
        EventEmitter.subscribe('system-media-control-audio-output-device-init', (payload) => {
            this.outputLabel.text = payload.name;
        });

        onVolumeChanged(this.currentVolume, this);
    }
}

export default AudioVolumeWidget