import { ShellCommandContext } from './shell-command-context.js'
import { ShellJob } from './shell-job.js'
import { ShellInterruptedError } from './shell-interrupted-error.js'
import { PosixShellCommandParser } from './parsers/posix-shell-command-parser.js'
import { DosShellCommandParser } from './parsers/dos-shell-command-parser.js'
import { VARIABLES } from './shell-config.js'
import { ShellGlobExpander } from './shell-glob-expander.js'
import { ShellQuoteSplitter } from './shell-quote-splitter.js'
import { ShellAliases } from './shell-aliases.js'
import { ShellVariables } from './shell-variables.js'
import { ShellProgramRegistry } from './shell-program-registry.js'

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

        this._processingPromise = null;
        this._currentJob = null;
        this._queue = [];

        this._parser = new PosixShellCommandParser();
        this._quoteSplitter = new ShellQuoteSplitter();
        this._aliases = new ShellAliases();
        this._variables = new ShellVariables();
        this._programRegistry = new ShellProgramRegistry();

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
     * Gets the file system manager
     * @returns {FileSystemManager} The file system manager
     */
    getFileSystemManager() {
        return this._serviceProvider.get('fileSystemManager');
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
        this._aliases.remove(name);
        return this;
    }

    /**
     * Gets all aliases
     * @returns {object[]} - The aliases
     */
    getAliases() {
        return this._aliases.list();
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
        this._variables.remove(name);
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
        return this._variables.list();
    }

    /**
     * Gets the command line parser used to parse commands
     * @returns {ShellCommandParser} The parser
     */
    getParser() {
        return this._parser;
    }

    /**
     * Sets the command line parser used to parse commands
     * Use this to switch the command line syntax (e.g. POSIX/Unix vs Windows/DOS)
     * @param {ShellCommandParser} parser - The parser to use
     * @returns {Shell} The shell instance
     */
    setParser(parser) {
        if (!parser || typeof parser.parse !== 'function') {
            throw new Error('Parser must implement a parse(program, commandLine) method');
        }
        this._parser = parser;
        return this;
    }

    /**
     * Uses the POSIX/Unix command line syntax
     * @returns {Shell} The shell instance
     */
    usePosixSyntax() {
        this._parser = new PosixShellCommandParser();
        return this;
    }

    /**
     * Uses the Windows/DOS command line syntax
     * @returns {Shell} The shell instance
     */
    useDosSyntax() {
        this._parser = new DosShellCommandParser();
        return this;
    }

    /**
     * Registers a program with the Shell instance
     * @param {string} name - The name of the program to register
     * @param {ShellProgram} - The registered program
     */
    registerProgram(name) {
        return this._programRegistry.register(name);
    }

    /**
     * Registers a programs from a manifest
     * @param {object} manifest - The manifest with programs description
     * @returns {ShellProgram[]} - The registered programs
     */
    registerPrograms(manifest) {
        return this._programRegistry.registerFromManifest(manifest);
    }

    /**
     * Unregisters a program with the Shell instance
     * @param {string} name - The name of the program to unregister
     * @returns {ShellProgram|null} - The unregistered program or null if the program was not registered
     */
    unregisterProgram(name) {
        return this._programRegistry.unregister(name);
    }

    /**
     * Gets a program by name
     * @param {string} name - The name of the program to get
     * @returns {ShellProgram|null} - The program or null if the program was not registered
     */
    getProgram(name) {
        return this._programRegistry.get(name);
    }

    /**
     * Returns all registered programs
     * @returns {ShellProgram[]} - An array of all registered programs
     */
    getPrograms() {
        return this._programRegistry.list();
    }

    /**
     * Ensures the current shell job can proceed
     * @throws {ShellInterruptedError} - If the current job was aborted
     */
    _ensureShellJobCanProceed() {
        if (!this._currentJob || !this._currentJob.isAborted()) return;
        throw new ShellInterruptedError();
    }

    /**
     * Executes the program with the given command, arguments, and options
     * @param {string} command - The command to execute
     * @param {string} stdin - The stdin to pass to the program
     * @returns {Promise<any>} - A promise that resolves to the result of the program execution
     * @throws {ShellInterruptedError} - If the current job was aborted
     */
    async _executeProgram(command, stdin = '') {
        this._ensureShellJobCanProceed();
        const name = this._parser.getProgramName(command);
        const program = this._programRegistry.get(name);
        if (!program) return `Command not found: ${name || '(empty)'}. Use 'help' to see available commands.`;
        const shellCommandLine = this._parser.parse(program, command);
        shellCommandLine.setStdin(stdin);
        const options = shellCommandLine.getOptions();
        if (options['help']) {
            return program.getHelpText() || this._parser.getHelp(program);
        }
        if (options['version']) {
            const version = program.getVersion();
            return version ? `${program.getName()} ${version}` : program.getName();
        }
        const result = await this._processManager.run(name, shellCommandLine, this._currentJob.getRuntime());
        this._ensureShellJobCanProceed();
        return result;
    }

    /**
     * Processes the queue iteratively
     * @returns {Promise<void>} - A promise that resolves when the queue is processed
     */
    async _processQueue() {
        while (this._queue.length > 0) {
            this._currentJob = this._queue[0];
            const prompt = this.getPrompt();
            this._terminal.writePrompt(prompt.user, prompt.host, prompt.cwd, this._currentJob.getCommand());
            try {
                const result = await this._runPipeline(this._currentJob.getCommand());
                this._terminal.writeLine(result);
            } catch (error) {
                if (!(error instanceof ShellInterruptedError)) {
                    this._terminal.writeLine(error?.toString() || 'Error');
                }
            } finally {
                this._currentJob = null;
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
            this._expandGlobs.bind(this),
            this._handlePipes.bind(this),
            this._handleRedirection.bind(this),
            this._execute.bind(this),
        ];
        for (const step of steps) {
            this._ensureShellJobCanProceed();
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
        const { command, assigned } = this._variables.applyAssignments(context.command);
        if (assigned.length > 0 && !command) {
            context.stdout = `Variable${assigned.length > 1 ? 's' : ''} set: ${assigned.join(', ')}`;
            context.stop = true;
            context.command = command;
            return context;
        }
        context.command = command;
        return context;
    }

    /**
     * Expands the aliases in the command
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _expandAliases(context) {
        const tokens = this._quoteSplitter.split(context.command, ' ');
        if (tokens.length === 0) return context;
        context.command = this._aliases.expand(tokens).join(' ');
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
        context.command = this._variables.expand(context.command, {
            [VARIABLES.USER]: this.getUser().getName(),
            [VARIABLES.HOSTNAME]: this.getHost().getName(),
            [VARIABLES.PWD]: pwd,
            [VARIABLES.OLDPWD]: oldPwd,
            [VARIABLES.TERM]: this._terminal.getTerminalInfo().type,
            [VARIABLES.SHELL]: this._info.name
        });
        return context;
    }

    /**
     * Expands unquoted glob tokens (*, ?, [...]) against the file system
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _expandGlobs(context) {
        if (!context.command) return context;
        const expander = new ShellGlobExpander(this.getFileSystemExplorer(), this.getFileSystemManager());
        const tokens = this._quoteSplitter.split(context.command, ' ');
        context.command = expander.expand(tokens).join(' ');
        return context;
    }

    /**
     * Handles the pipes
     * @param {object} context - The context
     * @returns {Promise<object>} - A promise that resolves to the context
     */
    async _handlePipes(context) {
        const pipedCommands = this._quoteSplitter.split(context.command, ' | ')
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
        const append = this._quoteSplitter.split(context.command, ' >> ');
        if (append.length > 1) {
            context.command = append[0].trim();
            context.appendFile = append[1].trim();
            return context;
        }
        // Overwrite >
        const overwrite = this._quoteSplitter.split(context.command, ' > ');
        if (overwrite.length > 1) {
            context.command = overwrite[0].trim();
            context.outputFile = overwrite[1].trim();
            return context;
        }
        // Input <
        const input = this._quoteSplitter.split(context.command, ' < ');
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
            else this.getFileSystemManager().createFile(context.appendFile, output, true);
            context.stdout = `Output added to: ${context.appendFile}`;
            return context;
        }
        if (context.outputFile) {
            this.getFileSystemManager().createFile(context.outputFile, output, true);
            context.stdout = `Output written to: ${context.outputFile}`;
            return context;
        }
        context.stdout = output?.toString() || '';
        return context;
    }

    /**
     * Checks whether the shell is executing a command
     * @returns {boolean} - True while processing commands
     */
    isProcessing() {
        return this._processingPromise !== null;
    }

    /**
     * Interrupts the foreground job and discards queued commands
     * @returns {boolean} - True if a process was interrupted
     */
    abortCurrentJob() {
        this._queue.splice(1);
        if (!this._currentJob) return false;
        this._currentJob.abort();
        return true;
    }

    /**
     * Inputs text into the Shell instance
     * @param {string} text - The input text
     * @returns {Promise<void>} - A promise that resolves when the input is processed
     */
    async input(text) {
        const commands = this._quoteSplitter.split(text, ';')
            .map(command => command.trim())
            .filter(Boolean);
        for (const command of commands) {
            this._queue.push(new ShellJob(command));
        }
        if (this._processingPromise) return;
        this._processingPromise = this._processQueue().finally(() => {
            this._processingPromise = null;
            this._currentJob = null;
        });
        await this._processingPromise;
    }
}

export default Shell