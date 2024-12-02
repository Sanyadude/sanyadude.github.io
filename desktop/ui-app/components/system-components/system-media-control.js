import EventEmitter from '../../../event-emmiter/event-emmiter.js'

const MIN_AUDIO_VOLUME = 0;
const MAX_AUDIO_VOLUME = 100;
const DEFAULT_AUDIO_VOLUME = MAX_AUDIO_VOLUME;
const DEFAULT_VOLUME_STEP = 1;
const DEFAULT_OUTPUT_DEVICE_NAME = 'Audio Output Device';

const normalizeAudioVolumeValue = (value) => Math.min(Math.max(Math.round(value), MIN_AUDIO_VOLUME), MAX_AUDIO_VOLUME);

const setAudioOutputDevices = (context) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        EventEmitter.emit('system-media-control-audio-output-device-init', { name: DEFAULT_OUTPUT_DEVICE_NAME });
        return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => context.userAllowedAudioDevices = true)
        .catch(() => context.userAllowedAudioDevices = false);

    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
            const defaultDevice = audioOutputDevices[audioOutputDevices.length - 1];
            const deviceName = defaultDevice 
                ? (defaultDevice.label || DEFAULT_OUTPUT_DEVICE_NAME)
                : DEFAULT_OUTPUT_DEVICE_NAME;
            context.audioOutputDeviceName = deviceName;
            EventEmitter.emit('system-media-control-audio-output-device-init', { name: deviceName });
        });
}

export class SystemMediaControl {
    constructor() {
        this.audioVolume = DEFAULT_AUDIO_VOLUME;
        this.audioVolumeStep = DEFAULT_VOLUME_STEP;

        this.userAllowedAudioDevices = false;
        this.audioOutputDeviceName = '';

        this._init();
    }

    _init() {
        setAudioOutputDevices(this);

        EventEmitter.subscribe('system-media-control-audio-volume-change', (payload) => {
            this.setVolume(payload.audioVolume);
        });

        EventEmitter.emit('system-media-control-audio-volume-changed', { audioVolume: this.audioVolume });
    }

    setVolumeStep(value = DEFAULT_VOLUME_STEP) {
        this.audioVolumeStep = typeof value === 'number'
            ? value
            : DEFAULT_VOLUME_STEP;
        EventEmitter.emit('system-media-control-audio-volume-step-changed', { audioVolumeStep: this.audioVolumeStep });
    }

    setVolume(value = DEFAULT_AUDIO_VOLUME) {
        this.audioVolume = typeof value === 'number'
            ? normalizeAudioVolumeValue(value)
            : DEFAULT_AUDIO_VOLUME;
        EventEmitter.emit('system-media-control-audio-volume-changed', { audioVolume: this.audioVolume });
    }

    volumeUp(value) {
        const volumeStep = typeof value === 'number'
            ? normalizeAudioVolumeValue(value)
            : this.audioVolumeStep;
        this.setVolume(this.audioVolume + volumeStep);
    }

    volumeDown(value) {
        const volumeStep = typeof value === 'number'
            ? normalizeAudioVolumeValue(value)
            : this.audioVolumeStep;
        this.setVolume(this.audioVolume - volumeStep);
    }

}

export default SystemMediaControl;