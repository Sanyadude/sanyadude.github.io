const getNavigatorAudioOutputDevice = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            reject(new Error('Media devices API not available'));
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                stream.getTracks().forEach(track => track.stop());
                return navigator.mediaDevices.enumerateDevices();
            })
            .then(devices => {
                const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
                if (audioOutputDevices.length === 0) {
                    reject(new Error('No audio output devices found'));
                    return;
                }
                const defaultDevice = audioOutputDevices[audioOutputDevices.length - 1];
                if (!defaultDevice || !defaultDevice.label) {
                    reject(new Error('Default device has no label'));
                    return;
                }
                resolve(defaultDevice);
            })
            .catch(reject);
    });
}

/**
 * SystemMediaControl - A class for managing the system media control
 */
export class SystemMediaControl {
    static get MIN_AUDIO_VOLUME() { return 0; }
    static get MAX_AUDIO_VOLUME() { return 100; }
    static get DEFAULT_AUDIO_VOLUME() { return SystemMediaControl.MAX_AUDIO_VOLUME; }
    static get DEFAULT_VOLUME_STEP() { return 1; }
    static get DEFAULT_OUTPUT_DEVICE_NAME() { return 'Audio Output Device'; }

    /**
     * Creates a new SystemMediaControl instance
     */
    constructor() {
        this.audioVolumeStep = SystemMediaControl.DEFAULT_VOLUME_STEP;
        this.audioVolume = SystemMediaControl.DEFAULT_AUDIO_VOLUME;

        this.userAllowedAudioDevices = false;
        this.audioOutputDeviceName = '';

        this._init();
    }
    
    /**
     * Normalizes the audio volume value
     * @param {number} value - The value to normalize
     * @returns {number} The normalized value
     */
    static normalizeAudioVolumeValue(value) {
        return Math.min(Math.max(Math.round(value), SystemMediaControl.MIN_AUDIO_VOLUME), SystemMediaControl.MAX_AUDIO_VOLUME);
    }

    /**
     * Initializes the SystemMediaControl instance
     */
    _init() {
        this.setVolumeStep(SystemMediaControl.DEFAULT_VOLUME_STEP);
        this.setVolume(SystemMediaControl.DEFAULT_AUDIO_VOLUME);
        this.setAudioDevice(SystemMediaControl.DEFAULT_OUTPUT_DEVICE_NAME);

        getNavigatorAudioOutputDevice()
            .then(device => {
                this.userAllowedAudioDevices = true;
                this.setAudioDevice(device.label);
            })
            .catch((error) => {
                this.userAllowedAudioDevices = false;
            });
    }

    /**
     * Sets the audio device name
     * @param {string} name - The name of the audio device
     */
    setAudioDevice(name) {
        this.audioOutputDeviceName = name;
    }

    /**
     * Sets the audio volume step
     * @param {number} value - The value of the audio volume step
     */
    setVolumeStep(value = SystemMediaControl.DEFAULT_VOLUME_STEP) {
        this.audioVolumeStep = typeof value === 'number'
            ? value
            : SystemMediaControl.DEFAULT_VOLUME_STEP;
    }

    /**
     * Sets the audio volume
     * @param {number} value - The value of the audio volume
     */
    setVolume(value = SystemMediaControl.DEFAULT_AUDIO_VOLUME) {
        this.audioVolume = typeof value === 'number'
            ? SystemMediaControl.normalizeAudioVolumeValue(value)
            : SystemMediaControl.DEFAULT_AUDIO_VOLUME;
    }

    /**
     * Increases the audio volume
     * @param {number} value - The value of the audio volume step
     */
    volumeUp(value) {
        const volumeStep = typeof value === 'number'
            ? SystemMediaControl.normalizeAudioVolumeValue(value)
            : this.audioVolumeStep;
        this.setVolume(this.audioVolume + volumeStep);
    }

    /**
     * Decreases the audio volume
     * @param {number} value - The value of the audio volume step
     */
    volumeDown(value) {
        const volumeStep = typeof value === 'number'
            ? SystemMediaControl.normalizeAudioVolumeValue(value)
            : this.audioVolumeStep;
        this.setVolume(this.audioVolume - volumeStep);
    }

}

export default SystemMediaControl;