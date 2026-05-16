import { BrowserAPI } from '../../core/core.js'
import { Application } from '../../system/application/application.js'
import { FORTUNES } from './fortunes.js'
import { DEFAULT_LENGTH_THRESHOLD } from './config.js'
import { FORTUNE_MANIFEST } from './fortune-manifest.js'

/**
 * Fortune - Application for printing a random, hopefully interesting, adage
 * @extends {Application}
 */
export class Fortune extends Application {
    /**
     * Creates a new Fortune instance
     */
    constructor() {
        super('fortune', FORTUNE_MANIFEST);
        this._fortuneCache = {};
        this._fortuneFilesPath = './fortunes';
    }

    /**
     * Executes the `fortune` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {Promise<string>} - A random fortune string
     */
    async main(commandLine) {
        const options = commandLine.getOptions();
        const args = commandLine.getArguments();
        if (options['list']) {
            return this._listFiles(options);
        }
        const fileName = args[0] || null;
        const file = FORTUNES[fileName];
        if (fileName && !file) {
            const available = Object.keys(this._getFortunes()).join(', ');
            return `Unknown file: ${fileName}\nAvailable: ${available}`;
        }
        let fortuneEntry = options['pattern'] 
            ? await this._generateFortuneByPattern(file, options)
            : await this._generateFortune(file, options);
        if (!fortuneEntry) return 'No fortune found.';
        if (options['show-cookie']) {
            return `% ${fortuneEntry.file}\n${fortuneEntry.text}`;
        }
        return fortuneEntry.text;
    }

    /**
     * Lists available fortune files filtered by offensive flag
     * @param {object} options
     * @returns {string}
     */
    _listFiles(options) {
        const files = this._selectFiles(null, options);
        return files.map(file => file.name).join('\n');
    }

    /**
     * Selects which categories to draw from based on options
     * @param {Object|null} file - Explicit file (bypasses offensive filtering)
     * @param {object} options - The options object
     * @returns {Object[]}
     */
    _selectFiles(file, options) {
        if (file) return [file];
        const all = Object.values(this._getFortunes());
        if (options['all']) return all;
        if (options['offensive']) return all.filter(file => file.offensive);
        return all.filter(file => !file.offensive);
    }

    /**
     * Generates a random fortune that match the pattern
     * @param {Object|null} file - The file of the fortune to generate
     * @param {object} options - The options object
     * @returns {Promise<{text: string, file: string}|null>}
     */
    async _generateFortuneByPattern(file, options) {
        const flags = options['ignore-case'] ? 'i' : '';
        const regex = new RegExp(options['pattern'], flags);
        const files = this._selectFiles(file, options);
        const allEntries = await Promise.all(
            files.map(file => this._loadFortunes(file))
        );
        const pool = allEntries.flat().filter(entry => regex.test(entry.text));
        return this._getRandomFortuneFromPool(pool);
    }

    /**
     * Picks a random fortune entry from one or all categories
     * @param {Object|null} file - The file of the fortune to generate
     * @param {object} options - The options object
     * @returns {Promise<{text: string, file: string}|null>}
     */
    async _generateFortune(file, options) {
        const files = this._selectFiles(file, options);
        const allEntries = await Promise.all(
            files.map(file => this._loadFortunes(file))
        );
        let pool = allEntries.flat();
        const threshold = options['length'] || DEFAULT_LENGTH_THRESHOLD;
        if (options['short']) {
            pool = pool.filter(entry => entry.text.length <= threshold);
        } else if (options['long']) {
            pool = pool.filter(entry => entry.text.length > threshold);
        }
        return this._getRandomFortuneFromPool(pool);
    }

    /**
     * Picks a random entry from a pool
     * @param {Array<{text: string, file: string}>} pool
     * @returns {{text: string, file: string}|null}
     */
    _getRandomFortuneFromPool(pool) {
        if (pool.length === 0) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    /**
     * Loads and caches fortunes for a given fortune as tagged entries
     * @param {object} fortune - The fortune to load
     * @returns {Promise<Array<{text: string, file: Object}>>}
     */
    async _loadFortunes(fortune) {
        if (this._fortuneCache[fortune.name]) return this._fortuneCache[fortune.name];
        const fortuneFile = await this._loadFortune(fortune.filename);
        const entries = fortuneFile
            .split(/\n%\s*\n/)
            .filter(fortuneText => fortuneText.trim().length > 0)
            .map(fortuneText => ({ text: fortuneText.trim(), file: fortune.filename }));
        this._fortuneCache[fortune.name] = entries;
        return entries;
    }

    /**
     * Fetches the raw content of a fortune file
     * @param {string} filename
     * @returns {Promise<string>}
     */
    async _loadFortune(filename) {
        const path = `${this._fortuneFilesPath}/${filename}`;
        const response = await BrowserAPI.loadFile(new URL(path, import.meta.url));
        return new TextDecoder().decode(response);
    }

    /**
     * Returns the fortunes map
     * @returns {Object}
     */
    _getFortunes() {
        return FORTUNES;
    }
}

export default Fortune
