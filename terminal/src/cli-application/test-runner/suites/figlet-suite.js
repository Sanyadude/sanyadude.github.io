import { FONTS } from '../../figlet/fonts.js'

/**
 * Generates smoke tests for every figlet font.
 * Each test runs the command and passes if it produces any non-error output.
 * @returns {Array<{input: string}>}
 */
function generateTests() {
    const tests = [];
    for (const font of Object.keys(FONTS)) {
        tests.push({ input: `figlet -f ${font} test` });
    }
    return tests;
}

export const FIGLET_SUITE = {
    name: 'figlet',
    description: 'Smoke test all figlet fonts',
    tests: generateTests()
}

export default FIGLET_SUITE
