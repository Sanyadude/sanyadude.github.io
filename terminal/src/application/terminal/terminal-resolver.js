/**
 * TerminalResolver - Resolves the terminal instance
 */
export class TerminalResolver {
    /**
     * Resolves the terminal instance
     * @param {number} version The version of the terminal
     * @returns {Promise<Terminal>} The terminal instance
     */
    async resolve(version) {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const supportedVersions = ['normal', 'mobile', '1', '2'];

        let terminalImportPath = './terminal.js';
        if (isMobile || hasTouch) {
            terminalImportPath = './terminal-mobile.js';
        }
        if (version && supportedVersions.includes(version)) {
            if (version === 'normal' || version === '2') {
                terminalImportPath = './terminal.js';
            }
            if (version === 'mobile' || version === '1') {
                terminalImportPath = './terminal-mobile.js';
            }
        }

        const { Terminal } = await import(terminalImportPath);
        return Terminal;
    }
}

export default TerminalResolver