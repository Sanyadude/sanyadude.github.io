import { Application } from '../../system/application/application.js'
import { PASSWD_MANIFEST } from './passwd-manifest.js'

/**
 * Passwd - Application for changing the password for a user
 * @extends {Application}
 */
export class Passwd extends Application {
    /**
     * Creates a new Passwd instance
     */
    constructor() {
        super('passwd', PASSWD_MANIFEST);
    }

    /**
     * Executes the `passwd` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {string} The result of the passwd command
     */
    async main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        const name = args[0];
        if (!name) return 'User name should be specified';
        const deletePassword = options['delete'];
        if (deletePassword) {
            return this._deletePassword(name, context);
        }
        const user = context.userManager.getUserByName(name);
        if (!user) return `User ${name} not found`;
        const readLineOptions = { history: false, echo: false };
        const password = await context.shell.readLine('New password: ', readLineOptions);
        if (password == null) return '';
        if (!password) return 'Password should be specified';
        const again = await context.shell.readLine('Retype new password: ', readLineOptions);
        if (again == null) return '';
        if (password !== again) return 'Sorry, passwords do not match';
        return await this._changePassword(name, password, context);
    }

    /**
     * Changes the password for a user
     * @param {string} name The name of the user
     * @param {string} password The new password
     * @param {object} context The context of the command execution
     * @returns {string} The result of the change password command
     */
    async _changePassword(name, password, context) {
        await context.authenticationManager.setPassword(name, password);
        return `Password changed for user: ${name}`;
    }

    /**
     * Deletes the password for a user
     * @param {string} name The name of the user
     * @param {object} context The context of the command execution
     * @returns {string} The result of the delete password command
     */
    async _deletePassword(name, context) {
        const authenticationManager = context.authenticationManager;
        authenticationManager.removePassword(name);
        return `Password deleted for user: ${name}`;
    }
}

export default Passwd