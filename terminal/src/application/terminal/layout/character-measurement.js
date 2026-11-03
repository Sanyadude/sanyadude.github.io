const ZERO_WIDTH = /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Nonspacing_Mark}\p{Enclosing_Mark}\p{Surrogate}]+$/v;
const EMOJI = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;
const HAN = /\p{Script_Extensions=Han}/u;
const HANGUL = /\p{Script_Extensions=Hangul}/u;
const HIRAGANA = /\p{Script_Extensions=Hiragana}/u;
const KATAKANA = /\p{Script_Extensions=Katakana}/u;
const symbolWidthCache = new Map();

/**
 * CharacterMeasurement class - for measuring the size of a character
 */
export class CharacterMeasurement {
    /**
     * Measures the size of a character by inserting it into container and measuring the bounding client rect
     * @param {HTMLElement} container The container of the characters
     * @returns {object} The size of the character
     */
    static pixelSize(container) {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.textContent = 'A';
        container.appendChild(span);
        const charWidth = span.getBoundingClientRect().width;
        const charHeight = span.getBoundingClientRect().height;
        container.removeChild(span);
        return { width: charWidth, height: charHeight };
    }

    /**
     * Measures the display width of a character by checking if it is a combining mark / diacritic, emoji, CJK / Hangul / full-width characters
     * @param {string} char The character to measure
     * @returns {number} The display width of the character
     */
    static cellWidth(char) {
        if (!char) return 0;
        const cp = char.codePointAt(0);
        // ASCII characters
        if (cp <= 0x7F) {
            if (cp >= 0x20 && cp !== 0x7F) return 1; // Printable characters
            return 0; // Control characters (0x00-0x1F, 0x7F)
        }
        // Check cache
        const cached = symbolWidthCache.get(char);
        if (cached !== undefined) return cached;
        // Default width is 1
        let width = 1;
        // Combining marks / diacritics
        if (ZERO_WIDTH.test(char)) {
            width = 0;
        }
        // Emoji
        else if (EMOJI.test(char)) {
            width = 2;
        }
        // CJK / Hangul / Katakana / Hiragana
        else if (HANGUL.test(char) || HAN.test(char) || HIRAGANA.test(char) || KATAKANA.test(char)) {
            width = 2;
        }
        else if (
            (cp >= 0x3000 && cp <= 0x303F) || // CJK punctuation
            (cp >= 0xFF01 && cp <= 0xFF60) || // Fullwidth latin and punctuation
            (cp >= 0xFFE0 && cp <= 0xFFE6)    // Fullwidth currency symbols
        ) {
            width = 2;
        }
        symbolWidthCache.set(char, width);
        return width;
    }

    /**
     * Sums the column width of each code point in a string
     * @param {string} text The text to measure
     * @returns {number} The width in columns
     */
    static textCellWidth(text) {
        if (!text) return 0;
        let width = 0;
        for (const char of text) {
            width += this.cellWidth(char);
        }
        return width;
    }
}

export default CharacterMeasurement