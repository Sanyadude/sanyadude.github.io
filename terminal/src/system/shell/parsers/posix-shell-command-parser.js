import { ShellCommandParser } from '../shell-command-parser.js'
import { ShellCommandLine } from '../shell-command-line.js'

/**
 * PosixShellCommandParser - Parses command lines using POSIX/GNU (Unix/Linux) syntax
 *
 * Supported syntax:
 *  - short options: -v
 *  - bundled short options: -abc (flags bundled together)
 *  - attached short values: -n5, -ofile (a value option consumes the rest of the token)
 *  - long options: --verbose
 *  - inline values: --output=file, -o=file
 *  - separated values: --output file, -o file
 *  - the -- separator (everything after is positional)
 *  - subcommands before or after options (first matching registered command)
 *  - single/double quotes and backslash escapes (see tokenize)
 */
export class PosixShellCommandParser extends ShellCommandParser {
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
        // Tracks whether the current token contained a quote, so empty quoted
        // arguments ("" or '') still produce a token instead of being dropped
        let hasToken = false;
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
                hasToken = true;
                i++;
                continue;
            }
            // Handle double quotes (toggle mode, don't include quote in token)
            if (char === '"' && !inSingle) {
                inDouble = !inDouble;
                hasToken = true;
                i++;
                continue;
            }
            // Handle whitespace splitting (only when not inside quotes)
            if (!inSingle && !inDouble && /\s/.test(char)) {
                if (current.length > 0 || hasToken) {
                    tokens.push(current);
                    current = '';
                    hasToken = false;
                }
                i++;
                continue;
            }
            // Normal character - add to current token
            current += char;
            hasToken = true;
            i++;
        }
        // Push any remaining token
        if (current.length > 0 || hasToken) {
            tokens.push(current);
        }
        return tokens;
    }

    /**
     * Checks whether a token looks like an option (e.g. -v, --verbose)
     * @param {string} token - The token to test
     * @param {ShellProgramOption[]} options - The options to test against
     * @returns {boolean} - True if the token looks like an option
     */
    _isOptionToken(token, options) {
        if (typeof token !== 'string' || !token || token === '-') return false;
        if (token === '--') return true;
        const getOption = (name) => {
            return options.find(option => option.getShort() === name || option.getLong() === name);
        }
        if (token.startsWith('--')) {
            const optionArg = token.slice(2);
            const optionName = optionArg.split('=', 1)[0];
            return !!getOption(optionName);
        }
        if (!token.startsWith('-') || token.length < 2) return false;
        const optionArg = token.slice(1);
        const optionName = optionArg.split('=', 1)[0];
        if (optionName.length === 1 && getOption(optionName)) return true;
        const isOption = !!getOption(optionArg[0]);
        return isOption;
    }

    /**
     * Parses a command line into a ShellCommandLine object
     * @param {ShellProgram} program - The program whose options/commands define the grammar
     * @param {string} commandLine - The command line to parse
     * @returns {ShellCommandLine} - The parsed command line object
     */
    parse(program, commandLine) {
        if (!commandLine || typeof commandLine !== 'string') return new ShellCommandLine(commandLine);
        const tokens = this._tokenize(commandLine);
        if (tokens.length === 0) return new ShellCommandLine(commandLine);
        const commands = program.getCommands();
        const options = program.getOptions();
        const optionsArray = Array.from(options.values());
        let currentIndex = 0;
        const programName = tokens[currentIndex];
        currentIndex++;
        let commandName = '';
        const parsedOptions = {};
        const positionalArgs = [];
        const getOption = (name) => {
            const option = optionsArray.find(option => option.getShort() === name || option.getLong() === name);
            if (!option) return null;
            return option;
        }
        const setOption = (option, value) => {
            if (!option) return;
            parsedOptions[option.getName()] = value;
        }
        while (currentIndex < tokens.length) {
            const currentArg = tokens[currentIndex];
            //handle -- separator everything after is positional arguments
            if (currentArg === '--') {
                positionalArgs.push(...tokens.slice(currentIndex + 1));
                break;
            }
            //handle non-option arguments (first matching registered command becomes the subcommand)
            if (!this._isOptionToken(currentArg, optionsArray)) {
                if (!commandName && commands.has(currentArg)) {
                    commandName = currentArg;
                } else {
                    positionalArgs.push(currentArg);
                }
                currentIndex++;
                continue;
            }
            //handle options
            const isLong = currentArg.startsWith('--');
            const optionArg = isLong ? currentArg.slice(2) : currentArg.slice(1);
            const [optionName, ...optionValues] = optionArg.split('=');
            const optionValue = optionValues.length > 0 ? optionValues.join('=') : null;
            const getOptionValue = (name) => {
                const option = getOption(name);
                if (!option) return optionValue || true;
                if (option.isFlag()) return true;
                if (optionValue) return optionValue;
                const nextArg = tokens[currentIndex + 1];
                const nextArgConsumable = nextArg && !this._isOptionToken(nextArg, optionsArray);
                if (!nextArgConsumable) return option.hasDefault() ? option.getDefaultValue() : null;
                currentIndex++;
                return nextArg;
            }
            //handle long options or short one letter options
            if (isLong || optionName.length === 1) {
                setOption(getOption(optionName), getOptionValue(optionName));
                currentIndex++;
                continue;
            }
            //handle short multi letter options (flags bundled together, a value option consumes the rest of the token)
            if (!isLong && optionName.length > 1) {
                for (let charIndex = 0; charIndex < optionName.length; charIndex++) {
                    const name = optionName[charIndex];
                    const option = getOption(name);
                    const rest = optionName.slice(charIndex + 1);
                    //a value-taking option takes the remainder of the token as its value (e.g. -n5 -> n=5)
                    if (option && !option.isFlag() && rest.length > 0) {
                        const attached = optionValue !== null
                            ? `${rest}=${optionValue}`
                            : rest;
                        setOption(option, attached);
                        break;
                    }
                    //the last character may still take a value via =value, the next token, or its default
                    if (charIndex === optionName.length - 1) {
                        setOption(option, getOptionValue(name));
                        break;
                    }
                    //otherwise treat it as a flag
                    setOption(option, true);
                }
                currentIndex++;
                continue;
            }
        }
        return new ShellCommandLine(commandLine)
            .setProgram(programName)
            .setSubcommand(commandName)
            .setOptions(parsedOptions)
            .setArguments(positionalArgs);
    }

    /**
     * Formats a command for help usage/listing
     * @param {ShellProgramCommand} command - The command to format
     * @returns {string} - The formatted command string
     */
    _formatCommand(command) {
        return command.isRequired() ? command.getName() : `[${command.getName()}]`;
    }

    /**
     * Formats an option for help listing (verbose name with value placeholder)
     * @param {ShellProgramOption} option - The option to format
     * @returns {string} - The formatted option name
     */
    _formatOptionName(option) {
        const parts = [];
        if (option.getShort() && option.getLong()) {
            parts.push(`-${option.getShort()}, --${option.getLong()}`);
        } else if (option.getShort()) {
            parts.push(`-${option.getShort()}`);
        } else if (option.getLong()) {
            parts.push(`--${option.getLong()}`);
        }
        if (option.getValueName()) {
            parts.push(option.isValueRequired() ? `<${option.getValueName()}>` : `[<${option.getValueName()}>]`);
        }
        return parts.join(' ');
    }

    /**
     * Formats an option description for help listing
     * @param {ShellProgramOption} option - The option to format
     * @returns {string} - The formatted option description
     */
    _formatOptionDescription(option) {
        return `${option.getDescription()}${option.hasDefault() ? ` [default: ${option.getDefaultValue()}]` : ''}`;
    }

    /**
     * Formats an argument for help usage/listing
     * @param {ShellProgramArgument} argument - The argument to format
     * @returns {string} - The formatted argument string
     */
    _formatArgument(argument) {
        const name = argument.isRepeatable() ? `${argument.getName()}...` : argument.getName();
        const formatted = argument.isRequired() ? `<${name}>` : `[<${name}>]`;
        return formatted;
    }

    /**
     * Returns a string representation of the program's help
     * @param {ShellProgram} program - The program whose options/commands define the grammar
     * @returns {string} - A string representation of the program's help
     */
    getHelp(program) {
        const programCommands = program.getCommands();
        const programOptions = program.getOptions();
        const programArguments = program.getArguments();

        const hasCommands = programCommands.size > 0;
        const hasOptions = programOptions.size > 0;
        const hasArguments = programArguments.size > 0;

        const argumentsList = Array.from(programArguments.values()).map(argument => this._formatArgument(argument).toUpperCase()).join(' ');
        const usageParts = [program.getName()];
        if (hasCommands) usageParts.push('[COMMAND]');
        if (hasOptions) usageParts.push('[OPTION...]');
        if (hasOptions && hasArguments) usageParts.push('[--]');
        if (hasArguments) usageParts.push(argumentsList);
        const name = `Usage:\n ${usageParts.join(' ')}`;
        const description = program.getDescription() ? `\n\nDescription:\n ${program.getDescription()}` : '';
        const version = program.getVersion() ? `\n\nVersion:\n ${program.getVersion()}` : '';

        const leftPartNames = [];
        programCommands.values().forEach(command => leftPartNames.push(this._formatCommand(command)));
        programOptions.values().forEach(option => leftPartNames.push(this._formatOptionName(option)));
        programArguments.values().forEach(argument => leftPartNames.push(this._formatArgument(argument)));
        const leftPartNameMaxLength = Math.max(0, ...leftPartNames.map(name => name.length));
        let commandsHelp = '';
        if (hasCommands) {
            commandsHelp += `\n\nCommands:`;
            for (const programCommand of programCommands.values()) {
                commandsHelp += `\n ${this._formatCommand(programCommand).padEnd(leftPartNameMaxLength)}${programCommand.getDescription() ? ` - ${programCommand.getDescription()}${programCommand.isRequired() ? '' : ' [optional]'}` : ''}`;
            }
        }
        let optionsHelp = '';
        if (hasOptions) {
            optionsHelp += `\n\nOptions:`;
            for (const programOption of programOptions.values()) {
                optionsHelp += `\n ${this._formatOptionName(programOption).padEnd(leftPartNameMaxLength)}${programOption.getDescription() ? ` - ${this._formatOptionDescription(programOption)}` : ''}`;
            }
        }
        let argsHelp = '';
        if (hasArguments) {
            argsHelp += `\n\nArguments:`;
            for (const programArgument of programArguments.values()) {
                argsHelp += `\n ${this._formatArgument(programArgument).padEnd(leftPartNameMaxLength)}${programArgument.getDescription() ? ` - ${programArgument.getDescription()}${programArgument.isRequired() ? '' : ' [optional]'}` : ''}`;
            }
        }
        return `${name}${description}${version}${commandsHelp}${optionsHelp}${argsHelp}`;
    }

    /**
     * Returns the program name (first token) from a command line
     * @param {string} commandLine - The raw command line
     * @returns {string|null} - The program name, or null if empty/invalid
     */
    getProgramName(commandLine) {
        if (!commandLine || typeof commandLine !== 'string') return null;
        const tokens = this._tokenize(commandLine);
        return tokens.length > 0 ? tokens[0] : null;
    }
}

export default PosixShellCommandParser