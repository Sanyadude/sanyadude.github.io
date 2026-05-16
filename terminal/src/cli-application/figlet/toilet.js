import { BrowserAPI } from '../../core/core.js'
import { Application } from '../../system/application/application.js'
import { TOILET_MANIFEST } from './toilet-manifest.js'
import { FlfParser } from './flf-parser.js'
import { TlfParser } from './tlf-parser.js'
import { FIGTransformer } from './fig-transformer.js'
import { FIGFilter } from './fig-filter.js'
import { FONTS } from './fonts.js'
import { DEFAULT_FONT_NAME, DEFAULT_WIDTH, DEFAULT_CHARACTER_CODE } from './config.js'

/**
 * Toilet - Application for transforming text into ASCII art using fonts and additional filters
 * @extends {Application}
 */
export class Toilet extends Application {
    /**
     * Creates a new Toilet instance
     */
    constructor() {
        super('toilet', TOILET_MANIFEST);
        this._flfParser = new FlfParser();
        this._tlfParser = new TlfParser();
        this._figTransformer = new FIGTransformer({
            defaultWidth: DEFAULT_WIDTH,
            defaultCharacterCode: DEFAULT_CHARACTER_CODE,
        });
        this._figFilter = new FIGFilter();
        this._fontCache = {};
        this._fontFilesPath = './fonts';
    }

    /**
     * Executes the `toilet` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the toilet command execution
     */
    async main(commandLine, context) {
        const options = commandLine.getOptions();
        const fonts = this._getFonts();
        if (options['list']) {
            return Object.keys(fonts).join(',');
        }
        if (options['filter'] && options['filter'] == 'list') {
            return ['flip', 'flop', '180', 'crop',
                'padding', 'padding-[number]',
                'border', 'border-[single|double|rounded|ascii|none]',
                'metal', 'gay', 'rainbow', 'fire', 'gold', 'matrix', 'neon', 'pastel', 'rgb',
            ].join(',');
        }
        const fontName = Object.keys(fonts).includes(options['font']) ? options['font'] : DEFAULT_FONT_NAME;
        const font = await this._getFont(fontName);
        const args = commandLine.getArguments();
        const message = args.length === 0
            ? commandLine.getStdin()
            : args.join(' ');
        const plainText = message.replace(/\x1b\[[0-9;]+m/g, '');
        return this._transformText(plainText, font, options, context);
    }

    /**
     * Gets a font, loading and parsing if necessary
     * @param {string} fontName - The font name
     * @returns {Promise<Object>} - The parsed font object
     */
    async _getFont(fontName) {
        if (this._fontCache[fontName]) return this._fontCache[fontName];
        const fileName = this._getFonts()[fontName].filename;
        const fontType = fileName.split('.').pop();
        const fontFile = await this._loadFont(fileName);
        const font = this._parseFont(fontFile, fontType);
        this._fontCache[fontName] = font;
        return font;
    }

    /**
     * Loads the font
     * @param {string} fileName - The font name
     * @returns {Promise<string>} - The font file content
     */
    async _loadFont(fileName) {
        const path = `${this._fontFilesPath}/${fileName}`;
        const response = await BrowserAPI.loadFile(new URL(path, import.meta.url));
        return new TextDecoder().decode(response);
    }

    /**
     * Gets all available fonts
     * @returns {Object} - The available fonts
     */
    _getFonts() {
        return FONTS;
    }

    /**
     * Parses the font file based on the type
     * @param {string} fontFile - The font file content
     * @param {string} fontType - The font type
     * @returns {Object} - The parsed font object
     */
    _parseFont(fontFile, fontType) {
        switch (fontType) {
            case 'flf':
                return this._flfParser.parse(fontFile);
            case 'tlf':
                return this._tlfParser.parse(fontFile);
            default:
                throw new Error('Invalid font type');
        }
    }

    /**
     * Transforms given text into ASCII art based on font configuration and options
     * @param {string} text - The text to transform
     * @param {object} font - The font configuration
     * @param {object} options - The options object
     * @param {object} context - The context of the command execution
     * @returns {string} - The ASCII art text
     */
    _transformText(text, font, options = {}, context = {}) {
        const transformOptions = {
            width: this._getWidth(options, context),
            layout: this._getLayout(options),
            direction: this._getDirection(options),
            justification: this._getJustification(options),
        };
        const figLines = this._figTransformer.transform(text, font, transformOptions);
        const lines = this._figLinesToLines(figLines);
        return this._applyFilters(lines, options).join('\n');
    }

    /**
     * Gets the width based on the options (can be null if not provided)
     * @param {object} options - The options object
     * @param {object} context - The context of the command execution
     * @returns {number} - The width
     */
    _getWidth(options = {}, context = {}) {
        if (options['terminal'] && context.terminal) {
            return context.terminal.getSize().columns;
        }
        return options['width'] && !isNaN(options['width']) ? Number(options['width']) : null;
    }

    /**
     * Gets the layout based on the options (can be null if not provided)
     * @param {object} options - The options object
     * @returns {number} - The width
     */
    _getLayout(options = {}) {
        let layout = null;
        if (options['smushing']) {
            layout = 'smushing';
        } else if (options['kerning']) {
            layout = 'kerning';
        } else if (options['full-width']) {
            layout = 'full-width';
        }
        return layout;
    }

    /**
     * Gets the direction based on the options
     * @param {object} options - The options object
     * @returns {string} - The direction ('ltr' or 'rtl')
     */
    _getDirection(options = {}) {
        let direction = null;
        if (options['right-to-left']) {
            direction = 'rtl';
        }
        if (options['left-to-right']) {
            direction = 'ltr';
        }
        return direction;
    }

    /**
     * Gets the justification based on the options
     * @param {object} options - The options object
     * @returns {string} - The justification ('left', 'center', 'right')
     */
    _getJustification(options = {}) {
        let justification = null;
        if (options['left']) {
            justification = 'left';
        } else if (options['center']) {
            justification = 'center';
        } else if (options['right']) {
            justification = 'right';
        }
        return justification;
    }

    /**
     * Converts FIG lines to lines
     * @param {string[][]} figLines - The lines of FIG text
     * @returns {string[]} - The lines containing FIG sub-characters
     */
    _figLinesToLines(figLines) {
        const lines = [];
        for (let i = 0; i < figLines.length; i++) {
            for (const line of figLines[i]) {
                lines.push(line);
            }
        }
        return lines;
    }

    /**
     * Applies the filters to the lines
     * @param {string[]} lines - The lines of text
     * @param {object} options - The options object
     * @returns {string[]} - The lines after the filters are applied
     */
    _applyFilters(lines, options = {}) {
        const filters = options['filter'] ? options['filter'].split(':') : [];
        if (filters.includes('flip')) {
            lines = this._figFilter.flipHorizontalFilter(lines);
        }
        if (filters.includes('flop')) {
            lines = this._figFilter.flipVerticalFilter(lines);
        }
        if (filters.includes('180')) {
            lines = this._figFilter.flipHorizontalFilter(lines);
            lines = this._figFilter.flipVerticalFilter(lines);
        }
        if (filters.includes('crop')) {
            lines = this._figFilter.cropFilter(lines);
        }
        const paddingFilter = filters.find(filter => filter.startsWith('padding'));
        if (paddingFilter) {
            const padding = Number(paddingFilter.split('-')[1]) || 1;
            lines = this._figFilter.paddingFilter(lines, padding);
        }
        const borderFilter = filters.find(filter => filter.startsWith('border'));
        if (borderFilter) {
            const borderStyle = borderFilter.split('-')[1] || 'single';
            lines = this._figFilter.borderFilter(lines, borderStyle);
        }
        if (options['metal'] || filters.includes('metal')) {
            const METAL_COLORS = [
                [60, 80, 100],
                [120, 140, 160],
                [200, 220, 240]
            ]
            return this._figFilter.gradientFilter(lines, METAL_COLORS, 0.25);
        }
        if (options['rainbow'] || options['gay'] || filters.includes('rainbow') || filters.includes('gay')) {
            const RAINBOW_COLORS = [
                [255, 0, 0],
                [255, 255, 0],
                [0, 255, 0],
                [0, 255, 255],
                [0, 0, 255],
                [255, 0, 255]
            ]
            return this._figFilter.colorFilter(lines, RAINBOW_COLORS);
        }
        if (filters.includes('fire')) {
            const FIRE_COLORS = [
                [125, 0, 0],
                [250, 80, 0],
                [250, 200, 0]
            ];
            return this._figFilter.gradientFilter(lines, FIRE_COLORS, 0.5, 90);
        }
        if (filters.includes('gold')) {
            const GOLD_COLORS = [
                [120, 90, 20],
                [180, 140, 40],
                [255, 215, 0]
            ];
            return this._figFilter.gradientFilter(lines, GOLD_COLORS, 0.25);
        }
        if (filters.includes('matrix')) {
            const MATRIX_COLORS = [
                [0, 120, 0],
                [0, 220, 60]
            ];
            return this._figFilter.colorFilter(lines, MATRIX_COLORS, 0.25, 90);
        }
        if (filters.includes('neon')) {
            const NEON_COLORS = [
                [255, 20, 147],
                [0, 255, 255],
                [0, 255, 0],
                [255, 255, 0]
            ];
            return this._figFilter.colorFilter(lines, NEON_COLORS, 0.25);
        }
        if (filters.includes('pastel')) {
            const PASTEL_COLORS = [
                [255, 179, 186],
                [255, 223, 186],
                [255, 255, 186],
                [186, 255, 201],
                [186, 225, 255]
            ];
            return this._figFilter.colorFilter(lines, PASTEL_COLORS, 0.25);
        }
        if (filters.includes('rgb')) {
            const RGB_COLORS = [
                [255, 0, 0],
                [0, 255, 0],
                [0, 0, 255]
            ]
            return this._figFilter.colorFilter(lines, RGB_COLORS, 0.25);
        }
        return lines;
    }

}

export default Toilet