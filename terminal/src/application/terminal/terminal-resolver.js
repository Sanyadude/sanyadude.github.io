/**
 * TerminalResolver - Resolves the terminal instance
 */
export class TerminalResolver {
    /**
     * Resolves the terminal instance
     * @param {number} version - The version of the terminal
     * @returns {Promise<Terminal>} - The terminal instance
     */
    async resolve(version) {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const supportedVersions = [1, 2, 3];
        if (version && supportedVersions.includes(version)) {
            const { Terminal } = await import(`./terminal-v${version}.js`);
            return Terminal;
        }
        if (isMobile || hasTouch) {
            const { Terminal } = await import('./terminal-v1.js');
            return Terminal;
        }
        const { Terminal } = await import('./terminal-v3.js');
        return Terminal;
    }
}