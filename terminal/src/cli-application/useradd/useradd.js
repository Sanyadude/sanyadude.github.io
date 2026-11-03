import { Application } from '../../system/application/application.js'
import { USERADD_MANIFEST } from './useradd-manifest.js'

/**
 * Useradd - Application for adding a user
 * @extends {Application}
 */
export class Useradd extends Application {
    /**
     * Creates a new Useradd instance
     */
    constructor() {
        super('useradd', USERADD_MANIFEST);
    }

    /**
     * Executes the `useradd` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {string} The result of the useradd command
     */
    main(commandLine, context) {
        const name = commandLine.getArguments()[0];
        if (!name) return 'User name should be specified';
        const options = commandLine.getOptions();
        const user = this._addUser(name, options, context);
        return `User added: ${user.getName()}`;
    }

    /**
     * Adds a user, creating a same-named group when no primary group is given, and creates the home directory
     * @param {string} name The user name
     * @param {object} options The options of the command
     * @param {object} context The context of the command execution
     * @returns {SystemUser} The created user
     */
    _addUser(name, options, context) {
        const group = options['group'];
        const groups = options['groups'];
        const userManager = context.userManager;
        let primaryGroup = null;
        let supplementaryGroups = [];
        if (groups) {
            supplementaryGroups = String(groups).split(',').map((value) => this._getGroup(userManager, value)).filter(Boolean);
        }
        if (group) {
            primaryGroup = this._getGroup(userManager, group);
        }
        if (!primaryGroup) {
            primaryGroup = userManager.getGroupByName(name);
        }
        if (!primaryGroup) {
            primaryGroup = userManager.addGroup(name);
        }
        const user = userManager.addUser(name, primaryGroup.getName());
        for (const memberGroup of supplementaryGroups) {
            if (memberGroup.getId() === primaryGroup.getId()) continue;
            userManager.addUserToGroup(user.getName(), memberGroup.getName());
        }
        this._createHome(user, context);
        return user;
    }

    /**
     * Gets an existing group by name or numeric id
     * @param {UserManager} userManager The user manager
     * @param {string} value The group name or id
     * @returns {SystemGroup} The group
     */
    _getGroup(userManager, value) {
        let group = userManager.getGroupById(Number(value))
        if (!group) {
            group = userManager.getGroupByName(value);
        }
        return group;
    }

    /**
     * Creates the user's home directory and default folders, owned by that user
     * @param {SystemUser} user The user
     * @param {object} context The context of the command execution
     */
    _createHome(user, context) {
        const fsManager = context.fileSystemManager;
        const home = (user.getHome() || '').replace(/^\/+/, '');
        if (!home) return;
        const directory = fsManager.createDirectory(home);
        if (!directory) return;
        directory.setMetadata({
            author: user.getId(),
            owner: user.getId(),
            group: user.getGroupId(),
        });
    }
}

export default Useradd