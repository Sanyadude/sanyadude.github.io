import { createBrowserAPIFactory } from './browser-api.js'
import { createEventEmitterFactory } from './event-emitter.js'

const browserAPIFactory = createBrowserAPIFactory();
export const BrowserAPI = browserAPIFactory.browserAPI();

const eventEmitterFactory = createEventEmitterFactory();
export const EventEmitter = eventEmitterFactory.eventEmitter();

export const Core = {
    BrowserAPI,
    EventEmitter
}

export default Core