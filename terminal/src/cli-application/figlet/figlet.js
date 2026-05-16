import { BrowserAPI } from '../../core/core.js'
import { Application } from '../../system/application/application.js'
import { FIGLET_MANIFEST } from './figlet-manifest.js'
import { FlfParser } from './flf-parser.js'
import { TlfParser } from './tlf-parser.js'
import { FIGTransformer } from './fig-transformer.js'
import { FONTS } from './fonts.js'
import { DEFAULT_FONT_NAME, DEFAULT_WIDTH, DEFAULT_CHARACTER_CODE } from './config.js'

/**
 * Figlet - Application for transforming text into ASCII art using fonts
 * @extends {Application}
 */
export class Figlet extends Application {
    /**
     * Creates a new Figlet instance
     */
    constructor() {
        super('figlet', FIGLET_MANIFEST);
        this._flfParser = new FlfParser();
        this._tlfParser = new TlfParser();
        this._figTransformer = new FIGTransformer({
            defaultWidth: DEFAULT_WIDTH,
            defaultCharacterCode: DEFAULT_CHARACTER_CODE,
        });
        this._fontCache = {};
        this._fontFilesPath = './fonts';
    }

    /**
     * Executes the `figlet` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the figlet command execution
     */
    async main(commandLine, context) {
        const options = commandLine.getOptions();
        const fonts = this._getFonts();
        if (options['list']) {
            return Object.keys(fonts).join(',');
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
        return lines.join('\n');
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

}

export default Figlet