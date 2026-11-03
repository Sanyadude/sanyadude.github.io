import { Application } from '../../system/application/application.js'
import { ID_MANIFEST } from './id-manifest.js'

/**
 * Id - Application for printing a user's name and group
 * @extends {Application}
 */
export class Id extends Application {
    /**
     * Creates a new Id instance
     */
    constructor() {
        super('id', ID_MANIFEST);
    }

    /**
     * Executes the `id` command
     * @param {ShellCommandLine} commandLine The command line to execute
     * @param {object} context The context of the command execution
     * @returns {string} The result of the id command
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const name = commandLine.getArguments()[0];
        const userManager = context.userManager;
        const user = name ? userManager.getUserByName(name) : userManager.getCurrentUser();
        if (!user) return `User does not exist: ${name}`;
        const printUser = Boolean(options['user']);
        const printGroup = Boolean(options['group']);
        const printGroups = Boolean(options['groups']);
        const printName = Boolean(options['name']);
        const zeroTerminated = Boolean(options['zero']);
        const group = userManager.getGroupById(user.getGroupId());
        if (!group) {
            return `User group does not exist: gid=${user.getGroupId()}`;
        }
        const delimiter = zeroTerminated ? '\0' : ' ';
        if (printUser) {
            return printName ? user.getName() : String(user.getId());
        }
        if (printGroup) {
            return printName ? group.getName() : String(group.getId());
        }
        const userGroups = userManager.getUserGroups(user.getName());
        const groups = [group];
        for (const userGroup of userGroups) {
            if (group.getId() === userGroup.getId()) continue;
            groups.push(userGroup);
        }
        if (printGroups) {
            const values = groups.map((group) => printName ? group.getName() : String(group.getId()));
            return values.join(delimiter);
        }
        return this._format(user, group, groups, delimiter);
    }

    /**
     * Formats the user, group, and groups
     * @param {SystemUser} user The user
     * @param {SystemGroup} group The group
     * @param {SystemGroup[]} groups The groups
     * @param {string} delimiter The delimiter
     * @returns {string} The formatted string
     */
    _format(user, group, groups, delimiter) {
        const formattedGroups = groups.map((group) => group.getName()).join(delimiter);
        return `uid=${user.getId()}(${user.getName()}) gid=${group.getId()}(${group.getName()}) groups=${formattedGroups}`;
    }
}

export default Id