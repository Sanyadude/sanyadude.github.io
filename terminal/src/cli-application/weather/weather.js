import { Application } from '../../system/application/application.js'
import { WEATHER_MANIFEST } from './weather-manifest.js'

const WEATHER_API_URL = 'https://wttr.in';

/**
 * Weather - Application for displaying weather information by using the wttr.in API
 * @extends {Application}
 */
export class Weather extends Application {
    /**
     * Creates a new Weather instance
     */
    constructor() {
        super('weather', WEATHER_MANIFEST);
    }

    /**
     * Executes the `weather` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {string} - The result of the weather command execution
     */
    async main(commandLine) {
        const options = commandLine.getOptions();
        let url = WEATHER_API_URL + '/?';
        const info = options['info'];
        url += info && ['0','1','2'].includes(info.toString()) ? `${info}` : '1';
        url += options['color-off'] ? 'T' : '';
        url += options['narrow'] ? 'n' : '';
        url += options['quiet'] ? 'q' : '';
        url += options['metric'] ? 'm' : '';
        url += options['imperial'] ? 'u' : '';
        url += 'AF';
        const request = await fetch(url);
        if (!request.ok) {
            throw new Error(`Response status: ${request.status}`);
        }
        const result = await request.text();
        return result;
    }
}

export default Weather