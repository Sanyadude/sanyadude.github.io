import { FONTS } from '../../figlet/fonts.js'

/**
 * Generates smoke tests for every toilet font.
 * Each test runs the command and passes if it produces any non-error output.
 * @returns {Array<{input: string}>}
 */
function generateTests() {
    const tests = [];
    for (const font of Object.keys(FONTS)) {
        tests.push({ input: `toilet -f ${font} test` });
    }
    return tests;
}

export const TOILET_SUITE = {
    name: 'toilet',
    description: 'Smoke test all toilet fonts',
    tests: generateTests()
}

export default TOILET_SUITE
