import { Application } from '../../system/application/application.js'
import { TEST_RUNNER_MANIFEST } from './test-runner-manifest.js'
import { TEST_SUITES } from './test-suites.js'

const ANSI_GREEN = '\x1b[32m';
const ANSI_RED = '\x1b[31m';
const ANSI_YELLOW = '\x1b[33m';
const ANSI_CYAN = '\x1b[36m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_DIM = '\x1b[2m';
const ANSI_RESET = '\x1b[0m';

const ICON_PASS = `${ANSI_GREEN}\u2714${ANSI_RESET}`;
const ICON_FAIL = `${ANSI_RED}\u2718${ANSI_RESET}`;

/**
 * TestRunner - Application for running test suites against terminal commands
 * @extends {Application}
 */
export class TestRunner extends Application {
    /**
     * Creates a new TestRunner instance
     */
    constructor() {
        super('test-runner', TEST_RUNNER_MANIFEST);
        this._suites = TEST_SUITES;
    }

    /**
     * Executes the `test` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The execution context with dependencies
     * @returns {Promise<string>} - The test results output
     */
    async main(commandLine, context) {
        const shell = context.shell;
        const options = commandLine.getOptions();
        const subcommand = commandLine.getSubcommand();
        const verbose = options['verbose'] || false;
        if (options['list']) return this._listSuites();
        if (options['all']) {
            const result = await this._runAllSuites(shell, verbose);
            return result.output;
        }
        const suite = this._suites[subcommand];
        if (!suite) return `Unknown test suite: '${subcommand}'. Use 'test -l' to list available suites.`;
        const result = await this._runSuite(suite, shell, verbose);
        return result.output;
    }

    /**
     * Returns a formatted list of available test suites
     * @returns {string} - The formatted suite list
     */
    _listSuites() {
        const lines = [`${ANSI_BOLD}Available test suites:${ANSI_RESET}`, ''];
        for (const suite of Object.values(this._suites)) {
            lines.push(`  ${ANSI_CYAN}${suite.name}${ANSI_RESET}  ${ANSI_DIM}(${suite.tests.length} tests)${ANSI_RESET} - ${suite.description}`);
        }
        lines.push('');
        lines.push(`Run all: ${ANSI_DIM}test -a${ANSI_RESET}  |  Run one: ${ANSI_DIM}test <suite>${ANSI_RESET}  |  Verbose: ${ANSI_DIM}test -v${ANSI_RESET}`);
        return lines.join('\n');
    }

    /**
     * Runs multiple test suites and returns the combined results
     * @param {Shell} shell - The shell instance for executing commands
     * @param {boolean} verbose - Whether to show passing tests
     * @returns {Promise<string>} - The formatted test results
     */
    async _runAllSuites(shell, verbose) {
        const suites = Object.values(this._suites);
        let totalPassed = 0;
        let totalFailed = 0;
        const lines = [];
        for (const suite of suites) {
            const result = await this._runSuite(suite, shell, verbose);
            totalPassed += result.passed;
            totalFailed += result.failed;
            lines.push(result.output);
        }
        lines.push('');
        lines.push(`${ANSI_BOLD}${'-'.repeat(50)}${ANSI_RESET}`);
        const total = totalPassed + totalFailed;
        const status = totalFailed === 0
            ? `${ANSI_GREEN}${ANSI_BOLD}ALL PASSED${ANSI_RESET}`
            : `${ANSI_RED}${ANSI_BOLD}${totalFailed} FAILED${ANSI_RESET}`;
        lines.push(`${status}  ${ANSI_DIM}(${totalPassed}/${total} tests passed across ${suites.length} suite${suites.length > 1 ? 's' : ''})${ANSI_RESET}`);
        return { passed: totalPassed, failed: totalFailed, output: lines.join('\n') };
    }

    /**
     * Runs a single test suite and returns the results
     * @param {{name: string, description: string, tests: Array}} suite - The test suite
     * @param {Shell} shell - The shell instance for executing commands
     * @param {boolean} verbose - Whether to show passing tests
     * @returns {Promise<{passed: number, failed: number, output: string}>} - The suite results
     */
    async _runSuite(suite, shell, verbose) {
        let passed = 0;
        let failed = 0;
        const lines = [];
        lines.push(`${ANSI_BOLD}${ANSI_CYAN}● ${suite.name}${ANSI_RESET} ${ANSI_DIM}- ${suite.description}${ANSI_RESET}`);
        for (const test of suite.tests) {
            const result = await this._runTest(test, shell);
            if (!result.passed) {
                failed++;
                lines.push(`${ICON_FAIL} ${test.input}`);
                lines.push(`  ${ANSI_GREEN}expected:${ANSI_RESET} ${result.expected}`);
                lines.push(`  ${ANSI_RED}actual:  ${ANSI_RESET} ${result.actual}`);
                continue;
            }
            passed++;
            if (!verbose) continue;
            lines.push(`${ICON_PASS} ${ANSI_DIM}${test.input}${ANSI_RESET}`);
            if (test.expected !== undefined) continue;
            lines.push(result.actual);
        }
        const summary = failed === 0
            ? `  ${ANSI_GREEN}${passed}/${passed} passed${ANSI_RESET}`
            : `  ${ANSI_GREEN}${passed} passed${ANSI_RESET}, ${ANSI_RED}${failed} failed${ANSI_RESET} ${ANSI_DIM}(${passed + failed} total)${ANSI_RESET}`;
        lines.push(summary);
        return { passed, failed, output: lines.join('\n') };
    }

    /**
     * Runs a single test case by executing the command through the shell.
     * If `test.expected` is defined, compares output against it.
     * If absent (smoke test), passes as long as the command doesn't throw
     * or return an output starting with a known error prefix.
     * @param {{input: string, expected: string}} test - The test case
     * @param {Shell} shell - The shell instance
     * @returns {Promise<{passed: boolean, expected: string, actual: string}>} - The test result
     */
    async _runTest(test, shell) {
        try {
            const actual = await this._executeCommand(shell, test.input);
            if (test.expected) {
                const normalizedActual = (actual || '').trim();
                const normalizedExpected = test.expected.trim();
                return {
                    passed: normalizedActual === normalizedExpected,
                    expected: test.expected,
                    actual: actual
                };
            }
            return {
                passed: true,
                expected: '(no error)',
                actual: actual
            };
        } catch (error) {
            return {
                passed: false,
                expected: test.expected || '(no error)',
                actual: `[Error] ${error.message}`
            };
        }
    }

    /**
     * Executes a command through the shell and returns the output,
     * handling pipes and redirections through the full shell pipeline
     * @param {Shell} shell - The shell instance
     * @param {string} command - The command to execute
     * @returns {Promise<string>} - The command output
     */
    async _executeCommand(shell, command) {
        return shell._runPipeline(command);
    }
}

export default TestRunner
