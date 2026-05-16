import { BrowserAPI } from '../../core/core.js'
import { Application } from '../../system/application/application.js'
import { CowParser } from './cow-parser.js'
import { COWS } from './cows.js'
import { DEFAULT_FILE, DEFAULT_WIDTH, DEFAULT_EYES, DEFAULT_TONGUE, DEFAULT_MESSAGE, DEFAULT_THOUGHTS, DEFAULT_SAY, DEFAULT_SAY_BUBBLE_BLOCKS, DEFAULT_THOUGHT_BUBBLE_BLOCKS } from './config.js'
import { COWSAY_MANIFEST } from './cowsay-manifest.js'

const DEFAULT_BUBBLE_BLOCKS = DEFAULT_SAY_BUBBLE_BLOCKS;

/**
 * Cowsay - Application for formatting message as if it were spoken by a cow
 * @extends {Application}
 */
export class Cowsay extends Application {
    /**
     * Creates a new Cowsay instance
     */
    constructor() {
        super('cowsay', COWSAY_MANIFEST);
        this._cowParser = new CowParser();
        this._cowCache = {};
        this._cowFilesPath = './cows';
    }

    /**
     * Executes the `cowsay` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {Promise<string>} - The result of the cowsay command execution
     */
    async main(commandLine) {
        const program = commandLine.getProgram();
        const options = commandLine.getOptions();
        if (options['list']) {
            return Object.keys(this._getCows()).join(',');
        }
        const args = commandLine.getArguments();
        const message = args.length === 0
            ? commandLine.getStdin()
            : args.join(' ');
        const plainText = message.replace(/\x1b\[[0-9;]+m/g, '');
        if (program === 'cowsay') {
            return await this._transformToCowsay(plainText, options);
        } else if (program === 'cowthink') {
            return await this._transformToCowthink(plainText, options);
        }
        return '';
    }

    /**
     * Transforms the message to cowsay output string
     * @param {string} message - The message for cow to say
     * @param {object} options - The options object
     * @returns {Promise<string>} - The cowsay output string
     */
    async _transformToCowsay(message, options) {
        const cowType = this._getCowType(options);
        const cowTemplate = await this._getCow(cowType);
        const { eyes, tongue, defaultMessage } = this._getCowParts(options, cowType);
        const bubble = this._buildBubble(message || defaultMessage, options, DEFAULT_SAY_BUBBLE_BLOCKS);
        const cow = this._buildCow(cowTemplate, eyes, tongue, DEFAULT_SAY);
        return bubble + '\n' + cow;
    }

    /**
     * Transforms the message to cowthink output string
     * @param {string} message - The message for cow to think
     * @param {object} options - The options object
     * @returns {Promise<string>} - The cowthink output string
     */
    async _transformToCowthink(message, options) {
        const cowType = this._getCowType(options);
        const cowTemplate = await this._getCow(cowType);
        const { eyes, tongue, defaultMessage } = this._getCowParts(options, cowType);
        const bubble = this._buildBubble(message || defaultMessage, options, DEFAULT_THOUGHT_BUBBLE_BLOCKS);
        const cow = this._buildCow(cowTemplate, eyes, tongue, DEFAULT_THOUGHTS);
        return bubble + '\n' + cow;
    }

    /**
     * Gets the cow type from options
     * @param {object} options - The options object
     * @returns {string} - The cow type
     */
    _getCowType(options = {}) {
        let cowType = Object.keys(this._getCows()).includes(options['file']) ? options['file'] : DEFAULT_FILE;
        if (options['random']) {
            const cowList = Object.keys(this._getCows());
            cowType = cowList[Math.floor(Math.random() * cowList.length)];
        }
        return cowType;
    }

    /**
     * Get cow parts from options
     * @param {object} options - The options object
     * @param {string} type - The type of cow
     * @returns {Object} - The cow parts
     */
    _getCowParts(options = {}, type = DEFAULT_FILE) {
        let eyes = typeof options['eyes'] === 'string' ? options['eyes']?.slice(0, 2).padEnd(2, ' ') : DEFAULT_EYES;
        let tongue = typeof options['tongue'] === 'string' ? options['tongue']?.slice(0, 2).padEnd(2, ' ') : DEFAULT_TONGUE;
        let defaultMessage = DEFAULT_MESSAGE;
        if (type !== DEFAULT_FILE) {
            return { eyes, tongue, defaultMessage };
        }
        const lastOptionKey = Object.keys(options).filter(key => ['b', 'd', 'g', 'p', 's', 't', 'w', 'y'].includes(key)).pop();
        switch (lastOptionKey) {
            case 'b': eyes = '==', tongue = DEFAULT_TONGUE, defaultMessage = 'Resistance is futile!'; break;
            case 'd': eyes = 'XX', tongue = 'U ', defaultMessage = 'I have ceased to moo...'; break;
            case 'g': eyes = '$$', tongue = DEFAULT_TONGUE, defaultMessage = 'Show me the mooney!'; break;
            case 'p': eyes = '@@', tongue = DEFAULT_TONGUE, defaultMessage = 'I see eyes everywhere...'; break;
            case 's': eyes = '**', tongue = 'U ', defaultMessage = 'The grass is green as f...'; break;
            case 't': eyes = '--', tongue = DEFAULT_TONGUE, defaultMessage = 'Sleepy cow strikes again...'; break;
            case 'w': eyes = 'OO', tongue = DEFAULT_TONGUE, defaultMessage = 'Can\'t stop mooing!'; break;
            case 'y': eyes = '..', tongue = DEFAULT_TONGUE, defaultMessage = 'I\'m just learning to moo!'; break;
            default: defaultMessage = 'Moo, world!';
        }
        return { eyes, tongue, defaultMessage };
    }

    /**
     * Gets the width from options or default width but not less than 1
     * @param {object} options - The options object
     * @returns {number} - The width
     */
    _getWidth(options = {}) {
        return Math.max(options['width'] && !isNaN(options['width']) ? Number(options['width']) : DEFAULT_WIDTH, 1);
    }

    /**
     * Build speech bubble for given message
     * @param {string} message - The message to build the bubble for
     * @param {object} options - The options object
     * @param {string[]} bubbleBlocks - The building blocks of the bubble (consists of 8 elements)
     * @returns {string}
     */
    _buildBubble(message = '', options = {}, bubbleBlocks = DEFAULT_BUBBLE_BLOCKS) {
        const lines = this._getMessageLines(message, options);
        const maxLength = Math.max(...lines.map(line => line.length));
        if (lines.length === 1) {
            const line = lines[0];
            return [
                ` ${'_'.repeat(line.length + 2)}`,
                `${bubbleBlocks[0]} ${line} ${bubbleBlocks[1]}`,
                ` ${'-'.repeat(line.length + 2)}`
            ].join('\n');
        }
        const top = ` ${'_'.repeat(maxLength + 2)}`;
        const bottom = ` ${'-'.repeat(maxLength + 2)}`;
        const body = lines.map((line, i) => {
            const padded = line.padEnd(maxLength, ' ');
            if (i === 0) return `${bubbleBlocks[2]} ${padded} ${bubbleBlocks[3]}`;
            if (i === lines.length - 1) return `${bubbleBlocks[6]} ${padded} ${bubbleBlocks[7]}`;
            return `${bubbleBlocks[4]} ${padded} ${bubbleBlocks[5]}`;
        });
        return [top, ...body, bottom].join('\n');
    }

    /**
     * Separates the message into lines array based on width and no wrap options
     * @param {string} message - The message to separate into lines
     * @param {object} options - The options object
     * @returns {string[]} - The lines array
     */
    _getMessageLines(message = '', options = {}) {
        const width = this._getWidth(options);
        const noWrap = options['no-wrap'];
        const lines = message
            .split(/\r?\n/)
            .flatMap(line => {
                if (noWrap || line.length <= width) return [line];
                const chunks = [];
                for (let i = 0; i < line.length; i += width) {
                    chunks.push(line.slice(i, i + width));
                }
                return chunks;
            })
        return lines;
    }

    /**
     * Fills the cow template with the given eyes, tongue and thoughts
     * @param {string} template - The cow template
     * @param {string} eyes - The eyes of the cow
     * @param {string} tongue - The tongue of the cow
     * @param {string} thoughts - The thoughts of the cow
     * @returns {string} - The filled cow template
     */
    _buildCow(template = '', eyes = DEFAULT_EYES, tongue = DEFAULT_TONGUE, thoughts = DEFAULT_SAY) {
        return template
            .replaceAll('{{thoughts}}', thoughts)
            .replaceAll('{{eyes}}', eyes)
            .replaceAll('{{eye}}', eyes[0])
            .replaceAll('{{tongue}}', tongue);
    }

    /**
     * Gets a cow, loading and parsing if necessary
     * @param {string} cowName - The name of the cow
     * @returns {Promise<string>} - The parsed cow body
     */
    async _getCow(cowName) {
        if (this._cowCache[cowName]) return this._cowCache[cowName];
        const cowFile = await this._loadCow(cowName);
        const cow = this._cowParser.parse(cowFile);
        this._cowCache[cowName] = cow;
        return cow;
    }

    /**
     * Loads the cow file
     * @param {string} cowName - The name of the cow
     * @returns {Promise<string>} - The cow file content
     */
    async _loadCow(cowName) {
        const path = `${this._cowFilesPath}/${cowName}.cow`;
        const response = await BrowserAPI.loadFile(new URL(path, import.meta.url));
        return new TextDecoder().decode(response);
    }

    /**
     * Get available cows map
     * @returns {Object} - The available cows
     */
    _getCows() {
        return COWS;
    }

}

export default Cowsay