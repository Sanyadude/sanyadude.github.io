import { PERMISSION_SCOPE } from './permission-scope.js'
import { MODE_BITS, DEFAULT_FILE_MODE, DEFAULT_DIRECTORY_MODE } from '../../config/permission-config.js'

/**
 * PermissionManager - Reads and writes the rwx mode stored on an entry
 */
export class PermissionManager {
    /**
     * Gets the default mode for an entry type
     * @param {string} entryType The type of entry (file or directory)
     * @returns {number} The default mode
     */
    getDefaultMode(entryType) {
        switch (entryType) {
            case 'file':
                return DEFAULT_FILE_MODE;
            case 'directory':
                return DEFAULT_DIRECTORY_MODE;
            default:
                throw new Error(`Invalid entry type: ${entryType}`);
        }
    }

    /**
     * Checks whether a mode includes the read bit for the owner scope
     * @param {number} mode The mode
     * @returns {boolean} True when the read bit is set for the owner scope
     */
    canOwnerRead(mode) {
        return this.canRead(mode, PERMISSION_SCOPE.OWNER);
    }

    /**
     * Checks whether a mode includes the write bit for the owner scope
     * @param {number} mode The mode
     * @returns {boolean} True when the write bit is set for the owner scope
     */
    canOwnerWrite(mode) {
        return this.canWrite(mode, PERMISSION_SCOPE.OWNER);
    }

    /**
     * Checks whether a mode includes the execute bit for the owner scope
     * @param {number} mode The mode
     * @returns {boolean} True when the execute bit is set for the owner scope
     */
    canOwnerExecute(mode) {
        return this.canExecute(mode, PERMISSION_SCOPE.OWNER);
    }

    /**
     * Checks whether a mode includes the read bit for the group scope
     * @param {number} mode The mode
     * @returns {boolean} True when the read bit is set for the group scope
     */
    canGroupRead(mode) {
        return this.canRead(mode, PERMISSION_SCOPE.GROUP);
    }

    /**
     * Checks whether a mode includes the write bit for the group scope
     * @param {number} mode The mode
     * @returns {boolean} True when the write bit is set for the group scope
     */
    canGroupWrite(mode) {
        return this.canWrite(mode, PERMISSION_SCOPE.GROUP);
    }

    /**
     * Checks whether a mode includes the execute bit for the group scope
     * @param {number} mode The mode
     * @returns {boolean} True when the execute bit is set for the group scope
     */
    canGroupExecute(mode) {
        return this.canExecute(mode, PERMISSION_SCOPE.GROUP);
    }

    /**
     * Checks whether a mode includes the read bit for the other scope
     * @param {number} mode The mode
     * @returns {boolean} True when the read bit is set for the other scope
     */
    canOtherRead(mode) {
        return this.canRead(mode, PERMISSION_SCOPE.OTHER);
    }

    /**
     * Checks whether a mode includes the write bit for the other scope
     * @param {number} mode The mode
     * @returns {boolean} True when the write bit is set for the other scope
     */
    canOtherWrite(mode) {
        return this.canWrite(mode, PERMISSION_SCOPE.OTHER);
    }

    /**
     * Checks whether a mode includes the execute bit for the other scope
     * @param {number} mode The mode
     * @returns {boolean} True when the execute bit is set for the other scope
     */
    canOtherExecute(mode) {
        return this.canExecute(mode, PERMISSION_SCOPE.OTHER);
    }

    /**
     * Checks whether a mode includes the read bit for a scope
     * @param {number} mode The mode
     * @param {string} scope The scope (owner, group, other)
     * @returns {boolean} True when the read bit is set
     */
    canRead(mode, scope) {
        return this.has(mode, MODE_BITS[scope].read);
    }

    /**
     * Checks whether a mode includes the write bit for a scope
     * @param {number} mode The mode
     * @param {string} scope The scope (owner, group, other)
     * @returns {boolean} True when the write bit is set
     */
    canWrite(mode, scope) {
        return this.has(mode, MODE_BITS[scope].write);
    }

    /**
     * Checks whether a mode includes the execute bit for a scope
     * @param {number} mode The mode
     * @param {string} scope The scope (owner, group, other)
     * @returns {boolean} True when the execute bit is set
     */
    canExecute(mode, scope) {
        return this.has(mode, MODE_BITS[scope].execute);
    }

    /**
     * Checks whether a mode includes a bit
     * @param {number} mode The mode
     * @param {number} bit The bit to test
     * @returns {boolean} True when the bit is set
     */
    has(mode, bit) {
        return (Number(mode) & bit) === bit;
    }
}

export default PermissionManager