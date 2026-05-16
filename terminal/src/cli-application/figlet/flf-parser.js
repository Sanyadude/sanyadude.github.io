/**
 * FlfParser - A class for parsing flf files
 */
export class FlfParser {
    /**
     * Parses the FLF font file
     * @param {string} fontFile - The font file content
     * @returns {Object} - Parsed font object with metadata and character map
     */
    parse(fontFile) {
        const lines = fontFile.split('\n');
        // Parse header line: flf2a$ height baseline maxLength oldLayout commentLines printDirection fullLayout codeTagCount
        const headerLine = lines[0];
        if (!headerLine.startsWith('flf2a')) {
            throw new Error('Invalid FLF file format');
        }
        const headerParts = headerLine.split(' ');
        const hardblank = headerParts[0][5];
        const height = parseInt(headerParts[1], 10);
        const baseline = parseInt(headerParts[2], 10);
        const maxLength = parseInt(headerParts[3], 10);
        const oldLayout = parseInt(headerParts[4], 10);
        const commentLines = parseInt(headerParts[5], 10);
        const printDirection = headerParts[6] ? parseInt(headerParts[6], 10) : 0;
        const fullLayout = headerParts[7] ? parseInt(headerParts[7], 10) : 0;
        const codeTagCount = headerParts[8] ? parseInt(headerParts[8], 10) : 0;
        // Skip comment lines (header + commentLines)
        let lineIndex = 1 + commentLines;
        const fontMap = {};
        let currentCharCode = 32; // Space character code
        let endCharacterMarker = '@'; // Default to @ as the end character marker
        // Define end character marker from the first character line
        if (lineIndex < lines.length) {
            endCharacterMarker = [...lines[lineIndex].replace(/[\r\n]+$/, '')].pop();
        }
        while (lineIndex < lines.length) {
            let line = lines[lineIndex];
            // Remove trailing \r\n characters
            line = line.replace(/[\r\n]+$/, '');
            // Skip empty lines
            if (line.trim() === '') {
                lineIndex++;
                continue;
            }
            // Check for codetag (special character definition)
            // Format: "codepoint  DESCRIPTION" or "0xXXXX  DESCRIPTION"
            let charCode = null;
            let hasMarker = line.charAt(line.length - 1) === endCharacterMarker;
            if (!hasMarker && (/^\d+\s+/.test(line) || /^0x[0-9A-Fa-f]+\s+/.test(line))) {
                const match = line.match(/^(0x[0-9A-Fa-f]+|\d+)\s+/);
                if (match) {
                    charCode = match[1].startsWith('0x')
                        ? parseInt(match[1].substring(2), 16)
                        : parseInt(match[1], 10);
                    lineIndex++;
                }
            }
            // If no codetag, use sequential ASCII order
            if (charCode === null) {
                charCode = currentCharCode;
                currentCharCode++;
            }
            // Read character lines (exactly height lines)
            const charLines = [];
            for (let i = 0; i < height && lineIndex < lines.length; i++) {
                let charLine = lines[lineIndex];
                // Remove trailing \r\n characters
                charLine = charLine.replace(/[\r\n]+$/, '');
                const endMarker = charLine.charAt(charLine.length - 1);
                // Remove all last character markers from the end
                // FLF format: each line ends with @/#.., last line of character ends with 2 of specified characters
                for (let endMarkersCount = 0; endMarkersCount < 2; endMarkersCount++) {
                    if (!charLine.endsWith(endMarker)) break;
                    charLine = charLine.slice(0, -endMarker.length);
                }
                charLines.push(charLine);
                lineIndex++;
            }
            // Store character
            fontMap[charCode] = charLines;
        }
        return {
            hardblank,
            height,
            baseline,
            maxLength,
            oldLayout,
            printDirection,
            fullLayout,
            codeTagCount,
            characters: fontMap,
            layout: this._parseLayout(oldLayout, fullLayout)
        };
    }

    /**
     * Parses the layout property of font
     * @param {number} oldLayout - The old layout
     * @param {number} fullLayout - The full layout
     * @returns {Object} - The parsed layout object
     */
    _parseLayout(oldLayout, fullLayout) {
        const hasBit = (value, bit) => (value & bit) !== 0;
        const flags = {
            horizontal: {
                rule1: false, // EQUAL CHARACTER SMUSHING
                rule2: false, // UNDERSCORE SMUSHING
                rule3: false, // HIERARCHY SMUSHING
                rule4: false, // OPPOSITE PAIR SMUSHING
                rule5: false, // BIG X SMUSHING
                rule6: false, // HARDBLANK SMUSHING
                kerning: false,
                smushing: false
            },
            vertical: {
                rule1: false, // EQUAL CHARACTER SMUSHING
                rule2: false, // UNDERSCORE SMUSHING
                rule3: false, // HIERARCHY SMUSHING
                rule4: false, // HORIZONTAL LINE SMUSHING
                rule5: false, // VERTICAL LINE SUPERSMUSHING
                kerning: false,
                smushing: false
            }
        };
        if (oldLayout === -1) {
            // full-width default
            // nothing enabled
        } else if (oldLayout === 0) {
            // kerning
            flags.horizontal.kerning = true;
        } else if (oldLayout > 0) {
            // controlled smushing
            flags.horizontal.smushing = true;
            flags.horizontal.rule1 = hasBit(oldLayout, 1);
            flags.horizontal.rule2 = hasBit(oldLayout, 2);
            flags.horizontal.rule3 = hasBit(oldLayout, 4);
            flags.horizontal.rule4 = hasBit(oldLayout, 8);
            flags.horizontal.rule5 = hasBit(oldLayout, 16);
            flags.horizontal.rule6 = hasBit(oldLayout, 32);
        }
        if (fullLayout !== 0) {
            // horizontal
            flags.horizontal.rule1 = hasBit(fullLayout, 1);
            flags.horizontal.rule2 = hasBit(fullLayout, 2);
            flags.horizontal.rule3 = hasBit(fullLayout, 4);
            flags.horizontal.rule4 = hasBit(fullLayout, 8);
            flags.horizontal.rule5 = hasBit(fullLayout, 16);
            flags.horizontal.rule6 = hasBit(fullLayout, 32);
            if (hasBit(fullLayout, 128)) {
                flags.horizontal.smushing = true;
                flags.horizontal.kerning = false; // smushing overrides kerning
            } else if (hasBit(fullLayout, 64)) {
                flags.horizontal.kerning = true;
            }
            // vertical
            flags.vertical.rule1 = hasBit(fullLayout, 256);
            flags.vertical.rule2 = hasBit(fullLayout, 512);
            flags.vertical.rule3 = hasBit(fullLayout, 1024);
            flags.vertical.rule4 = hasBit(fullLayout, 2048);
            flags.vertical.rule5 = hasBit(fullLayout, 4096);
            if (hasBit(fullLayout, 16384)) {
                flags.vertical.smushing = true;
                flags.vertical.kerning = false;
            } else if (hasBit(fullLayout, 8192)) {
                flags.vertical.kerning = true;
            }
        }
        return flags;
    }

}

export default FlfParser