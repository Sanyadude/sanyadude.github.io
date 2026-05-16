import { CALC_SUITE } from './suites/calc-suite.js'
import { ECHO_SUITE } from './suites/echo-suite.js'
import { COWSAY_SUITE } from './suites/cowsay-suite.js'
import { FIGLET_SUITE } from './suites/figlet-suite.js'
import { TOILET_SUITE } from './suites/toilet-suite.js'
import { DATE_SUITE } from './suites/date-suite.js'

/**
 * Test suites
 * @type {Object<string, object>}
 */
export const TEST_SUITES = Object.freeze({
    calc: CALC_SUITE,
    echo: ECHO_SUITE,
    cowsay: COWSAY_SUITE,
    figlet: FIGLET_SUITE,
    toilet: TOILET_SUITE,
    date: DATE_SUITE,
});

export default TEST_SUITES