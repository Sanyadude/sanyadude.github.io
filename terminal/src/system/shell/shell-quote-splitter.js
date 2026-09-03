/**
 * ShellQuoteSplitter - Splits a string by a separator while respecting quotes
 * Single and double quotes are kept on the parts; backslash escapes inside
 * double quotes and outside quotes are not treated as separators
 */
export class ShellQuoteSplitter {
    /**
     * Splits a string by a separator while respecting single and double quotes
     * @param {string} text - The string to split
     * @param {string} separator - The separator to split on
     * @returns {string[]} - The array of parts
     */
    split(text, separator) {
        if (!text || !separator) return [text];
        const parts = [];
        let current = '';
        let i = 0;
        let inSingle = false;
        let inDouble = false;
        while (i < text.length) {
            const character = text[i];
            if (character === '\\' && !inSingle) {
                current += character;
                if (i + 1 < text.length) {
                    current += text[i + 1];
                    i += 2;
                } else {
                    i++;
                }
                continue;
            }
            if (character === "'" && !inDouble) {
                inSingle = !inSingle;
                current += character;
                i++;
                continue;
            }
            if (character === '"' && !inSingle) {
                inDouble = !inDouble;
                current += character;
                i++;
                continue;
            }
            if (!inSingle && !inDouble && text.startsWith(separator, i)) {
                parts.push(current);
                current = '';
                i += separator.length;
                continue;
            }
            current += character;
            i++;
        }
        parts.push(current);
        return parts;
    }
}

export default ShellQuoteSplitter