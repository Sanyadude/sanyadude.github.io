import { ShellProgramCommand } from './shell-program-command.js'
import { ShellProgramOption } from './shell-program-option.js'
import { ShellProgramArgument } from './shell-program-argument.js'

/**
 * ShellProgram - Represents a Shell program
 */
export class ShellProgram {
    /**
     * Creates a new Shell program
     * @param {string} name - The name of the program
     */
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Program name must be a non-empty string');
        }
        this._name = name;
        this._description = '';
        this._version = '';

        this._helpText = null;

        this._options = new Map();
        this._commands = new Map();
        this._arguments = new Map();
    }

    /**
     * Returns the registered options
     * @returns {Map<string, ShellProgramOption>} - The options keyed by name
     */
    getOptions() {
        return this._options;
    }

    /**
     * Returns the registered commands
     * @returns {Map<string, ShellProgramCommand>} - The commands keyed by name
     */
    getCommands() {
        return this._commands;
    }

    /**
     * Returns the registered arguments
     * @returns {Map<string, ShellProgramArgument>} - The arguments keyed by name
     */
    getArguments() {
        return this._arguments;
    }

    /**
     * Returns the name of the program
     * @returns {string} - The name of the program
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the description of the program
     * @returns {string} - The description of the program
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns the version of the program
     * @returns {string} - The version of the program
     */
    getVersion() {
        return this._version;
    }

    /**
     * Sets the description of the program
     * @param {string} text - The description of the program
     * @returns {ShellProgram} - The program instance
     */
    setDescription(text) {
        this._description = text || '';
        return this;
    }

    /**
     * Sets the version of the program
     * @param {string} version - The version of the program
     * @returns {ShellProgram} - The program instance
     */
    setVersion(version) {
        this._version = version || '';
        return this;
    }

    /**
     * Sets the help text of the program
     * @param {string} text - The help text of the program
     * @returns {ShellProgram} - The program instance
     */
    setHelpText(text) {
        this._helpText = text || '';
        return this;
    }

    /**
     * Returns the help text of the program
     * @returns {string} - The help text of the program
     */
    getHelpText() {
        return this._helpText;
    }

    /**
     * Adds an option to the program
     * @param {string} definition - The definition of the option
     * @param {string} description - The description of the option
     * @param {string} defaultValue - The default value of the option
     * @returns {ShellProgram} - The program instance
     */
    addOption(definition, description = '', defaultValue = null) {
        const option = new ShellProgramOption(definition, description, defaultValue);
        this._options.set(option.getName(), option);
        return this;
    }

    /**
     * Adds a command to the program
     * @param {string} definition - The definition of the command
     * @param {string} description - The description of the command
     * @returns {ShellProgram} - The program instance
     */
    addCommand(definition, description = '') {
        const command = new ShellProgramCommand(definition, description);
        this._commands.set(command.getName(), command);
        return this;
    }

    /**
     * Adds an argument to the program
     * @param {string} definition - The definition of the argument
     * @param {string} description - The description of the argument
     * @returns {ShellProgram} - The program instance
     */
    addArgument(definition, description = '') {
        const argument = new ShellProgramArgument(definition, description);
        this._arguments.set(argument.getName(), argument);
        return this;
    }
}

export default ShellProgram