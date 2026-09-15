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
        const pools = await this._getPools(args, options);
        if (pools.length === 0) {
            return 'No fortune files found';
        }
        if (Boolean(options['list'])) {
            return this._listPools(pools);
        }
        const entry = this._generateFortune(pools, options);
        if (!entry) return 'No fortune found';
        const showCookie = Boolean(options['cookie']);
        if (showCookie) {
            return `% ${entry.group}\n${entry.text}`;
        }
        return entry.text;
    }

    /**
     * Builds weighted pools of fortune entries
     * @param {string[]} args - The positional arguments, e.g. `90% computers 10% zippy`
     * @param {object} options - The options object
     * @returns {Promise<Array<{name: string, group: string, filename: string, offensive: boolean, weight: number|null, entries: Array}>>}
     */
    async _getPools(args, options = {}) {
        let pools = this._parseSources(args, options);
        if (args.length > 0 && pools.length === 0) return pools;
        if (args.length === 0) {
            pools = this._defaultSources(options);
        }
        const loaded = await this._loadPools(pools);
        const merged = this._mergePools(loaded);
        return this._assignWeights(merged, options);
    }

    /**
     * Parses the positional arguments into catalog sources, each optionally carrying a percentage
     * @param {string[]} args - The positional arguments, e.g. `90% computers 10% zippy`
     * @param {object} options - The options object
     * @returns {Array<{name: string, group: string, filename: string, offensive: boolean, weight: number|null}>}
     */
    _parseSources(args = [], options = {}) {
        const pools = [];
        let currentWeight = null;
        for (const token of args) {
            const percentMatch = token.match(/^(\d+(?:\.\d+)?)%$/);
            if (percentMatch) {
                currentWeight = Number(percentMatch[1]);
                continue;
            }
            const found = this._findSources(token);
            if (found.length === 0) continue;
            const sources = this._filterByOffensive(found, options);
            if (sources.length === 0) {
                currentWeight = null;
                continue;
            }
            if (pools.some(pool => pool.group === sources[0].group)) {
                currentWeight = null;
                continue;
            }
            sources.forEach((source, index) => {
                pools.push({ ...source, weight: index === 0 ? currentWeight : null });
            });
            currentWeight = null;
        }
        return pools;
    }

    /**
     * Finds every catalog source in the group matching a name or group token
     * @param {string} token - The name or group from the command line
     * @returns {Object[]}
     */
    _findSources(token) {
        const catalog = this._getCatalog();
        const source = catalog[token] || Object.values(catalog).find(other => other.group === token);
        if (!source) return [];
        const others = Object.values(catalog)
            .filter(other => other.group === source.group && other.name !== source.name);
        return [source, ...others];
    }

    /**
     * Keeps catalog sources matching -a / -o, same rule as the default pool
     * @param {Object[]} sources - The sources to filter
     * @param {object} options - The options object
     * @returns {Object[]}
     */
    _filterByOffensive(sources, options = {}) {
        const all = Boolean(options['all']);
        if (all) return sources;
        const offensive = Boolean(options['offensive']);
        return sources.filter(source => source.offensive === offensive);
    }

    /**
     * Returns the default catalog sources
     * @param {object} options - The options object
     * @returns {Array<{name: string, group: string, filename: string, offensive: boolean, weight: null}>}
     */
    _defaultSources(options = {}) {
        const sources = this._filterByOffensive(Object.values(this._getCatalog()), options);
        return sources.map(source => ({ ...source, weight: null }));
    }

    /**
     * Loads the cookie entries for each pool
     * @param {Array<{name: string, filename: string, weight: number|null}>} pools
     * @returns {Promise<Array>}
     */
    async _loadPools(pools) {
        const loaded = await Promise.all(pools.map(pool => this._loadEntries(pool)));
        return pools.map((pool, index) => ({
            ...pool,
            entries: loaded[index],
        }));
    }

    /**
     * Merges offensive and inoffensive sources of the same group into one pool
     * @param {Array} pools
     * @returns {Array}
     */
    _mergePools(pools) {
        const mergedPools = new Map();
        for (const pool of pools) {
            const merged = mergedPools.get(pool.group);
            if (!merged) {
                mergedPools.set(pool.group, { ...pool });
                continue;
            }
            merged.entries = [...merged.entries, ...pool.entries];
            if (merged.weight === null) merged.weight = pool.weight;
            if (!pool.offensive) {
                merged.name = pool.name;
                merged.filename = pool.filename;
                merged.offensive = pool.offensive;
            }
        }
        return [...mergedPools.values()];
    }

    /**
     * Drops empty pools and splits leftover probability among pools with no percentage
     * @param {Array} pools
     * @param {object} options - The options object
     * @returns {Array}
     */
    _assignWeights(pools, options = {}) {
        const nonempty = pools.filter(pool => pool.entries.length > 0);
        const equal = Boolean(options['equal']);
        const unweighted = nonempty.filter(pool => pool.weight === null);
        if (unweighted.length === 0) return nonempty;
        const explicitSum = nonempty.reduce((sum, pool) => sum + (pool.weight || 0), 0);
        const residual = Math.max(0, 100 - explicitSum);
        const sizeOf = pool => equal ? 1 : pool.entries.length;
        const totalSize = unweighted.reduce((sum, pool) => sum + sizeOf(pool), 0);
        for (const pool of unweighted) {
            const share = totalSize > 0 ? sizeOf(pool) / totalSize : 1 / unweighted.length;
            pool.weight = residual * share;
        }
        return nonempty;
    }

    /**
     * Lists the pools that would be drawn from, with their probabilities
     * @param {Array} pools
     * @returns {string}
     */
    _listPools(pools) {
        return pools
            .map(pool => `${pool.weight.toFixed(2).padStart(6)}% ${pool.group}`)
            .join('\n');
    }

    /**
     * Filters cookies, then picks one according to pool weights
     * @param {Array} pools
     * @param {object} options - The options object
     * @returns {{text: string, group: string}|null}
     */
    _generateFortune(pools, options = {}) {
        const filtered = pools.map(pool => ({
            ...pool,
            entries: this._filterEntries(pool.entries, options),
        }));
        return this._pickEntry(filtered);
    }

    /**
     * Picks a pool according to its probability, then a random entry inside it
     * @param {Array} pools
     * @returns {{text: string, group: string}|null}
     */
    _pickEntry(pools) {
        if (pools.length === 0) return null;
        const total = pools.reduce((sum, pool) => sum + pool.weight, 0);
        let chosen = pools[pools.length - 1];
        if (total <= 0) {
            chosen = pools[Math.floor(Math.random() * pools.length)];
        } else {
            let roll = Math.random() * total;
            for (const pool of pools) {
                roll -= pool.weight;
                if (roll < 0) {
                    chosen = pool;
                    break;
                }
            }
        }
        if (chosen.entries.length === 0) return null;
        return chosen.entries[Math.floor(Math.random() * chosen.entries.length)];
    }

    /**
     * Keeps only the entries matching the requested length and pattern
     * @param {Array} entries - The entries to filter
     * @param {object} options - The options object
     * @returns {Array}
     */
    _filterEntries(entries, options = {}) {
        const matchingLength = this._filterByLength(entries, options);
        const pattern = Boolean(options['pattern']);
        if (!pattern) return matchingLength;
        return this._filterByPattern(matchingLength, options);
    }

    /**
     * Keeps only the entries matching the requested pattern
     * @param {Array} entries - The entries to filter
     * @param {object} options - The options object
     * @returns {Array}
     */
    _filterByPattern(entries, options = {}) {
        const flags = Boolean(options['ignore-case']) ? 'i' : '';
        const regex = new RegExp(options['pattern'], flags);
        return entries.filter(entry => regex.test(entry.text));
    }

    /**
     * Keeps only the entries matching the requested length
     * @param {Array} entries - The entries to filter
     * @param {object} options - The options object
     * @returns {Array}
     */
    _filterByLength(entries, options = {}) {
        const short = Boolean(options['short']);
        const long = Boolean(options['long']);
        if (!short && !long) return entries;
        const threshold = options['length'] ? Number(options['length']) : DEFAULT_LENGTH_THRESHOLD;
        if (short) return entries.filter(entry => entry.text.length <= threshold);
        return entries.filter(entry => entry.text.length > threshold);
    }

    /**
     * Loads and caches cookie entries for a catalog source
     * @param {object} source - The catalog source to load
     * @returns {Promise<Array>}
     */
    async _loadEntries(source) {
        if (this._fortuneCache[source.name]) return this._fortuneCache[source.name];
        const raw = await this._readFile(source.filename);
        const entries = raw
            .split(/\n%\s*\n/)
            .filter(text => text.trim().length > 0)
            .map(text => ({
                text: text.replace(/^\n+|\n+$/g, ''),
                name: source.name,
                filename: source.filename,
                group: source.group,
            }));
        this._fortuneCache[source.name] = entries;
        return entries;
    }

    /**
     * Fetches the raw content of a fortune file
     * @param {string} filename
     * @returns {Promise<string>}
     */
    async _readFile(filename) {
        const path = `${this._fortuneFilesPath}/${filename}`;
        const response = await BrowserAPI.fetchFile(new URL(path, import.meta.url));
        return new TextDecoder().decode(response);
    }

    /**
     * Returns the fortune catalog
     * @returns {Object}
     */
    _getCatalog() {
        return FORTUNES;
    }
}

export default Fortune