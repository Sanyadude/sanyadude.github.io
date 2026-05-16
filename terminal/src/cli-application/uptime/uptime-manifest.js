export const UPTIME_MANIFEST = {
    name: 'uptime',
    version: '0.1.0',
    description: 'Prints the current user name',
    type: 'cli',
    dependencies: ['systemTime'],
    programs: [{
        name: 'uptime',
        description: 'Prints the current uptime of the system',
        options: [
            {
                name: '-p, --pretty',
                description: 'Shows uptime in pretty format'
            },
            {
                name: '-r, --raw',
                description: 'Displays the uptime in raw format (seconds)'
            },
            {
                name: '-s, --since',
                description: 'System up since, in yyyy-mm-dd HH:MM:SS format'
            }
        ],
    }]
}

export default UPTIME_MANIFEST