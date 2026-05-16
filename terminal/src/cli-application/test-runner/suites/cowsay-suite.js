import { COWS } from '../../cowsay/cows.js'

/**
 * Generates smoke tests for every cowsay and cowthink cow file.
 * Each test runs the command and passes if it produces any non-error output.
 * @returns {Array<{input: string}>}
 */
function generateTests() {
    const tests = [];
    for (const cow of Object.keys(COWS)) {
        tests.push({ input: `cowsay -f ${cow} test` });
    }
    return tests;
}

export const COWSAY_SUITE = {
    name: 'cowsay',
    description: 'Smoke test all cowsay/cowthink cow files',
    tests: generateTests()
}

export default COWSAY_SUITE
