/**
 * PermissionProvider - Provides the mode applied to entries created by the file system
 */
export class PermissionProvider {
    /**
     * Creates a new PermissionProvider instance
     * @param {PermissionManager} permissionManager The permission manager
     */
    constructor(permissionManager) {
        this._permissionManager = permissionManager;
    }

    /**
     * Gets the mode for an entry from its type
     * @param {string} entryType The type of entry (file or directory)
     * @returns {number} The mode for the entry
     */
    getMode(entryType) {
        return this._permissionManager.getDefaultMode(entryType);
    }
}

export default PermissionProvider