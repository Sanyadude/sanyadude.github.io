/**
 * TerminalResolver - Resolves the terminal instance
 */
export class TerminalResolver {
    /**
     * Resolves the terminal instance
     * @returns {object} - The terminal instance
     */
    async resolve() {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isMobile || hasTouch) {
            const { Terminal } = await import('./terminal-v1.js');
            return Terminal;
        }
        const { Terminal } = await import('./terminal-v3.js');
        return Terminal;
    }
}