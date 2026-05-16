import { Application } from '../../system/application/application.js'
import { DECLARE_MANIFEST } from './declare-manifest.js'

/**
 * Declare - Application for declaring and unsetting variables for shell commands
 * @extends {Application}
 */
export class Declare extends Application {
    /**
     * Creates a new Declare instance
     */
    constructor() {
        super('declare', DECLARE_MANIFEST);
    }

    /**
     * Declares or unsets variables for shell commands
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the declare/unset command
     */
    main(commandLine, context) {
        const program = commandLine.getProgram();
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        if (program === 'declare') {
            return this._declareVariable(args, context);
        }
        if (program === 'unset') {
            return this._unsetVariable(args, options, context);
        }
        return ``;
    }

    /**
     * Declares a variable for the shell command
     * @param {string[]} args - The arguments of the command
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the declare command
     */
    _declareVariable(args, context) {
        let argIndex = 0;
        let variables = [];
        while (argIndex < args.length) {
            const arg = args[argIndex];
            if (!arg) break;
            const match = arg.match(/^([a-zA-Z_]\w*)=(.*)$/);
            if (!match) break;
            const variable = match[1].trim();
            const value = match[2].trim()
                .replace(/^("|')|("|')$/g, '');
            context.shell.setVariable(variable, value);
            variables.push(variable);
            argIndex++;
        }
        if (variables.length <= 0) {
            return context.shell.getVariables().map(variable => `${variable.name}='${variable.value}'`).join('\n');
        }
        return `Variable${variables.length > 1 ? 's' : ''} set: ${variables.join(', ')}`;
    }

    /**
     * Unsets a variable for the shell command
     * @param {string[]} args - The arguments of the command
     * @param {object} options - The options of the command
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the unset command
     */
    _unsetVariable(args, options, context) {
        if (options['all']) {
            context.shell.clearVariables();
            return 'All variables unset';
        }
        const name = args[0];
        const invalidMessage = `Invalid command: unset ${name}, try:\nunset name or unset -a|--all`;
        if (!name) return invalidMessage;
        const value = context.shell.getVariable(name);
        if (!value) return `Variable ${name} does not exist`;
        context.shell.removeVariable(name);
        return `Variable ${name} unset`;
    }
}

export default Declare