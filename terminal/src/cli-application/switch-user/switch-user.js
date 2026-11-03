import { Application } from '../../system/application/application.js'
import { SWITCH_USER_MANIFEST } from './switch-user-manifest.js'

/**
 * SwitchUser - Application for switching the current user
 * @extends {Application}
 */
export class SwitchUser extends Application {
    /**
     * Creates a new SwitchUser instance
     */
    constructor() {
        super('switch-user', SWITCH_USER_MANIFEST);
    }

    /**
     * Executes the `switch-user` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {Promise<string>} The result of the switch-user command
     */
    async main(commandLine, context) {
        const name = commandLine.getArguments()[0];
        if (!name) return 'User name should be specified';
        const user = context.shell.getUserManager().getUserByName(name);
        if (!user) return `User does not exist: ${name}`;
        if (context.authenticationManager.hasPassword(name)) {
            const password = await context.shell.readLine('Password: ', { history: false, echo: false });
            if (password == null) return '';
            const authenticated = await context.authenticationManager.authenticate(name, password);
            if (!authenticated) return 'Wrong password';
        }
        try {
            const switched = context.shell.switchUser(name);
            return `User changed to: ${switched.getName()}`;
        } catch (error) {
            return error.message;
        }
    }
}

export default SwitchUser;
