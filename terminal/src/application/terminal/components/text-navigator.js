export class TextNavigator {
    /**
     * @param {string} text - The full string being navigated.
     * @param {number} index - Current cursor index.
     * @param {string} type - 'word_start' or 'word_end'.
     * @param {string} forward - True if moving forward, false if moving backward.
     * @returns {number} - The new cursor position.
     */
    static moveCursor(text, index, type = 'word_start', forward = true) {
        const searchArea = forward ? text.slice(index) : text.slice(0, index);
        const patterns = {
            word_start: /(?<=^|\s)\S/g,
            word_end: /\S(?=\s|$)/g
        };
        const matches = [...searchArea.matchAll(patterns[type])];
        if (forward) {
            if (type === 'word_end') {
                for (let i = 0; i < matches.length; i++) {
                    const matchIndex = matches[i].index;
                    return index + matchIndex + 1;
                }
            }
            if (type === 'word_start') {
                for (let i = 0; i < matches.length; i++) {
                    const matchIndex = matches[i].index;
                    if (matchIndex > 0) return index + matchIndex;
                }
            }
            return text.length;
        } else {
            if (type === 'word_end') {
                for (let i = matches.length - 1; i >= 0; i--) {
                    const matchIndex = matches[i].index;
                    if (matchIndex + 1 < index) return matchIndex + 1;
                }
            }
            if (type === 'word_start') {
                for (let i = matches.length - 1; i >= 0; i--) {
                    const matchIndex = matches[i].index;
                    if (matchIndex < index) return matchIndex;
                }
            }
            return 0;
        }
    }
}