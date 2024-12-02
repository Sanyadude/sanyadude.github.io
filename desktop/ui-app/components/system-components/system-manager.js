import SystemNetwork from './system-network.js'
import SystemLanguage from './system-language.js'
import SystemMediaControl from './system-media-control.js'
import SystemTime from './system-time.js'

export class SystemManager {
    constructor() {
        this.systemNetwork = new SystemNetwork();
        this.systemLanguage = new SystemLanguage();
        this.systemMediaControl = new SystemMediaControl();
        this.systemTime = new SystemTime();
    }
}

export default SystemManager