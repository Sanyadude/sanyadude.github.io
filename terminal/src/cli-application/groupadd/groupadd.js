import { Application } from '../../system/application/application.js'
import { GROUPADD_MANIFEST } from './groupadd-manifest.js'

/**
 * Groupadd - Application for adding a group
 * @extends {Application}
 */
export class Groupadd extends Application {
    /**
     * Creates a new Groupadd instance
     */
    constructor() {
        super('groupadd', GROUPADD_MANIFEST);
    }

    /**
     * Executes the `groupadd` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {string} The result of the groupadd command
     */
    main(commandLine, context) {
        const name = commandLine.getArguments()[0];
        if (!name) return 'Group name should be specified';
        const options = commandLine.getOptions();
        try {
            const group = this._addGroup(name, options, context);
            return `Group added: ${group.getName()}`;
        } catch (error) {
            return error.message;
        }
    }

    /**
     * Adds a group and adds the given users as members
     * @param {string} name The group name
     * @param {object} options The options of the command
     * @param {object} context The context of the command execution
     * @returns {SystemGroup} The created group
     */
    _addGroup(name, options, context) {
        const users = options['users'];
        const userManager = context.userManager;
        let members = [];
        if (users) {
            members = String(users).split(',').map((value) => this._getUser(userManager, value)).filter(Boolean);
        }
        const group = userManager.addGroup(name);
        for (const user of members) {
            userManager.addUserToGroup(user.getName(), group.getName());
        }
        return group;
    }

    /**
     * Gets an existing user by name or numeric id
     * @param {UserManager} userManager The user manager
     * @param {string} value The user name or id
     * @returns {SystemUser|null} The user, or null if it does not exist
     */
    _getUser(userManager, value) {
        let user = userManager.getUserById(Number(value));
        if (!user) {
            user = userManager.getUserByName(value);
        }
        return user;
    }
}

export default Groupadd