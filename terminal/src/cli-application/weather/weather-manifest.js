export const WEATHER_MANIFEST = {
    name: 'weather',
    version: '0.1.0',
    description: 'Shows the weather information',
    type: 'cli',
    programs: [{
        name: 'weather',
        options: [
            {
                name: 'info', short: 'i', long: 'info', value: { name: 'info_type', required: true },
                description: 'Show basic information (0: only current weather, 1: current weather + today\'s forecast, 2: current weather + today\'s + tomorrow\'s forecast)',
                defaultValue: 1
            },
            {
                name: 'narrow', short: 'n', long: 'narrow',
                description: 'Show narrow version (only day and night)',
            },
            {
                name: 'quiet', short: 'q', long: 'quiet',
                description: 'Show quiet version (no "Weather report" text)',
            },
            {
                name: 'metric', short: 'm', long: 'metric',
                description: 'Show metric units (Celsius and km/h)',
            },
            {
                name: 'imperial', short: 'u', long: 'imperial',
                description: 'Show imperial units (Fahrenheit and mph)',
            },
            {
                name: 'color-off', short: 'f', long: 'color-off',
                description: 'Switch terminal sequences off (no colors)',
            },
        ],
    }]
}

export default WEATHER_MANIFEST