/**
 * IdentityProvider - Provides the identity of the current user
 */
export class IdentityProvider {
    /**
     * Creates a new IdentityProvider instance
     * @param {UserManager} userManager The user manager
     */
    constructor(userManager) {
        this._userManager = userManager;
    }

    /**
     * Gets the identity of the current user
     * @returns {object} The identity
     */
    getIdentity() {
        const user = this._userManager.getCurrentUser();
        return {
            author: user.getId(),
            owner: user.getId(),
            group: user.getGroupId(),
        };
    }
}

export default IdentityProvider