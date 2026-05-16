export const WEATHER_MANIFEST = {
    name: 'weather',
    version: '0.1.0',
    description: 'Shows the weather information',
    type: 'cli',
    programs: [{
        name: 'weather',
        options: [
            {
                name: '-i, --info <info_type>',
                description: 'Show basic information (0: only current weather, 1: current weather + today\'s forecast, 2: current weather + today\'s + tomorrow\'s forecast)',
                defaultValue: 1
            },
            {
                name: '-n, --narrow',
                description: 'Show narrow version (only day and night)',
            },
            {
                name: '-q, --quiet',
                description: 'Show quiet version (no "Weather report" text)',
            },
            {
                name: '-m, --metric',
                description: 'Show metric units (Celsius and km/h)',
            },
            {
                name: '-u, --imperial',
                description: 'Show imperial units (Fahrenheit and mph)',
            },
            {
                name: '-f, --color-off',
                description: 'Switch terminal sequences off (no colors)',
            },
        ],
    }]
}

export default WEATHER_MANIFEST
