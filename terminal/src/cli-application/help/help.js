import { Application } from '../../system/application/application.js'
import { HELP_MANIFEST } from './help-manifest.js'

/**
 * Help - Application for displaying information about the shell commands
 * @extends {Application}
 */
export class Help extends Application {
    /**
     * Creates a new Help instance
     */
    constructor() {
        super('help', HELP_MANIFEST);
    }

    /**
     * Executes the `help` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the help command execution
     */
    async main(commandLine, context) {
        const args = commandLine.getArguments();
            const programName = args[0] || '';
            if (programName) {
                const program = context.shell.getProgram(programName);
                if (program) return program.getHelp();
                return `Command not found: ${programName}. Use 'help' to see available commands.`;
            }
            const programs = context.shell.getPrograms();
            if (programs.length === 0) return 'No commands registered.';
            return `Available commands:\n ${programs.map(program => `- ${program.getName()} - ${program.getDescription()}`).join('\n ')}`;
    }
}

export default Help