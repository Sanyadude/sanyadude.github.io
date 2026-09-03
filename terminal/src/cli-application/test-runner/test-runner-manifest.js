export const TEST_RUNNER_MANIFEST = {
    name: 'test-runner',
    version: '0.1.0',
    description: 'Run test suites for terminal applications',
    type: 'cli',
    dependencies: ['shell'],
    programs: [{
        name: 'test',
        description: 'Runs test suites and reports results',
        commands: [
            { name: 'calc', description: 'Run calculator test suite' },
            { name: 'echo', description: 'Run echo test suite' },
            { name: 'date', description: 'Run date test suite' },
            { name: 'cowsay', description: 'Smoke test all cowsay/cowthink cow files' },
            { name: 'figlet', description: 'Smoke test all figlet fonts' },
            { name: 'toilet', description: 'Smoke test all toilet fonts' },
        ],
        options: [
            { name: 'list', short: 'l', long: 'list', description: 'List available test suites' },
            { name: 'all', short: 'a', long: 'all', description: 'Run all test suites' },
            { name: 'verbose', short: 'v', long: 'verbose', description: 'Show passing tests as well as failures' },
        ]
    }]
}

export default TEST_RUNNER_MANIFEST
