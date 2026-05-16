import { Application } from '../../system/application/application.js'
import { ALIAS_MANIFEST } from './alias-manifest.js'

/**
 * Alias - Application for creating and removing aliases for shell commands
 * @extends {Application}
 */
export class Alias extends Application {
    /**
     * Creates a new Alias instance
     */
    constructor() {
        super('alias', ALIAS_MANIFEST);
    }

    /**
     * Creates or removes aliases for shell commands
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the alias/unalias command
     */
    main(commandLine, context) {
        const program = commandLine.getProgram();
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        if (program === 'alias') {
            return this._createAlias(args, context);
        }
        if (program === 'unalias') {
            return this._removeAlias(args, options, context);
        }
        return ``;
    }

    /**
     * Creates an alias for the shell command
     * @param {string[]} args - The arguments of the command
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the alias command
     */
    _createAlias(args, context) {
        const aliasDefinition = args[0];
        if (!aliasDefinition) {
            return context.shell.getAliases().map(alias => `${alias.name}='${alias.command}'`).join('\n');
        }
        const aliasParts = aliasDefinition.split('=');
        const invalidMessage = `Invalid command: alias ${aliasDefinition}, try:\nalias name='command'`;
        if (aliasParts.length !== 2) return invalidMessage;
        const aliasName = aliasParts[0].trim();
        if (!aliasName) return invalidMessage;
        const aliasValue = aliasParts[1].trim()
            .replace(/^("|')|("|')$/g, '');
        if (!aliasValue) return invalidMessage;
        context.shell.setAlias(aliasName, aliasValue);
        return `Alias ${aliasName} added`;
    }

    /**
     * Removes an alias from the shell
     * @param {string[]} args - The arguments of the command
     * @param {object} options - The options of the command
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the unalias command
     */
    _removeAlias(args, options, context) {
        if (options['all']) {
            context.shell.clearAliases();
            return 'All aliases removed';
        }
        const name = args[0];
        const invalidMessage = `Invalid command: unalias ${name}, try:\nunalias name or unalias -a|--all`;
        if (!name) return invalidMessage;
        const alias = context.shell.getAlias(name);
        if (!alias) return `Alias ${name} does not exist`;
        context.shell.removeAlias(name);
        return `Alias ${name} removed`;
    }
}

export default Alias