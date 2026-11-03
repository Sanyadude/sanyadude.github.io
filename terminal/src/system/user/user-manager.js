import { IdGeneratorFactory } from '../../core/id-generator-factory.js'
import { UserValidation } from './user-validation.js'
import { SystemGroup } from './system-group.js'
import { SystemUser } from './system-user.js'
import { 
    ROOT_USER_ID, ROOT_GROUP_ID, 
    PUBLIC_USER_ID_START, PUBLIC_GROUP_ID_START, 
    DEFAULT_USER_NAME, DEFAULT_GROUP_NAME, DEFAULT_HOME_PATH 
} from '../../config/user-config.js'

const nextUserId = IdGeneratorFactory.createIncremental(PUBLIC_USER_ID_START);
const nextGroupId = IdGeneratorFactory.createIncremental(PUBLIC_GROUP_ID_START);

/**
 * UserManager - Registry of users and groups, and the current session user
 */
export class UserManager {
    /**
     * Creates a manager and seeds the root user
     */
    constructor() {
        this._usersById = new Map();
        this._usersByName = new Map();
        this._groupsById = new Map();
        this._groupsByName = new Map();
        this._init();
    }

    /**
     * Initializes the user manager with the root user and group
     */
    _init() {
        const group = new SystemGroup(ROOT_GROUP_ID, DEFAULT_GROUP_NAME);
        this._groupsById.set(group.getId(), group);
        this._groupsByName.set(group.getName(), group);
        const user = new SystemUser(ROOT_USER_ID, DEFAULT_USER_NAME, group.getId(), `${DEFAULT_HOME_PATH}/${DEFAULT_USER_NAME}`);
        this._usersById.set(user.getId(), user);
        this._usersByName.set(user.getName(), user);
        group.addUserId(user.getId());
        this._currentUser = user;
    }

    /**
     * Adds a group
     * @param {string} name The group name
     * @returns {SystemGroup} The created group
     */
    addGroup(name) {
        if (!UserValidation.validateGroupName(name)) {
            throw new Error(`Invalid group name: ${name}`);
        }
        if (this._groupsByName.has(name)) {
            throw new Error(`Group already exists: ${name}`);
        }
        const group = new SystemGroup(nextGroupId(), name);
        this._groupsById.set(group.getId(), group);
        this._groupsByName.set(group.getName(), group);
        return group;
    }

    /**
     * Removes a group
     * @param {string} name The group name
     * @returns {SystemGroup} The removed group
     */
    removeGroup(name) {
        const group = this.getGroupByName(name);
        if (!group) {
            throw new Error(`Group does not exist: ${name}`);
        }
        const users = this.getGroupUsers(name);
        if (users.length > 0) {
            throw new Error(`Group is primary for user: ${users.map(user => user.getName()).join(', ')}`);
        }
        this._groupsById.delete(group.getId());
        this._groupsByName.delete(group.getName());
        return group;
    }

    /**
     * Gets a group by name
     * @param {string} name The group name
     * @returns {SystemGroup|null} The group, or null if it does not exist
     */
    getGroupByName(name) {
        return this._groupsByName.get(name) || null;
    }

    /**
     * Gets a group by id
     * @param {number} id The group id
     * @returns {SystemGroup|null} The group, or null if it does not exist
     */
    getGroupById(id) {
        return this._groupsById.get(id) || null;
    }

    /**
     * Gets every group
     * @returns {SystemGroup[]} The groups
     */
    getGroups() {
        return [...this._groupsById.values()];
    }

    /**
     * Adds a user
     * @param {string} name The user name
     * @param {string} groupName Primary group name
     * @param {string} home Home directory path
     * @returns {SystemUser} The created user
     */
    addUser(name, groupName, home) {
        if (!UserValidation.validateUserName(name)) {
            throw new Error(`Invalid user name: ${name}`);
        }
        if (this._usersByName.has(name)) {
            throw new Error(`User already exists: ${name}`);
        }
        if (!UserValidation.validateGroupName(groupName)) {
            throw new Error(`Invalid group name: ${groupName}`);
        }
        const group = this.getGroupByName(groupName);
        if (!group) {
            throw new Error(`Group does not exist: ${groupName}`);
        }
        const user = new SystemUser(nextUserId(), name, group.getId(), home);
        group.addUserId(user.getId());
        this._usersById.set(user.getId(), user);
        this._usersByName.set(user.getName(), user);
        return user;
    }
    
    /**
     * Removes a user
     * @param {string} name The user name
     * @returns {UserManager} The manager
     */
    removeUser(name) {
        const user = this.getUserByName(name);
        if (!user) {
            throw new Error(`User does not exist: ${name}`);
        }
        const groups = this.getUserGroups(name);
        for (const group of groups) {
            group.removeUserId(user.getId());
        }
        this._usersById.delete(user.getId());
        this._usersByName.delete(user.getName());
        return user;
    }

    /**
     * Gets a user by name
     * @param {string} name The user name
     * @returns {SystemUser|null} The user, or null if it does not exist
     */
    getUserByName(name) {
        return this._usersByName.get(name) || null;
    }

    /**
     * Gets a user by id
     * @param {number} id The user id
     * @returns {SystemUser|null} The user, or null if it does not exist
     */
    getUserById(id) {
        return this._usersById.get(id) || null;
    }

    /**
     * Gets every user
     * @returns {SystemUser[]} The users
     */
    getUsers() {
        return [...this._usersById.values()];
    }

    /**
     * Adds a user to a group
     * @param {string} name The user name
     * @param {string} groupName The group name
     * @returns {UserManager} The manager
     */
    addUserToGroup(name, groupName) {
        const user = this.getUserByName(name);
        if (!user) {
            throw new Error(`User does not exist: ${name}`);
        }
        const group = this.getGroupByName(groupName);
        if (!group) {
            throw new Error(`Group does not exist: ${groupName}`);
        }
        group.addUserId(user.getId());
        return this;
    }

    /**
     * Removes a user from a group
     * @param {string} name The user name
     * @param {string} groupName The group name
     * @returns {UserManager} The manager
     */
    removeUserFromGroup(name, groupName) {
        const user = this.getUserByName(name);
        if (!user) {
            throw new Error(`User does not exist: ${name}`);
        }
        const group = this.getGroupByName(groupName);
        if (!group) {
            throw new Error(`Group does not exist: ${groupName}`);
        }
        group.removeUserId(user.getId());
        return this;
    }

    /**
     * Gets all groups of a user
     * @param {string} name The user name
     * @returns {SystemGroup[]} The groups
     */
    getUserGroups(name) {
        const user = this.getUserByName(name);
        if (!user) {
            throw new Error(`User does not exist: ${name}`);
        }
        const groups = this.getGroups().filter(group => group.getUserIds().includes(user.getId()));
        return groups;
    }

    /**
     * Gets all users of a group
     * @param {string} name The group name
     * @returns {SystemUser[]} The users
     */
    getGroupUsers(name) {
        const group = this.getGroupByName(name);
        if (!group) {
            throw new Error(`Group does not exist: ${name}`);
        }
        return this.getUsers().filter(user => user.getGroupId() === group.getId());
    }

    /**
     * Gets the user for the current session
     * @returns {SystemUser} The current user
     */
    getCurrentUser() {
        return this._currentUser;
    }

    /**
     * Switches the current session to an existing user
     * @param {string} name The user name
     * @returns {SystemUser} The user that is now current
     */
    setCurrentUser(name) {
        if (!this._usersByName.has(name)) {
            throw new Error(`User does not exist: ${name}`);
        }
        this._currentUser = this.getUserByName(name);
        return this;
    }
}

export default UserManager