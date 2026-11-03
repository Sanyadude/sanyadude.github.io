import { Application } from '../../system/application/application.js'
import { GROUPS_MANIFEST } from './groups-manifest.js'

/**
 * Groups - Application for printing a user's group
 * @extends {Application}
 */
export class Groups extends Application {
    /**
     * Creates a new Groups instance
     */
    constructor() {
        super('groups', GROUPS_MANIFEST);
    }

    /**
     * Executes the `groups` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {string} The result of the groups command
     */
    main(commandLine, context) {
        const name = commandLine.getArguments()[0];
        const userManager = context.userManager;
        const user = name ? userManager.getUserByName(name) : userManager.getCurrentUser();
        if (!user) return `User does not exist: ${name}`;
        const groups = userManager.getUserGroups(user.getName());
        return groups.map(group => group.getName()).join(', ');
    }
}

export default Groups