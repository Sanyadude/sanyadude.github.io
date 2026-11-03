const USER_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*$/;
const GROUP_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*$/;

/**
 * UserValidation - Provides user validation utilities
 * Maintains user name validation and other user-related operations
 */
export class UserValidation {
    /**
     * Validates a user name
     * @param {string} name The user name to validate
     * @returns {boolean} True if the user name is valid, false otherwise
     */
    static validateUserName(name) {
        return typeof name === 'string' && USER_NAME_PATTERN.test(name);
    }

    /**
     * Validates a group name
     * @param {string} name The group name to validate
     * @returns {boolean} True if the group name is valid, false otherwise
     */
    static validateGroupName(name) {
        return typeof name === 'string' && GROUP_NAME_PATTERN.test(name);
    }
}

export default UserValidation