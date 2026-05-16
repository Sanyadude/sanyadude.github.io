import { Application } from '../../system/application/application.js'
import { LOLCAT_MANIFEST } from './lolcat-manifest.js'
import { DEFAULT_SPREAD, DEFAULT_FREQ, DEFAULT_SEED, DEFAULT_INVERT_MODE } from './config.js'

/**
 * Lolcat - Application for coloring text in rainbow colors
 * @extends {Application}
 */
export class Lolcat extends Application {
    /**
     * Creates a new Lolcat instance
     */
    constructor() {
        super('lolcat', LOLCAT_MANIFEST);
    }

    /**
     * Executes the `lolcat` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the lolcat command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const args = commandLine.getArguments();
        const stdin = commandLine.getStdin();
        let text = '';
        if (args.length === 0) {
            text = stdin;
        } else {
            const filePath = args[0];
            const file = context.fileSystemExplorer.getFile(filePath);
            text = file ? file.readAsString() : stdin;
        }
        const plainText = text.replace(/\x1b\[[0-9;]+m/g, '');
        return this._colorizeText(plainText, options);
    }

    /**
     * Colorizes the text wrapping it in ANSI codes with rainbow formatting
     * @param {string} text - The text to colorize
     * @param {object} options - The options object
     * @returns {string} - The colorized text
     */
    _colorizeText(text, options = {}) {
        const spread = options['spread'] !== undefined && !isNaN(options['spread']) ? Number(options['spread']) : DEFAULT_SPREAD;
        const freq = options['freq'] !== undefined && !isNaN(options['freq']) ? Number(options['freq']) : DEFAULT_FREQ;
        const seed = options['seed'] !== undefined && !isNaN(options['seed']) ? Number(options['seed']) : DEFAULT_SEED;
        const invert = options['invert'] ? true : false;
        return this._colorizeSineWaveMode(text, spread, freq, seed, invert);
    }

    /**
     * Returns the ANSI code for the given RGB values
     * @param {number} red - The red value
     * @param {number} green - The green value
     * @param {number} blue - The blue value
     * @param {string} text - The text to colorize
     * @param {boolean} invert - Whether to use background mode
     * @returns {string} - The ANSI code for the given RGB values
     */
    _rgbToAnsi(red, green, blue, text, invert = false) {
        return `\x1b[${invert ? '48' : '38'};2;${red};${green};${blue}m${text}`;
    }

    /**
     * Colorizes the text using the HSV mode
     * @param {string} text - The text to colorize
     * @param {number} spread - The spread of the colors horizontally (hue shift)
     * @param {number} freq - The frequency of color change vertically (hue drift)
     * @param {number} seed - The seed for starting color
     * @param {boolean} invert - Whether to use background mode
     * @returns {string} - The colorized text
     */
    _colorizeHsvMode(text = '', spread = DEFAULT_SPREAD, freq = DEFAULT_FREQ, seed = DEFAULT_SEED, invert = DEFAULT_INVERT_MODE) {
        let lines = text.split(/\r?\n/);
        if (invert) {
            lines = this._padLines(lines);
        }
        let hue = seed ? Math.max(0, Math.min(360, seed)) : Math.random() * 360;
        const outputLines = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            let result = '';
            for (let i = 0; i < line.length; i++) {
                let nextHue = (hue + i * spread) % 360;
                if (nextHue < 0) nextHue += 360;
                const { red, green, blue } = this._hsvToRgb(nextHue);
                result += this._rgbToAnsi(red, green, blue, line[i], invert);
            }
            outputLines.push(result + '\x1b[0m');
            hue += freq;
        }
        return outputLines.join('\n');
    }

    /**
     * Converts HSV to RGB
     * @param {number} hue - The hue value of the color
     * @param {number} saturation - The saturation value of the color
     * @param {number} value - The brightness value of the color
     * @returns {object} - The RGB values
     */
    _hsvToRgb(hue, saturation = 1, value = 1) {
        const chroma = value * saturation;
        const intermediate = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
        const match = value - chroma;

        let red, green, blue;
        if (hue < 60) [red, green, blue] = [chroma, intermediate, 0];
        else if (hue < 120) [red, green, blue] = [intermediate, chroma, 0];
        else if (hue < 180) [red, green, blue] = [0, chroma, intermediate];
        else if (hue < 240) [red, green, blue] = [0, intermediate, chroma];
        else if (hue < 300) [red, green, blue] = [intermediate, 0, chroma];
        else[red, green, blue] = [chroma, 0, intermediate];

        return {
            red: Math.round((red + match) * 255),
            green: Math.round((green + match) * 255),
            blue: Math.round((blue + match) * 255)
        };
    }

    /**
     * Colorizes the text using the sine wave mode
     * @param {string} text - The text to colorize
     * @param {number} spread - The spread of the colors horizontally (hue shift)
     * @param {number} freq - The frequency of color change vertically (hue drift)
     * @param {number} seed - The seed for starting color
     * @param {boolean} invert - Whether to use background mode
     * @returns {string} - The colorized text
     */
    _colorizeSineWaveMode(text = '', spread = DEFAULT_SPREAD, freq = DEFAULT_FREQ, seed = DEFAULT_SEED, invert = DEFAULT_INVERT_MODE) {
        let lines = text.split(/\r?\n/);
        if (invert) {
            lines = this._padLines(lines);
        }
        let phaseSeed = seed ? Math.max(0, Math.min(360, seed)) : Math.random() * 360;
        const outputLines = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            let result = '';
            for (let i = 0; i < line.length; i++) {
                const { red, green, blue } = this._getSineWaveRgb(freq, phaseSeed + (spread !== 0 ? i / spread : 0));
                result += this._rgbToAnsi(red, green, blue, line[i], invert);
            }
            outputLines.push(result + '\x1b[0m');
            phaseSeed += 1;
        }
        return outputLines.join('\n');
    }

    /**
     * Converts a sine wave to RGB
     * @param {number} freq - The frequency of the sine wave
     * @param {number} phase - The phase of the sine wave
     * @returns {object} - The RGB values
     */
    _getSineWaveRgb(freq, phase) {
        const angle = freq !== 0 ? freq * phase : phase;
        const red = Math.round(Math.sin(angle + 0) * 127 + 128);
        const green = Math.round(Math.sin(angle + 2 * Math.PI / 3) * 127 + 128);
        const blue = Math.round(Math.sin(angle + 4 * Math.PI / 3) * 127 + 128);
        return { red, green, blue };
    }

    /**
     * Pads the lines to the maximum length
     * @param {string[]} lines - The lines to pad
     * @returns {string[]} - The padded lines
     */
    _padLines(lines = []) {
        const maxLength = Math.max(...lines.map(line => line.length));
        return lines.map(line => line.padEnd(maxLength, ' '));
    }
}

export default Lolcat