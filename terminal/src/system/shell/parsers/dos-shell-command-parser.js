import { ShellCommandParser } from '../shell-command-parser.js'
import { ShellCommandLine } from '../shell-command-line.js'

/**
 * DosShellCommandParser - Parses command lines using DOS/Windows (CMD) syntax
 *
 * Supported syntax:
 *  - switches: /A /S /Q
 *  - negated flags: /-S sets the flag to false (/S is true); last occurrence wins
 *  - switches with values: /F:value, /O:N, /T:0A
 *  - switches are case-sensitive (/r and /R are distinct options)
 *  - switches are NOT bundled (/AB is the single switch "AB", not /A /B)
 *  - double quotes group tokens; a doubled "" inside quotes is a literal quote
 *  - backslashes are literal, so Windows paths (C:\Users\foo) are preserved
 *  - subcommands before or after switches (first matching registered command)
 *
 * Differences from the POSIX parser: values must be attached with ':'
 * (a value switch without ':value' falls back to its default) and there is
 * no '--' separator or short-option bundling. /-X only negates flag switches.
 */
export class DosShellCommandParser extends ShellCommandParser {
    /**
     * Tokenizes a string into an array of tokens using DOS/CMD rules
     * @param {string} input - The string to tokenize
     * @returns {string[]} - The array of tokens
     */
    _tokenize(input) {
        const tokens = [];
        let current = '';
        let i = 0;
        let inQuotes = false;
        // Tracks whether the current token contained a quote, so empty quoted
        // arguments ("") still produce a token instead of being dropped
        let hasToken = false;
        while (i < input.length) {
            const char = input[i];
            // Double quotes group tokens; a doubled "" inside quotes is a literal quote
            if (char === '"') {
                if (inQuotes && input[i + 1] === '"') {
                    current += '"';
                    hasToken = true;
                    i += 2;
                    continue;
                }
                inQuotes = !inQuotes;
                hasToken = true;
                i++;
                continue;
            }
            // Whitespace splits tokens when not inside quotes (backslash stays literal in DOS)
            if (!inQuotes && /\s/.test(char)) {
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
        let currentIndex = 0;
        const programName = tokens[currentIndex];
        currentIndex++;
        let commandName = '';
        const parsedOptions = {};
        const positionalArgs = [];
        // Match switch names case-sensitively so options like /r and /R stay distinct
        const getOption = (name) => {
            const option = Array.from(options.values()).find(option => option.getShort() === name || option.getLong() === name);
            if (!option) return null;
            return option;
        }
        const setOption = (option, value) => {
            if (!option) return;
            parsedOptions[option.getName()] = value;
        }
        const resolveSwitchValue = (option, value, negated) => {
            if (!option) return value !== null ? value : true;
            if (option.isFlag()) return !negated;
            if (value !== null) return value;
            return option.hasDefault() ? option.getDefaultValue() : null;
        }
        const isSwitchToken = (token) => {
            return typeof token === 'string' && token.length > 1 && token.startsWith('/');
        }
        while (currentIndex < tokens.length) {
            const currentArg = tokens[currentIndex];
            //handle non-switch arguments (first matching registered command becomes the subcommand)
            if (!isSwitchToken(currentArg)) {
                if (!commandName && commands.has(currentArg)) {
                    commandName = currentArg;
                } else {
                    positionalArgs.push(currentArg);
                }
                currentIndex++;
                continue;
            }
            //strip the leading slash, optional flag-negation hyphen, and an attached :value
            const switchBody = currentArg.slice(1);
            const isNegated = switchBody.startsWith('-') && switchBody.length > 1;
            const nameBody = isNegated ? switchBody.slice(1) : switchBody;
            const separatorIndex = nameBody.indexOf(':');
            const switchName = separatorIndex === -1 ? nameBody : nameBody.slice(0, separatorIndex);
            const switchValue = separatorIndex === -1 ? null : nameBody.slice(separatorIndex + 1);
            const option = getOption(switchName);
            // /-X only applies to flags; a negated value switch is ignored
            if (isNegated && (!option || !option.isFlag())) {
                currentIndex++;
                continue;
            }
            const resolvedValue = resolveSwitchValue(option, switchValue, isNegated);
            setOption(option, resolvedValue);
            currentIndex++;
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
            parts.push(`/${option.getShort()}, /${option.getLong()}`);
        } else if (option.getShort()) {
            parts.push(`/${option.getShort()}`);
        } else if (option.getLong()) {
            parts.push(`/${option.getLong()}`);
        }
        if (option.getValueName()) {
            parts.push(option.isValueRequired() ? `<${option.getValueName()}>` : `[<${option.getValueName()}>]`);
        }
        return parts.join(':');
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
        const formatted = argument.isRequired() ? `<${argument.getName()}>` : `[<${argument.getName()}>]`;
        return argument.isRepeatable() ? `${formatted}...` : formatted;
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

        const argumentsList = Array.from(programArguments.values()).map(argument => this._formatArgument(argument)).join(' ');
        const usageParts = [program.getName()];
        if (hasCommands) usageParts.push('[COMMAND]');
        if (hasOptions) usageParts.push('[SWITCH]...');
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
            optionsHelp += `\n\nSwitches:`;
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

export default DosShellCommandParser
