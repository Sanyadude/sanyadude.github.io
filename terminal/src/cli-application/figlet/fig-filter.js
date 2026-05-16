import { HORIZONTAL_MIRROR_MAP, VERTICAL_MIRROR_MAP, BORDER_STYLES } from './config.js'

/**
 * FIGFilter - A class for filtering text in ASCII art
 */
export class FIGFilter {
    /**
     * Applies the horizontal mirroring to lines of text
     * @param {string[]} lines - The lines of text
     * @returns {string[]} - The flipped lines
     */
    flipHorizontalFilter(lines) {
        return lines.map(line => {
            let flippedLine = '';
            for (let i = line.length - 1; i >= 0; i--) {
                if (HORIZONTAL_MIRROR_MAP[line[i]]) {
                    flippedLine += HORIZONTAL_MIRROR_MAP[line[i]];
                    continue;
                }
                flippedLine += line[i];
            }
            return flippedLine;
        });
    }

    /**
     * Applies the vertical mirroring to lines of text
     * @param {string[]} lines - The lines of text
     * @returns {string[]} - The flipped lines
     */
    flipVerticalFilter(lines) {
        return lines.reverse().map(line => {
            let flippedLine = '';
            for (let i = 0; i < line.length; i++) {
                if (VERTICAL_MIRROR_MAP[line[i]]) {
                    flippedLine += VERTICAL_MIRROR_MAP[line[i]];
                    continue;
                }
                flippedLine += line[i];
            }
            return flippedLine;
        });
    }

    /**
     * Crops all blanks around the text
     * @param {string[]} lines - The lines of text
     * @returns {string[]} - The cropped lines
     */
    cropFilter(lines) {
        if (!lines || lines.length === 0) return lines;
        let top = 0;
        while (top < lines.length && lines[top].trim() === '') {
            top++;
        }
        let bottom = lines.length - 1;
        while (bottom >= top && lines[bottom].trim() === '') {
            bottom--;
        }
        if (top > bottom) return [];
        const croppedLines = lines.slice(top, bottom + 1);
        // Find first and last non-space columns
        let left = null;
        let right = null;
        for (const line of croppedLines) {
            for (let i = 0; i < line.length; i++) {
                if (line[i] === ' ') continue;
                if (left === null || i < left) left = i;
                if (right === null || i > right) right = i;
            }
        }
        if (left === null) return [];
        return croppedLines.map(line =>
            line.slice(left, right + 1)
        );
    }

    /**
     * Adds padding around text lines
     * @param {string[]} lines - The lines of text
     * @param {number} padding - The padding (horizontal = padding, vertical = padding/2)
     * @returns {string[]} - The lines with padding
     */
    paddingFilter(lines, padding = 0) {
        const verticalPadding = Math.floor(padding / 2);
        const width = lines[0] ? lines[0].length : 0;
        const paddedWidth = width + padding * 2;
        const outputLines = [];
        for (let i = 0; i < verticalPadding; i++) {
            outputLines.push(' '.repeat(paddedWidth));
        }
        for (const line of lines) {
            outputLines.push(' '.repeat(padding) + line + ' '.repeat(padding));
        }
        for (let i = 0; i < verticalPadding; i++) {
            outputLines.push(' '.repeat(paddedWidth));
        }
        return outputLines;
    }

    /**
     * Adds a border around text lines
     * @param {string[]} lines - The lines of text
     * @param {string} style - The style of the border (single, double, rounded, ascii, none)
     * @param {number} padding - The padding of the border
     * @returns {string[]} - The lines with the border
     */
    borderFilter(lines, style = 'single', padding = 0) {
        const borderStyle = Object.keys(BORDER_STYLES).includes(style) ? BORDER_STYLES[style] : BORDER_STYLES.single;
        const width = lines[0] ? lines[0].length : 0;
        const paddedWidth = width + padding * 2;
        const top = borderStyle.topLeft + borderStyle.horizontal.repeat(paddedWidth) + borderStyle.topRight;
        const outputLines = [];
        if (top) {
            outputLines.push(top);
        }
        for (let i = 0; i < padding; i++) {
            outputLines.push(borderStyle.vertical + ' '.repeat(paddedWidth) + borderStyle.vertical);
        }
        for (const line of lines) {
            outputLines.push(
                borderStyle.vertical +
                ' '.repeat(padding) +
                line +
                ' '.repeat(padding) +
                borderStyle.vertical
            );
        }
        for (let i = 0; i < padding; i++) {
            outputLines.push(borderStyle.vertical + ' '.repeat(paddedWidth) + borderStyle.vertical);
        }
        const bottom = borderStyle.bottomLeft + borderStyle.horizontal.repeat(paddedWidth) + borderStyle.bottomRight;
        if (bottom) {
            outputLines.push(bottom);
        }
        return outputLines;
    }

    /**
     * Applies a color filter to lines of text using a discrete set of ANSI colors
     * @param {string[]} lines - The lines of text
     * @param {Array<Array<number>>} colors - Array of RGB arrays defining the gradient stops, e.g., [[255,0,0], [255,255,0], [0,0,255]]
     * @param {number} frequency - How fast colors cycle
     * @param {number} angle - Angle of the rainbow in degrees
     * @returns {string[]} - Rainbow-colored lines
     */
    colorFilter(lines, colors, frequency = 1, angle = 45) {
        const numColors = colors.length;
        const radians = angle * Math.PI / 180;
        const dx = Math.cos(radians);
        const dy = Math.sin(radians);
        const outputLines = [];
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            let outputLine = '';
            for (let x = 0; x < line.length; x++) {
                const character = line[x];
                if (character === ' ') {
                    outputLine += character;
                    continue;
                }
                const position = x * dx + y * dy;
                const index = Math.floor(position * frequency) % numColors;
                const [red, green, blue] = colors[(index + numColors) % numColors];
                outputLine += `\x1b[38;2;${red};${green};${blue}m${character}`;
            }
            outputLine += '\x1b[0m';
            outputLines.push(outputLine);
        }
        return outputLines;
    }

    /**
     * Applies a gradient color filter to lines of text
     * @param {string[]} lines - The lines of text
     * @param {Array<Array<number>>} colors - Array of RGB arrays defining the gradient stops, e.g., [[255,0,0], [255,255,0], [0,0,255]]
     * @param {number} frequency - Frequency of sine wave modulation
     * @param {number} angle - Angle in degrees for directional gradient
     * @returns {string[]} - The filtered lines
     */
    gradientFilter(lines, colors, frequency = 1, angle = 45) {
        const radians = angle * Math.PI / 180;
        const dx = Math.cos(radians);
        const dy = Math.sin(radians);
        const lerpColor = (color1, color2, factor) => {
            return [
                Math.round(color1[0] + (color2[0] - color1[0]) * factor),
                Math.round(color1[1] + (color2[1] - color1[1]) * factor),
                Math.round(color1[2] + (color2[2] - color1[2]) * factor)
            ];
        }
        const getGradientColor = (factor) => {
            const numberOfSegments = colors.length - 1;
            const index = Math.min(Math.floor(factor * numberOfSegments), numberOfSegments - 1);
            const localFactor = (factor * numberOfSegments) - index;
            return lerpColor(colors[index], colors[index + 1], localFactor);
        }
        const outputLines = [];
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            let outputLine = '';
            for (let x = 0; x < line.length; x++) {
                const character = line[x];
                if (character === ' ') {
                    outputLine += character;
                    continue;
                }
                const position = x * dx + y * dy;
                const factor = (Math.sin(position * frequency) + 1) / 2; // normalized 0-1
                const [red, green, blue] = getGradientColor(factor);
                outputLine += `\x1b[38;2;${red};${green};${blue}m${character}`;
            }
            outputLine += '\x1b[0m';
            outputLines.push(outputLine);
        }
        return outputLines;
    }
}

export default FIGFilter