import { ShellProgramCommand } from './shell-program-command.js'
import { ShellProgramOption } from './shell-program-option.js'
import { ShellProgramArgument } from './shell-program-argument.js'
import { ShellCommandLine } from './shell-command-line.js'

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
        this._handler = null;
        this._description = '';
        this._version = '';

        this._useDefaultHelp = true;
        this._helpText = null;

        this._options = new Map();
        this._commands = new Map();
        this._arguments = new Map();
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
     * Returns a string representation of the program's help
     * @returns {string} - A string representation of the program's help
     */
    getHelp() {
        if (!this._useDefaultHelp) return this._helpText;

        const hasCommands = this._commands.size > 0;
        const hasOptions = this._options.size > 0;
        const hasArguments = this._arguments.size > 0;

        const commandsList = Array.from(this._commands.values()).map(command => command.toString()).join('|');
        const optionsList = Array.from(this._options.values()).map(option => option.toString()).join('|');
        const argumentsList = Array.from(this._arguments.values()).map(argument => argument.toString()).join('|');

        const name = `Usage:\n ${this._name}${hasCommands ? ` [${commandsList}]` : ''}${hasOptions ? ` [${optionsList}]` : ''}${hasOptions && hasArguments ? ' [--]' : ''}${hasArguments ? ` ${argumentsList}` : ''}`;
        const description = this._description ? `\n\nDescription:\n ${this._description}` : '';
        const version = this._version ? `\n\nVersion:\n ${this._version}` : '';

        const leftPartNames = [];
        this._commands.values().forEach(command => leftPartNames.push(command.toString()));
        this._options.values().forEach(option => leftPartNames.push(option.getVerboseName()));
        this._arguments.values().forEach(argument => leftPartNames.push(argument.toString()));
        const leftPartNameMaxLength = Math.max(...leftPartNames.map(name => name.length));
        let commands = '';
        if (hasCommands) {
            commands += `\n\nCommands:`;
            for (const command of this._commands.values()) {
                commands += `\n ${command.toString().padEnd(leftPartNameMaxLength)}${command.getDescription() ? ` - ${command.getDescription()}${command.isOptional() ? ' [optional]' : ''}` : ''}`;
            }
        }
        let options = '';
        if (hasOptions) {
            options += `\n\nOptions:`;
            for (const option of this._options.values()) {
                options += `\n ${option.getVerboseName().padEnd(leftPartNameMaxLength)}${option.getDescription() ? ` - ${option.getVerboseDescription()}` : ''}`;
            }
        }
        let args = '';
        if (hasArguments) {
            args += `\n\nArguments:`;
            for (const argument of this._arguments.values()) {
                args += `\n ${argument.toString().padEnd(leftPartNameMaxLength)}${argument.getDescription() ? ` - ${argument.getDescription()}${argument.isOptional() ? ' [optional]' : ''}` : ''}`;
            }
        }
        return `${name}${description}${version}${commands}${options}${args}`;
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
        this._useDefaultHelp = false;
        return this;
    }

    /**
     * Sets the action of the program
     * @param {function} handler - The action of the program
     * @returns {ShellProgram} - The program instance
     */
    setAction(handler) {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }
        this._handler = handler;
        return this;
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

    /**
     * Tokenizes a string into an array of tokens
     * @param {string} input - The string to tokenize
     * @returns {string[]} - The array of tokens
     */
    _tokenize(input) {
        const tokens = [];
        let current = '';
        let i = 0;
        let inSingle = false;
        let inDouble = false;
        while (i < input.length) {
            const char = input[i];
            // Handle escapes inside double quotes (\" becomes ", \\ becomes \, etc.)
            if (char === '\\' && inDouble) {
                const next = input[i + 1];
                if (next && ('"\\$`'.includes(next))) {
                    current += next;
                    i += 2;
                    continue;
                } else if (i + 1 >= input.length) {
                    current += '\\'; // trailing backslash at end of input
                    i++;
                    continue;
                }
                // If not a special escape, treat backslash literally
                current += '\\';
                i++;
                continue;
            }
            // Handle escapes inside single quotes - everything is literal
            if (char === '\\' && inSingle) {
                current += '\\';
                i++;
                continue;
            }
            // Handle escapes outside quotes - next character is literal
            if (char === '\\' && !inSingle && !inDouble) {
                if (i + 1 < input.length) {
                    current += input[i + 1];
                    i += 2;
                    continue;
                } else {
                    // lone trailing backslash - treat literally
                    current += '\\';
                    i++;
                    continue;
                }
            }
            // Handle single quotes (toggle mode, don't include quote in token)
            if (char === "'" && !inDouble) {
                inSingle = !inSingle;
                i++;
                continue;
            }
            // Handle double quotes (toggle mode, don't include quote in token)
            if (char === '"' && !inSingle) {
                inDouble = !inDouble;
                i++;
                continue;
            }
            // Handle whitespace splitting (only when not inside quotes)
            if (!inSingle && !inDouble && /\s/.test(char)) {
                if (current.length > 0) {
                    tokens.push(current);
                    current = '';
                }
                i++;
                continue;
            }
            // Normal character - add to current token
            current += char;
            i++;
        }
        // Push any remaining token
        if (current.length > 0) {
            tokens.push(current);
        }
        return tokens;
    }

    /**
     * Parses a command line into a ShellCommandLine object
     * @param {string} commandLine - The command line to parse
     * @returns {ShellCommandLine} - The parsed command line object
     */
    parse(commandLine) {
        if (!commandLine || typeof commandLine !== 'string') return new ShellCommandLine(commandLine);
        const tokens = this._tokenize(commandLine);
        if (tokens.length === 0) return new ShellCommandLine(commandLine);
        let currentIndex = 0;
        const programName = tokens[currentIndex];
        currentIndex++;
        let commandName = '';
        if (currentIndex < tokens.length && this._commands.has(tokens[currentIndex])) {
            commandName = tokens[currentIndex];
            currentIndex++;
        }
        const parsedOptions = {};
        const positionalArgs = [];
        while (currentIndex < tokens.length) {
            const currentArg = tokens[currentIndex];
            //handle -- separator everything after is positional arguments
            if (currentArg === '--') {
                positionalArgs.push(...tokens.slice(currentIndex + 1));
                break;
            }
            //handle non-option arguments
            if (currentArg.length <= 1 || !currentArg.startsWith('-') || !currentArg.match(/^-{1,2}[a-zA-Z]/)) {
                positionalArgs.push(currentArg);
                currentIndex++;
                continue;
            }
            //handle options
            const isLong = currentArg.startsWith('--');
            const optionArg = isLong ? currentArg.slice(2) : currentArg.slice(1);
            const [optionName, ...optionValues] = optionArg.split('=');
            const optionValue = optionValues.length > 0 ? optionValues.join('=') : null;
            const getOptionName = (name) => {
                const option = Array.from(this._options.values()).find(option => option.getShort() === name || option.getLong() === name);
                if (!option) return name;
                return option.getName();
            }
            const getOptionValue = (name) => {
                const option = Array.from(this._options.values()).find(option => option.getShort() === name || option.getLong() === name);
                if (!option) return optionValue || true;
                if (option.isFlag()) return true;
                if (optionValue) return optionValue;
                const nextArg = tokens[currentIndex + 1];
                const nextArgIsOption = nextArg && (/^-(?:[^\d]|-)/.test(nextArg) && nextArg.length > 1);
                if (!nextArg || nextArgIsOption) return option.getDefaultValue() || null;
                currentIndex++;
                return nextArg;
            }
            //handle long options or short one letter options
            if (isLong || optionName.length === 1) {
                parsedOptions[getOptionName(optionName)] = getOptionValue(optionName);
                currentIndex++;
                continue;
            }
            //handle short multi letter options (first set to true, last contains value if exists)
            if (!isLong && optionName.length > 1) {
                for (let charIndex = 0; charIndex < optionName.length - 1; charIndex++) {
                    parsedOptions[getOptionName(optionName[charIndex])] = true;
                }
                parsedOptions[getOptionName(optionName[optionName.length - 1])] = getOptionValue(optionName[optionName.length - 1]);
                currentIndex++;
                continue;
            }
            currentIndex++;
        }
        return new ShellCommandLine(commandLine)
            .setProgram(programName)
            .setSubcommand(commandName)
            .setOptions(parsedOptions)
            .setArguments(positionalArgs);
    }
}

export default ShellProgram