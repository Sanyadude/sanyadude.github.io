import { ShellProgram } from './shell-program.js'
import { ShellCommandContext } from './shell-command-context.js'
import { VARIABLES, ALIASES_DEPTH_MAX } from './shell-config.js'

/**
 * Represents a Shell instance
 */
export class Shell {
    /**
     * Creates a new Shell instance
     * @param {ServiceProvider} serviceProvider - The service provider instance
     * @param {SystemSettingsProvider} settingsProvider - The settings provider instance
     */
    constructor(serviceProvider, settingsProvider) {
        this._serviceProvider = serviceProvider;
        this._settingsProvider = settingsProvider;

        this._terminal = null;
        this._processManager = null;

        this._isProcessingQueue = false;
        this._queue = [];

        this._programs = new Map();
        this._aliases = new Map();
        this._variables = new Map();

        this._info = {
            version: '0.1.0',
            name: 'shell',
        }
    }

    /**
     * Gets the user instance
     * @returns {SystemUser} The user instance
     */
    getUser() {
        return this._settingsProvider.getUser();
    }

    /**
     * Gets the host instance
     * @returns {SystemHost} The host instance
     */
    getHost() {
        return this._settingsProvider.getHost();
    }

    /**
     * Gets the file system explorer
     * @returns {FileSystemExplorer} The file system explorer
     */
    getFileSystemExplorer() {
        return this._serviceProvider.get('fileSystemExplorer');
    }

    /**
     * Gets the prompt
     * @returns {Object} The prompt
     */
    getPrompt() {
        return {
            user: this.getUser().getName(),
            host: this.getHost().getName(),
            cwd: this.getFileSystemExplorer().getCurrentPath(),
            text: ''
        }
    }

    /**
     * Gets the completion list for the current directory
     * @returns {string[]} The completion list for the current directory
     */
    getCwdCompletionList() {
        const entries = this.getFileSystemExplorer().getEntries();
        const names = entries.map(entry => {
            const name = entry.getName();
            return name.includes(' ') ? `"${name}"` : name;
        });
        return names;
    }

    /**
     * Sets a terminal to the Shell instance
     * @param {object} terminal - The terminal
     * @returns {Shell} - The Shell instance
     */
    setTerminal(terminal) {
        this._terminal = terminal;
        return this;
    }

    /**
     * Sets the process manager to the Shell instance
     * @param {ProcessManager} processManager - The process manager
     * @returns {Shell} - The Shell instance
     */
    setProcessManager(processManager) {
        this._processManager = processManager;
        return this;
    }

    /**
     * Adds an alias to the Shell instance
     * @param {string} name - The name of the alias to add
     * @param {string} command - The command to add
     * @returns {Shell} - The Shell instance
     */
    setAlias(name, command) {
        this._aliases.set(name, command);
        return this;
    }

    /**
     * Gets an alias by name
     * @param {string} name - The name of the alias to get
     * @returns {string|null} - The command of the alias or null if the alias does not exist
     */
    getAlias(name) {
        return this._aliases.get(name);
    }

    /**
     * Removes an alias from the Shell instance
     * @param {string} name - The name of the alias to remove
     * @returns {Shell} - The Shell instance
     */
    removeAlias(name) {
        this._aliases.delete(name);
        return this;
    }

    /**
     * Gets all aliases
     * @returns {object[]} - The aliases
     */
    getAliases() {
        return [...this._aliases].map(([key, value]) => ({
            name: key,
            command: value
        }));
    }

    /**
     * Clears all aliases from the Shell instance
     * @returns {Shell} - The Shell instance
     */
    clearAliases() {
        this._aliases.clear();
        return this;
    }

    /**
     * Sets a variable to the Shell instance
     * @param {string} name - The name of the variable to set
     * @param {string} value - The value to set
     * @returns {Shell} - The Shell instance
     */
    setVariable(name, value) {
        this._variables.set(name, value);
        return this;
    }

    /**
     * Gets a variable by name
     * @param {string} name - The name of the variable to get
     * @returns {string|null} - The value of the variable or null if the variable does not exist
     */
    getVariable(name) {
        return this._variables.get(name);
    }

    /**
     * Removes a variable from the Shell instance
     * @param {string} name - The name of the variable to remove
     * @returns {Shell} - The Shell instance
     */
    removeVariable(name) {
        this._variables.delete(name);
        return this;
    }

    /**
     * Clears all variables from the Shell instance
     * @returns {Shell} - The Shell instance
     */
    clearVariables() {
        this._variables.clear();
        return this;
    }

    /**
     * Gets all variables
     * @returns {Object[]} - The variables
     */
    getVariables() {
        return [...this._variables].map(([key, value]) => ({
            name: key,
            value: value
        }));
    }

    /**
     * Registers a program with the Shell instance
     * @param {string} name - The name of the program to register
     * @param {ShellProgram} - The registered program
     */
    registerProgram(name) {
        if (this._programs.has(name)) return this._programs.get(name);
        const program = new ShellProgram(name);
        this._programs.set(name, program);
        return program;
    }

    /**
     * Registers a programs from a manifest
     * @param {object} manifest - The manifest with programs description
     * @returns {ShellProgram[]} - The registered programs
     */
    registerPrograms(manifest) {
        if (!manifest.name || typeof manifest.name !== 'string') return null;
        const programManifests = manifest.programs || [];
        const registeredPrograms = [];
        for (const programManifest of programManifests) {
            if (!programManifest.name || typeof programManifest.name !== 'string') continue;
            if (this._programs.has(programManifest.name)) {
                registeredPrograms.push(this._programs.get(programManifest.name));
                continue;
            }
            const program = new ShellProgram(programManifest.name);
            program.setDescription(programManifest.description || manifest.description || '');
            program.setVersion(programManifest.version || manifest.version || '');
            programManifest.commands?.forEach(command => {
                if (!command.name || typeof command.name !== 'string') return;
                program.addCommand(command.name, command.description || '');
            });
            programManifest.options?.forEach(option => {
                if (!option.name || typeof option.name !== 'string') return;
                program.addOption(option.name, option.description || '', option.defaultValue || null);
            });
            programManifest.arguments?.forEach(argument => {
                if (!argument.name || typeof argument.name !== 'string') return;
                program.addArgument(argument.name, argument.description || '');
            });
            this._programs.set(programManifest.name, program);
            registeredPrograms.push(program);
        }
        return registeredPrograms;
    }

    /**
     * Unregisters a program with the Shell instance
     * @param {string} name - The name of the program to unregister
     * @returns {ShellProgram|null} - The unregistered program or null if the program was not registered
     */
    unregisterProgram(name) {
        const program = this._programs.get(name);
        if (!program) return null;
        this._programs.delete(name);
        return program;
    }

    /**
     * Gets a program by name
     * @param {string} name - The name of the program to get
     * @returns {ShellProgram|null} - The program or null if the program was not registered
     */
    getProgram(name) {
        return this._programs.get(name);
    }

    /**
     * Returns all registered programs
     * @returns {ShellProgram[]} - An array of all registered programs
     */
    getPrograms() {
        return Array.from(this._programs.values());
    }

    /**
     * Splits a string by a separator while respecting single and double quotes.
     * Escaped characters inside double quotes and outside quotes are preserved.
     * @param {string} text - The string to split
     * @param {string} separator - The separator to split on
     * @returns {string[]} - The array of parts
     */
    _splitUnquoted(text, separator) {
        if (!text || !separator) return [text];
        const parts = [];
        let current = '';
        let i = 0;
        let inSingle = false;
        let inDouble = false;
        while (i < text.length) {
            const character = text[i];
            if (character === '\\' && !inSingle) {
                current += character;
                if (i + 1 < text.length) {
                    current += text[i + 1];
                    i += 2;
                } else {
                    i++;
                }
                continue;
            }
            if (character === "'" && !inDouble) {
                inSingle = !inSingle;
                current += character;
                i++;
                continue;
            }
            if (character === '"' && !inSingle) {
                inDouble = !inDouble;
                current += character;
                i++;
                continue;
            }
            if (!inSingle && !inDouble && text.startsWith(separator, i)) {
                parts.push(current);
                current = '';
                i += separator.length;
                continue;
            }
            current += character;
            i++;
        }
        parts.push(current);
        return parts;
    }

    /**
     * Returns the name of the program from the input text
     * @param {string} text - The input text
     * @returns {string} - The name of the program
     */
    _getProgramNameFromInput(text) {
        if (!text || typeof text !== 'string') return null;
        const parts = text.trim().split(/\s+/);
        if (parts.length === 0) return null;
        return parts[0];
    }

    /**
     * Executes the program with the given command, arguments, and options
     * @param {string} command - The command to execute
     * @param {string} stdin - The stdin to pass to the program
     * @returns {Promise<any>} - A promise that resolves to the result of the program execution
     */
    async _executeProgram(command, stdin = '') {
        const name = this._getProgramNameFromInput(command);
        const program = this._programs.get(name);
        if (!program) return `Command not found: ${name || '(empty)'}. Use 'help' to see available commands.`;
        const shellCommandLine = program.parse(command);
        shellCommandLine.setStdin(stdin);
        const result = await this._processManager.run(name, shellCommandLine);
        return result;
    }

    /**
     * Processes the queue iteratively
     * @returns {Promise<void>} - A promise that resolves when the queue is processed
     */
    async _processQueue() {
        while (this._queue.length > 0) {
            const current = this._queue[0];
            const prompt = this.getPrompt();
            this._terminal.writePrompt(prompt.user, prompt.host, prompt.cwd, current);
            try {
                const result = await this._runPipeline(current);
                this._terminal.writeLine(result);
            } catch (error) {
                this._terminal.writeLine(error?.toString() || 'Error');
            } finally {
                this._queue.shift();
            }
        }
    }

    /**
     * Runs a pipeline
     * @param {string} command - The command to run
     * @param {string} stdin - The stdin to pass to the pipeline
     * @returns {Promise<string>} - A promise that resolves to the output of the pipeline execution
     */
    async _runPipeline(command, stdin = '') {
        let context = new ShellCommandContext(command, stdin);
        const steps = [
            this._handleVariableAssignment.bind(this),
            this._expandAliases.bind(this),
            this._expandVariables.bind(this),
            this._handlePipes.bind(this),
            this._handleRedirection.bind(this),
            this._execute.bind(this),
        ];
        for (const step of steps) {
            if (context.stop) break;
            context = await step(context);
        }
        return context.stdout || '';
    }

    /**
     * Handles the variable assignment (name=value)
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    _handleVariableAssignment(context) {
        const tokens = this._splitUnquoted(context.command, ' ');
        let tokenIndex = 0;
        let variables = [];
        while (tokenIndex < tokens.length) {
            const token = tokens[tokenIndex];
            if (!token) break;
            const match = token.match(/^([a-zA-Z_]\w*)=(.*)$/);
            if (!match) break;
            const variable = match[1].trim();
            const value = match[2].trim()
                .replace(/^("|')|("|')$/g, '');
            this.setVariable(variable, value);
            variables.push(variable);
            tokenIndex++;
        }
        const remainingTokens = tokens.slice(tokenIndex);
        if (remainingTokens.length > 0) {
            context.command = remainingTokens.join(' ');
            return context;
        }
        if (variables.length > 0) {
            context.stdout = `Variable${variables.length > 1 ? 's' : ''} set: ${variables.join(', ')}`;
            context.stop = true;
        }
        return context;
    }

    /**
     * Expands the aliases in the command
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _expandAliases(context) {
        const aliases = this._aliases;
        let tokens = this._splitUnquoted(context.command, ' ');
        if (tokens.length === 0) return context;
        const seen = new Set();
        let depth = 0;
        while (depth < ALIASES_DEPTH_MAX) {
            const first = tokens[0];
            if (!aliases.has(first)) break;
            if (seen.has(first)) break;
            seen.add(first);
            const replacement = aliases.get(first);
            const newTokens = this._splitUnquoted(replacement, ' ');
            tokens = [
                ...newTokens,
                ...tokens.slice(1)
            ];
            depth++;
        }
        context.command = tokens.join(' ');
        return context;
    }

    /**
     * Expands the variables in the command
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _expandVariables(context) {
        const history = this.getFileSystemExplorer().getHistory();
        const pwd = `/${this.getFileSystemExplorer().getCurrentPath()}`;
        const oldPwd = `/${history.length > 1 ? history[history.length - 2] : ''}`;
        const variables = {
            [VARIABLES.USER]: this.getUser().getName(),
            [VARIABLES.HOSTNAME]: this.getHost().getName(),
            [VARIABLES.PWD]: pwd,
            [VARIABLES.OLDPWD]: oldPwd,
            [VARIABLES.TERM]: this._terminal.getTerminalInfo().type,
            [VARIABLES.SHELL]: this._info.name
        };
        for (const [variable, value] of this._variables.entries()) {
            variables[variable] = value;
        }
        context.command = context.command.replace(/\$(\w+)|\$\{(\w+)\}/g, (_, v1, v2) => {
            const key = v1 || v2;
            return variables[key] ?? `$${key}`;
        });
        return context;
    }

    /**
     * Handles the pipes
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _handlePipes(context) {
        const pipedCommands = this._splitUnquoted(context.command, ' | ')
            .map(pipedCommand => pipedCommand.trim())
            .filter(Boolean);
        if (pipedCommands.length <= 1) return context;
        let stdin = context.stdin || '';
        for (const pipedCommand of pipedCommands) {
            const result = await this._runPipeline(pipedCommand, stdin);
            stdin = result;
        }
        context.stdout = stdin;
        context.stop = true;
        return context;
    }

    /**
     * Handles the redirection
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _handleRedirection(context) {
        // Append >>
        const append = this._splitUnquoted(context.command, ' >> ');
        if (append.length > 1) {
            context.command = append[0].trim();
            context.appendFile = append[1].trim();
            return context;
        }
        // Overwrite >
        const overwrite = this._splitUnquoted(context.command, ' > ');
        if (overwrite.length > 1) {
            context.command = overwrite[0].trim();
            context.outputFile = overwrite[1].trim();
            return context;
        }
        // Input <
        const input = this._splitUnquoted(context.command, ' < ');
        if (input.length > 1) {
            context.command = input[0].trim();
            const file = this.getFileSystemExplorer().getFile(input[1].trim());
            context.stdin = file ? file.readAsString() : '';
        }
        return context;
    }

    /**
     * Executes the program or handles the redirection depending on the context parameters
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _execute(context) {
        const output = await this._executeProgram(context.command, context.stdin);
        if (context.appendFile) {
            const file = this.getFileSystemExplorer().getFile(context.appendFile);
            if (file) file.writeLine(output);
            else this.getFileSystemExplorer().createFile(context.appendFile, output, true);
            context.stdout = `Output added to: ${context.appendFile}`;
            return context;
        }
        if (context.outputFile) {
            this.getFileSystemExplorer().createFile(context.outputFile, output, true);
            context.stdout = `Output written to: ${context.outputFile}`;
            return context;
        }
        context.stdout = output?.toString() || '';
        return context;
    }

    /**
     * Inputs text into the Shell instance
     * @param {string} text - The input text
     * @returns {Promise<void>} - A promise that resolves when the input is processed
     */
    async input(text) {
        const commands = this._splitUnquoted(text, ';')
            .map(command => command.trim())
            .filter(Boolean);
        for (const command of commands) {
            this._queue.push(command);
        }
        if (this._isProcessingQueue) return;
        this._isProcessingQueue = true;
        try {
            await this._processQueue();
        } finally {
            this._isProcessingQueue = false;
        }
    }
}

export default Shell