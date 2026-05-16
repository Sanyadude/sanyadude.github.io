/**
 * ShellCommandLine - Represents a command line for a Shell program
 */
export class ShellCommandLine {
    /**
     * Creates a new Shell command line
     * @param {string} commandLine - The command line
     */
    constructor(commandLine = '') {
        this._raw = commandLine;
        this._stdin = '';

        this._program = '';
        this._subcommand = '';
        this._options = {};
        this._arguments = [];
    }

    /**
     * Gets the raw command line
     * @returns {string} - The raw command line
     */
    getRaw() {
        return this._raw;
    }

    /**
     * Gets the stdin
     * @returns {string} - The stdin
     */
    getStdin() {
        return this._stdin;
    }

    /**
     * Gets the program name
     * @returns {string} - The program name
     */
    getProgram() {
        return this._program;
    }

    /**
     * Gets the command name
     * @returns {string} - The command name
     */
    getSubcommand() {
        return this._subcommand;
    }

    /**
     * Gets the options
     * @returns {object} - The options
     */
    getOptions() {
        return this._options;
    }

    /**
     * Gets the arguments
     * @returns {string[]} - The arguments
     */
    getArguments() {
        return this._arguments;
    }

    /**
     * Sets the stdin
     * @param {string} stdin - The stdin
     * @returns {ShellCommandLine} - The Shell command line
     */
    setStdin(stdin) {
        this._stdin = stdin;
        return this;
    }

    /**
     * Sets the program name
     * @param {string} programName - The program name
     * @returns {ShellCommandLine} - The Shell command line
     */
    setProgram(programName) {
        this._program = programName || '';
        return this;
    }

    /**
     * Sets the command name
     * @param {string} commandName - The command name
     * @returns {ShellCommandLine} - The Shell command line
     */
    setSubcommand(commandName) {
        this._subcommand = commandName || '';
        return this;
    }

    /**
     * Sets the options
     * @param {object} options - The options
     * @returns {ShellCommandLine} - The Shell command line
     */
    setOptions(options = {}) {
        this._options = { ...this._options, ...options };
        return this;
    }

    /**
     * Sets the arguments
     * @param {string[]} args - The arguments
     * @returns {ShellCommandLine} - The Shell command line
     */
    setArguments(args = []) {
        this._arguments = [...this._arguments, ...args];
        return this;
    }
}

export default ShellCommandLine