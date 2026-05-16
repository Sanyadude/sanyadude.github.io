/**
 * FIGTransformer - A class for transforming text to ASCII art like figlet does
 */
export class FIGTransformer {
    /**
     * Creates a new FIGTransformer instance
     */
    constructor(options = {}) {
        this._defaultWidth = options.defaultWidth || 0;
        this._defaultCharacterCode = options.defaultCharacterCode || 0;
    }
    /**
     * Transforms given text into ASCII art based on font configuration and options
     * @param {string} text - The text to transform
     * @param {object} font - The font configuration
     * @param {object} transformOptions - The options object
     * @returns {string} - The ASCII art text
     */
    transform(text, font, transformOptions = {}) {
        if (!text || text.length === 0) return [];
        const defaultOptions = {
            width: null,
            layout: null,
            direction: null,
            justification: null,
        };
        const options = Object.assign({}, defaultOptions, transformOptions);
        const maxWidth = this._getMaxWidth(options.width);
        const width = this._getWidth(options.width);
        const horizontalLayout = this._getHorizontalLayout(font, options.layout);
        const verticalLayout = this._getVerticalLayout(font, options.layout);
        const direction = this._getDirection(font, options.direction);
        const figLines = [];
        const textLines = text.split('\n');
        for (let textLine of textLines) {
            figLines.push(this._getNewFigLine(font));
            for (let i = 0; i < textLine.length; i++) {
                const characterCode = textLine.charCodeAt(i);
                const figCharacter = this._getFigCharacter(characterCode, font);
                if (!figCharacter || figCharacter.length === 0) continue;
                let currentFigLine = figLines[figLines.length - 1];
                const shouldBreakLine = this._shouldWrapLine(currentFigLine, figCharacter, direction, maxWidth, horizontalLayout);
                if (shouldBreakLine) {
                    figLines.push(this._getNewFigLine(font));
                    currentFigLine = figLines[figLines.length - 1];
                }
                if (horizontalLayout.kerning || horizontalLayout.smushing) {
                    this._applyHorizontalKerning(currentFigLine, figCharacter, direction);
                }
                this._applyHorizontalSmushing(currentFigLine, figCharacter, direction, font, horizontalLayout);
            }
        }
        this._replaceHardblank(figLines, font);
        const justification = this._getJustification(direction, options.justification);
        this._alignLines(figLines, justification, width);
        this._applyVerticalKerning(figLines, verticalLayout);
        this._applyVerticalSmushing(figLines, verticalLayout);
        return figLines;
    }

    /**
     * Gets maximum width which can be used for wrapping
     * @param {number} width - The width
     * @returns {number} - The width
     */
    _getMaxWidth(width = null) {
        return width && !isNaN(width) ? Number(width) : this._defaultWidth;
    }

    /**
     * Gets the width based on the options (can be null if not provided)
     * @param {number} width - The width
     * @returns {number} - The width
     */
    _getWidth(width = null) {
        return width && !isNaN(width) ? Number(width) : null;
    }

    /**
     * Gets the direction based on the print direction and options
     * @param {object} font - The font object
     * @param {string} direction - The direction ('ltr' or 'rtl' or null)
     * @returns {number} - The direction (0: left to right, 1: right to left)
     */
    _getDirection(font, direction = null) {
        return (direction === 'rtl' || (direction !== 'ltr' && font.printDirection === 1)) ? 1 : 0;
    }

    /**
     * Gets the justification based on the options and direction
     * @param {number} direction - The direction (0: left to right, 1: right to left)
     * @param {string} justificationType - The justification type ('left', 'center', 'right' or null)
     * @returns {number} - The justification (0: left, 1: center, 2: right)
     */
    _getJustification(direction, justificationType = null) {
        let justification = direction === 1 ? 2 : 0;
        if (justificationType === 'left') {
            justification = 0;
        } else if (justificationType === 'center') {
            justification = 1;
        } else if (justificationType === 'right') {
            justification = 2;
        }
        return justification;
    }

    /**
     * Gets the horizontal layout based on the full layout
     * @param {object} font - The font object
     * @param {string} layoutType - The layout type (smushing, kerning, full-width)
     * @returns {Object} - The horizontal layout object
     */
    _getHorizontalLayout(font, layoutType = null) {
        const layoutOptions = Object.assign({}, font.layout.horizontal);
        if (layoutType === 'smushing') {
            layoutOptions.kerning = true;
            layoutOptions.smushing = true;
        }
        if (layoutType === 'kerning') {
            layoutOptions.kerning = true;
            layoutOptions.smushing = false;
        }
        if (layoutType === 'full-width') {
            layoutOptions.kerning = false;
            layoutOptions.smushing = false;
        }
        return layoutOptions;
    }

    /**
     * Gets the vertical layout based on the full layout
     * @param {object} font - The font object
     * @param {string} layoutType - The layout type (smushing, kerning, full-width)
     * @returns {Object} - The vertical layout object
     */
    _getVerticalLayout(font, layoutType = null) {
        return Object.assign({}, font.layout.vertical);
    }

    /**
     * Gets the FIG character based on the character code and font
     * @param {number} characterCode - The character code
     * @param {object} font - The font object
     * @returns {string[]} - The FIG character
     */
    _getFigCharacter(characterCode, font) {
        return (font.characters[characterCode] || font.characters[this._defaultCharacterCode]).slice(); // Use space if character not found
    }

    /**
     * Gets the new lines based on the font height
     * @param {object} font - The font object
     * @returns {string[]} - The new lines
     */
    _getNewFigLine(font) {
        return Array(font.height).fill('');
    }

    /**
     * Checks if the line should be wrapped
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The direction (0: left to right, 1: right to left)
     * @param {number} maxWidth - The maximum width
     * @param {object} horizontalLayout - The horizontal layout object
     * @returns {boolean} - True if the line should be wrapped, false otherwise
     */
    _shouldWrapLine(figLine, figCharacter, direction, maxWidth, horizontalLayout) {
        const spaces = (horizontalLayout.kerning || horizontalLayout.smushing)
            ? this._calculateHorizontalKerningSpaces(figLine, figCharacter, direction)
            : 0;
        const fullWidth = figLine[0].length + figCharacter[0].length - spaces;
        return figLine[0].length > 0 && fullWidth > maxWidth;
    }

    /**
     * Calculates the minimum number of spaces to trim from the end of the FIG line and beginning of the FIG character
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The text direction (0: left to right, 1: right to left)
     * @returns {number} - The minimum number of spaces to trim
     */
    _calculateHorizontalKerningSpaces(figLine, figCharacter, direction = 0) {
        const spaceCounts = [];
        for (let i = 0; i < figLine.length; i++) {
            let lineCount = 0;
            let characterCount = 0;
            if (direction === 0) {
                for (let j = figLine[i].length - 1; j >= 0; j--) {
                    if (figLine[i][j] !== ' ') break;
                    lineCount++;
                }
                for (let j = 0; j < figCharacter[i].length; j++) {
                    if (figCharacter[i][j] !== ' ') break;
                    characterCount++;
                }
            } else {
                for (let j = 0; j < figLine[i].length; j++) {
                    if (figLine[i][j] !== ' ') break;
                    lineCount++;
                }
                for (let j = figCharacter[i].length - 1; j >= 0; j--) {
                    if (figCharacter[i][j] !== ' ') break;
                    characterCount++;
                }
            }
            spaceCounts.push(lineCount + characterCount);
        }
        return Math.min(...spaceCounts);
    }

    /**
     * Trims spaces from the end of FIG line and beginning of FIG character
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The text direction (0: left to right, 1: right to left)
     */
    _applyHorizontalKerning(figLine, figCharacter, direction = 0) {
        const spaces = this._calculateHorizontalKerningSpaces(figLine, figCharacter, direction);
        if (spaces === 0) return;
        for (let i = 0; i < figLine.length; i++) {
            if (direction === 0) {
                const lineTrim = Math.min(spaces, figLine[i].match(/ *$/)[0].length);
                const characterTrim = spaces - lineTrim;
                if (lineTrim > 0) {
                    figLine[i] = figLine[i].slice(0, -lineTrim);
                }
                if (characterTrim > 0) {
                    figCharacter[i] = figCharacter[i].slice(characterTrim);
                }
            } else {
                const lineTrim = Math.min(spaces, figLine[i].match(/^ */)[0].length);
                const characterTrim = spaces - lineTrim;
                if (lineTrim > 0) {
                    figLine[i] = figLine[i].slice(lineTrim);
                }
                if (characterTrim > 0) {
                    figCharacter[i] = figCharacter[i].slice(0, figCharacter[i].length - characterTrim);
                }
            }
        }
    }

    /**
     * If smushing is enabled, applies smushing on kerned FIG lines and FIG characters, otherwise adds FIG lines and FIG characters without smushing
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The text direction (0: left to right, 1: right to left)
     * @param {object} font - The font object
     * @param {object} layoutOptions - The layout options object
     */
    _applyHorizontalSmushing(figLine, figCharacter, direction, font, layoutOptions) {
        let smushable = this._isHorizontalSmushable(figLine, figCharacter, direction, font.hardblank, layoutOptions);
        if (smushable) {
            this._smushLinesHorizontal(figLine, figCharacter, direction, font.hardblank, layoutOptions);
            return;
        }
        this._addLinesHorizontal(figLine, figCharacter, direction);
    }

    /**
     * Checks if FIG lines and FIG characters are smushable
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The text direction (0: left to right, 1: right to left)
     * @param {string} hardblank - The hardblank character
     * @param {object} layoutOptions - The layout options object
     * @returns {boolean} - True if FIG lines and FIG characters are smushable, false otherwise
     */
    _isHorizontalSmushable(figLine, figCharacter, direction, hardblank, layoutOptions) {
        if (!layoutOptions.smushing) return false;
        for (let i = 0; i < figLine.length; i++) {
            if (figLine[i].length === 0 || figCharacter[i].length === 0) return false;
            let leftIsHardblank, rightIsHardblank;
            if (direction === 0) {
                leftIsHardblank = figLine[i].endsWith(hardblank);
                rightIsHardblank = figCharacter[i].startsWith(hardblank);
            } else {
                leftIsHardblank = figLine[i].startsWith(hardblank);
                rightIsHardblank = figCharacter[i].endsWith(hardblank);
            }
            if ((leftIsHardblank || rightIsHardblank) && !(leftIsHardblank && rightIsHardblank && layoutOptions.rule6)) return false;
        }
        return true;
    }

    /**
     * Smushes FIG lines and FIG characters horizontally
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The text direction (0: left to right, 1: right to left)
     * @param {string} hardblank - The hardblank character
     * @param {object} layoutOptions - The layout options object
     */
    _smushLinesHorizontal(figLine, figCharacter, direction, hardblank, layoutOptions) {
        for (let i = 0; i < figLine.length; i++) {
            let leftCharacter, rightCharacter;
            if (direction === 0) {
                leftCharacter = figLine[i].slice(-1);
                rightCharacter = figCharacter[i][0];
                const smushedCharacter = this._smushCharactersHorizontal(leftCharacter, rightCharacter, hardblank, layoutOptions);
                figLine[i] = figLine[i].slice(0, -1);
                figCharacter[i] = figCharacter[i].slice(1);
                figLine[i] = figLine[i] + smushedCharacter + figCharacter[i];
            } else {
                leftCharacter = figLine[i][0];
                rightCharacter = figCharacter[i].slice(-1);
                const smushedCharacter = this._smushCharactersHorizontal(leftCharacter, rightCharacter, hardblank, layoutOptions);
                figLine[i] = figLine[i].slice(1);
                figCharacter[i] = figCharacter[i].slice(0, -1);
                figLine[i] = figCharacter[i] + smushedCharacter + figLine[i];
            }
        }
    }

    /**
     * Smushes two characters based on the smushing rules
     * @param {string} leftCharacter - The left character
     * @param {string} rightCharacter - The right character
     * @param {string} hardblank - The hardblank character
     * @param {object} layoutOptions - The layout options object
     * @returns {string} - The smushed character
     */
    _smushCharactersHorizontal(leftCharacter, rightCharacter, hardblank, layoutOptions) {
        // SPACE SMUSHING
        if (leftCharacter === ' ') return rightCharacter;
        if (rightCharacter === ' ') return leftCharacter;
        // 1. EQUAL CHARACTER SMUSHING - CODE 1
        if (layoutOptions.rule1 && leftCharacter === rightCharacter && leftCharacter !== hardblank) return leftCharacter;
        // 2. UNDERSCORE SMUSHING - CODE 2
        const underscoreSet = '|/\\[]{}()<>';
        if (layoutOptions.rule2 && leftCharacter === '_' && underscoreSet.includes(rightCharacter)) return rightCharacter;
        if (layoutOptions.rule2 && rightCharacter === '_' && underscoreSet.includes(leftCharacter)) return leftCharacter;
        // 3. HIERARCHY SMUSHING - CODE 4
        const findClass = (character) => {
            if (character === '|') return 1;
            if (character === '/' || character === '\\') return 2;
            if (character === '[' || character === ']') return 3;
            if (character === '{' || character === '}') return 4;
            if (character === '(' || character === ')') return 5;
            if (character === '<' || character === '>') return 6;
            return 0;
        }
        const leftCharacterClass = findClass(leftCharacter);
        const rightCharacterClass = findClass(rightCharacter);
        if (layoutOptions.rule3 && leftCharacterClass > rightCharacterClass) return leftCharacter;
        if (layoutOptions.rule3 && rightCharacterClass > leftCharacterClass) return rightCharacter;
        // 4. OPPOSITE PAIR SMUSHING - CODE 8
        if (layoutOptions.rule4 && ((leftCharacter === '[' && rightCharacter === ']') || (leftCharacter === ']' && rightCharacter === '['))) return '|';
        if (layoutOptions.rule4 && ((leftCharacter === '{' && rightCharacter === '}') || (leftCharacter === '}' && rightCharacter === '{'))) return '|';
        if (layoutOptions.rule4 && ((leftCharacter === '(' && rightCharacter === ')') || (leftCharacter === ')' && rightCharacter === '('))) return '|';
        // 5. BIG X SMUSHING - CODE 16
        if (layoutOptions.rule5 && leftCharacter === '/' && rightCharacter === '\\') return '|';
        if (layoutOptions.rule5 && leftCharacter === '\\' && rightCharacter === '/') return 'Y';
        if (layoutOptions.rule5 && leftCharacter === '>' && rightCharacter === '<') return 'X';
        // 6. HARDBLANK SMUSHING - CODE 32
        if (layoutOptions.rule6 && leftCharacter === hardblank && rightCharacter === hardblank) return hardblank;
        // UNIVERSAL SMUSHING
        return leftCharacter;
    }

    /**
     * Adds FIG lines and FIG characters without smushing
     * @param {string[]} figLine - Lines of current FIG line
     * @param {string[]} figCharacter - Lines of current FIG character
     * @param {number} direction - The text direction (0: left to right, 1: right to left)
     */
    _addLinesHorizontal(figLine, figCharacter, direction) {
        for (let i = 0; i < figLine.length; i++) {
            if (direction === 0) {
                figLine[i] = figLine[i] + figCharacter[i];
            } else {
                figLine[i] = figCharacter[i] + figLine[i];
            }
        }
    }

    /**
     * Replaces the hardblank with space in the FIG lines
     * @param {string[][]} figLines - The lines of FIG text
     * @param {object} font - The font object
     */
    _replaceHardblank(figLines, font) {
        for (let i = 0; i < figLines.length; i++) {
            for (let j = 0; j < figLines[i].length; j++) {
                figLines[i][j] = figLines[i][j].replaceAll(font.hardblank, ' ');
            }
        }
    }

    /**
     * Aligns FIG lines to the specified width
     * @param {string[][]} figLines - The lines of FIG text
     * @param {number} justification - The justification (0: left, 1: center, 2: right)
     * @param {number} width - The width of lines (if not provided, the width of the first FIG line is used)
     */
    _alignLines(figLines, justification, width = null) {
        if (figLines.length === 0) return;
        const maxWidth = width != null ? width : Math.max(...figLines.flatMap(figLine => figLine.map(line => line.length)));
        for (let i = 0; i < figLines.length; i++) {
            for (let j = 0; j < figLines[i].length; j++) {
                const line = figLines[i][j];
                const padding = maxWidth - line.length;
                if (padding <= 0) continue;
                let leftPadding = 0;
                let rightPadding = 0;
                if (justification === 1) {
                    leftPadding = Math.floor(padding / 2);
                    rightPadding = padding - leftPadding;
                } else if (justification === 2) {
                    leftPadding = padding;
                } else {
                    rightPadding = padding;
                }
                figLines[i][j] = ' '.repeat(leftPadding) + line + ' '.repeat(rightPadding);
            }
        }
    }

    /**
     * Applies the vertical kerning to the rows
     * @param {string[][]} figLines - The lines of FIG text
     * @param {object} layoutOptions - The layout options object
     */
    _applyVerticalKerning(figLines, layoutOptions) {
        if (!layoutOptions.kerning && !layoutOptions.smushing) return;
        if (figLines.length === 0) return;
        let topTrim = figLines[0].length;
        let bottomTrim = figLines[0].length;
        for (let i = 0; i < figLines.length; i++) {
            const line = figLines[i];
            let top = 0;
            let bottom = line.length - 1;
            while (top <= bottom && line[top].trim() === '') {
                top++;
            }
            while (bottom >= top && line[bottom].trim() === '') {
                bottom--;
            }
            topTrim = Math.min(topTrim, top);
            bottomTrim = Math.min(bottomTrim, line.length - 1 - bottom);
        }
        for (let i = 0; i < figLines.length; i++) {
            figLines[i] = figLines[i].slice(topTrim, figLines[i].length - bottomTrim);
        }
    }

    /**
     * If smushing is enabled, applies vertical smushing
     * @param {string[][]} figLines - The lines of FIG text
     * @param {object} layoutOptions - The layout options object
     */
    _applyVerticalSmushing(figLines, layoutOptions) {
        for (let i = 0; i < figLines.length; i++) {
            let topLines = figLines[i];
            let bottomLines = figLines[i + 1];
            if (!bottomLines) continue;
            const smushable = this._isVerticalSmushable(topLines, bottomLines, layoutOptions);
            if (!smushable) continue;
            const topLine = topLines[topLines.length - 1];
            const bottomLine = bottomLines[0];
            const maxLength = Math.max(topLine.length, bottomLine.length);
            let smushedLine = '';
            for (let charIndex = 0; charIndex < maxLength; charIndex++) {
                const topCharacter = topLine[charIndex] || ' ';
                const bottomCharacter = bottomLine[charIndex] || ' ';
                const smushedCharacter = this._smushCharactersVertical(topCharacter, bottomCharacter, layoutOptions);
                smushedLine += smushedCharacter;
            }
            topLines[topLines.length - 1] = smushedLine;
            bottomLines.shift();
        }
    }

    /**
     * Checks if FIG lines are smushable
     * @param {string[]} topLines - Lines of current top FIG line
     * @param {string[]} bottomLines - Lines of current bottom FIG line
     * @param {object} layoutOptions - The layout options object
     * @returns {boolean} - True if FIG lines are smushable, false otherwise
     */
    _isVerticalSmushable(topLines, bottomLines, layoutOptions) {
        if (!layoutOptions.smushing) return false;
        return true;
    }

    /**
     * Smushes two characters based on the smushing rules
     * @param {string} topCharacter - The top character
     * @param {string} bottomCharacter - The bottom character
     * @param {object} layoutOptions - The layout options object
     * @returns {string} - The smushed character
     */
    _smushCharactersVertical(topCharacter, bottomCharacter, layoutOptions) {
        // SPACE SMUSHING
        if (topCharacter === ' ') return bottomCharacter;
        if (bottomCharacter === ' ') return topCharacter;
        // 1. EQUAL CHARACTER SMUSHING - CODE 256
        if (layoutOptions.rule1 && topCharacter === bottomCharacter) return topCharacter;
        // 2. UNDERSCORE SMUSHING - CODE 512
        const underscoreSet = '|/\\[]{}()<>';
        if (layoutOptions.rule2 && topCharacter === '_' && underscoreSet.includes(bottomCharacter)) return bottomCharacter;
        if (layoutOptions.rule2 && bottomCharacter === '_' && underscoreSet.includes(topCharacter)) return topCharacter;
        // 3. HIERARCHY SMUSHING - CODE 1024
        const findClass = (character) => {
            if (character === '|') return 1;
            if (character === '/' || character === '\\') return 2;
            if (character === '[' || character === ']') return 3;
            if (character === '{' || character === '}') return 4;
            if (character === '(' || character === ')') return 5;
            if (character === '<' || character === '>') return 6;
            return 0;
        }
        const topCharacterClass = findClass(topCharacter);
        const bottomCharacterClass = findClass(bottomCharacter);
        if (layoutOptions.rule3 && topCharacterClass > bottomCharacterClass) return topCharacter;
        if (layoutOptions.rule3 && bottomCharacterClass > topCharacterClass) return bottomCharacter;
        // HORIZONTAL LINE SMUSHING - CODE 2048
        if (layoutOptions.rule4 && ((topCharacter === '-' && bottomCharacter === '_') || (topCharacter === '_' && bottomCharacter === '-'))) return '=';
        // VERTICAL LINE SUPERSMUSHING - CODE 4096
        if (layoutOptions.rule5 && topCharacter === '|' && bottomCharacter === '|') return '|';
        // UNIVERSAL SMUSHING
        return topCharacter;
    }
}

export default FIGTransformer