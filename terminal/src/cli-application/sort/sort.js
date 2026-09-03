import { Application } from '../../system/application/application.js'
import { SORT_MANIFEST } from './sort-manifest.js'
import { DEFAULT_SORT_TYPE, SORT_TYPES, MONTHS, HUMAN_NUMERIC_UNITS } from './config.js'

/**
 * Sort - Application for sorting lines of text
 * @extends {Application}
 */
export class Sort extends Application {
    /**
     * Creates a new Sort instance
     */
    constructor() {
        super('sort', SORT_MANIFEST);
    }
    
    /**
     * Executes the `sort` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the sort command execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        const stdin = commandLine.getStdin();
        if (args.length === 0) {
            return this._sortText(stdin, options);
        }
        const fsExplorer = context.fileSystemExplorer;
        const fsManager = context.fileSystemManager;
        const contents = [];
        for (const path of args) {
            if (path === 'nul') {
                contents.push('');
                continue;
            }
            const fullPath = fsExplorer.getAbsolutePath(path);
            if (!fsManager.fileExists(fullPath)) return `File not found: ${fullPath}`;
            const file = fsManager.getFile(fullPath);
            if (!file) return `File not found: ${path}`;
            contents.push(file.readAsString());
        }
        return this._sortText(contents.join('\n'), options);
    }

    /**
     * Sorts the text
     * @param {string} text - The text to sort
     * @param {object} options - The options object
     * @returns {string} - The sorted text
     */
    _sortText(text = '', options = {}) {
        const lines = text.split(/\r?\n/);
        const ranks = new Map();
        const sortedLines = lines.sort((firstLine, secondLine) => {
            return this._compareLines(firstLine, secondLine, ranks, options);
        });
        return sortedLines.join('\n');
    }

    /**
     * Gets the sort type from options or the default sort type
     * @param {object} options - The options object
     * @returns {string} - The sort type
     */
    _getSortType(options = {}) {
        const sortType = options['sort'];
        if (SORT_TYPES.includes(sortType)) return sortType;
        if (options['random-sort']) return 'random';
        if (options['version-sort']) return 'version';
        if (options['month-sort']) return 'month';
        if (options['human-numeric-sort']) return 'human-numeric';
        if (options['general-numeric-sort']) return 'general-numeric';
        if (options['numeric-sort']) return 'numeric';
        return DEFAULT_SORT_TYPE;
    }

    /**
     * Compares two lines using the selected sort options.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {Map} ranks - The ranks used by random sort
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareLines(firstLine, secondLine, ranks = new Map(), options = {}) {
        const sortType = this._getSortType(options);
        let result;
        if (sortType === 'random') {
            result = this._compareRandom(firstLine, secondLine, ranks, options);
        } else if (sortType === 'version') {
            result = this._compareVersions(firstLine, secondLine, options);
        } else if (sortType === 'month') {
            result = this._compareMonths(firstLine, secondLine, options);
        } else if (sortType === 'human-numeric') {
            result = this._compareNumbersHuman(firstLine, secondLine, options);
        } else if (sortType === 'general-numeric') {
            result = this._compareNumbersGeneral(firstLine, secondLine, options);
        } else if (sortType === 'numeric') {
            result = this._compareNumbers(firstLine, secondLine, options);
        } else {
            result = this._compareStrings(firstLine, secondLine, options);
        }
        if (options['reverse']) {
            result *= -1;
        }
        return result;
    }

    /**
     * Compares two lines by random rank of their comparison key.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {Map} ranks - The ranks used by random sort
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareRandom(firstLine, secondLine, ranks = new Map(), options = {}) {
        const firstKey = this._getComparisonLineKey(firstLine, options);
        const secondKey = this._getComparisonLineKey(secondLine, options);
        const firstRank = this._getRandomRank(firstKey, ranks);
        const secondRank = this._getRandomRank(secondKey, ranks);

        if (firstRank < secondRank) return -1;
        if (firstRank > secondRank) return 1;
        return this._compareStrings(firstLine, secondLine, options);
    }

    /**
     * Compares two lines as strings.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareStrings(firstLine, secondLine, options = {}) {
        const firstKey = this._getComparisonLineKey(firstLine, options);
        const secondKey = this._getComparisonLineKey(secondLine, options);
        if (firstKey < secondKey) return -1;
        if (firstKey > secondKey) return 1;
        return 0;
    }

    /**
     * Compares two lines by their leading general numeric value.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareNumbersGeneral(firstLine, secondLine, options = {}) {
        const firstNumber = this._getGeneralNumericValue(this._getComparisonLineKey(firstLine, options));
        const secondNumber = this._getGeneralNumericValue(this._getComparisonLineKey(secondLine, options));
        if (Number.isNaN(firstNumber) && Number.isNaN(secondNumber)) return this._compareStrings(firstLine, secondLine, options);
        if (Number.isNaN(firstNumber)) return -1;
        if (Number.isNaN(secondNumber)) return 1;
        if (firstNumber < secondNumber) return -1;
        if (firstNumber > secondNumber) return 1;
        return this._compareStrings(firstLine, secondLine, options);
    }

    /**
     * Compares two lines by their leading numeric value.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareNumbers(firstLine, secondLine, options = {}) {
        const firstNumber = this._getNumericValue(this._getComparisonLineKey(firstLine, options));
        const secondNumber = this._getNumericValue(this._getComparisonLineKey(secondLine, options));
        if (Number.isNaN(firstNumber) && Number.isNaN(secondNumber)) return this._compareStrings(firstLine, secondLine, options);
        if (Number.isNaN(firstNumber)) return -1;
        if (Number.isNaN(secondNumber)) return 1;
        if (firstNumber < secondNumber) return -1;
        if (firstNumber > secondNumber) return 1;
        return this._compareStrings(firstLine, secondLine, options);
    }

    /**
     * Compares two lines by their leading human-readable numeric value.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareNumbersHuman(firstLine, secondLine, options = {}) {
        const firstNumber = this._getHumanNumericValue(this._getComparisonLineKey(firstLine, options));
        const secondNumber = this._getHumanNumericValue(this._getComparisonLineKey(secondLine, options));
        if (firstNumber < secondNumber) return -1;
        if (firstNumber > secondNumber) return 1;
        return this._compareStrings(firstLine, secondLine, options);
    }

    /**
     * Compares two lines by their leading month name.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareMonths(firstLine, secondLine, options = {}) {
        const firstMonth = this._getMonthValue(this._getComparisonLineKey(firstLine, options));
        const secondMonth = this._getMonthValue(this._getComparisonLineKey(secondLine, options));
        if (firstMonth < secondMonth) return -1;
        if (firstMonth > secondMonth) return 1;
        return this._compareStrings(firstLine, secondLine, options);
    }

    /**
     * Compares two lines by version numbers within the text.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @returns {number} - The comparison result
     */
    _compareVersions(firstLine, secondLine, options = {}) {
        const firstKey = this._getComparisonLineKey(firstLine, options);
        const secondKey = this._getComparisonLineKey(secondLine, options);
        return this._compareVersionNames(firstKey, secondKey);
    }

    /**
     * Compares two names as version strings.
     * @param {string} nameA - The first name
     * @param {string} nameB - The second name
     * @returns {number} - The comparison result
     */
    _compareVersionNames(nameA, nameB) {
        const partsA = nameA.match(/(\d+|\D+)/g) || [];
        const partsB = nameB.match(/(\d+|\D+)/g) || [];
        const length = Math.max(partsA.length, partsB.length);
        for (let i = 0; i < length; i++) {
            const partA = partsA[i];
            const partB = partsB[i];
            if (partA === undefined) return -1;
            if (partB === undefined) return 1;
            const numberA = /^\d+$/.test(partA);
            const numberB = /^\d+$/.test(partB);
            if (numberA && numberB) {
                const a = BigInt(partA);
                const b = BigInt(partB);
                if (a < b) return -1;
                if (a > b) return 1;
            } else {
                const result = partA.localeCompare(partB);
                if (result !== 0) return result;
            }
        }
        return 0;
    }

    /**
     * Returns the normalized string used for comparisons.
     * @param {string} line - The line to normalize
     * @param {object} options - The options object
     * @returns {string} - The comparison key
     */
    _getComparisonLineKey(line, options = {}) {
        let key = options['ignore-leading-blanks'] ? line.trimStart() : line;
        if (options['ignore-nonprinting']) {
            key = key.replace(/[^\x20-\x7E]/g, '');
        }
        if (options['dictionary-order']) {
            key = key.replace(/[^\sA-Za-z0-9]/g, '');
        }
        return options['ignore-case'] ? key.toLowerCase() : key;
    }

    /**
     * Gets the leading numeric value from a line.
     * @param {string} line - The line to parse
     * @returns {number} - The numeric value
     */
    _getNumericValue(line) {
        const match = line.match(/^[\s]*[+-]?(?:\d+\.?\d*|\.\d+)/);
        return match ? Number(match[0]) : 0;
    }

    /**
     * Gets the leading human-readable numeric value from a line (e.g. 2K, 1G).
     * @param {string} line - The line to parse
     * @returns {number} - The numeric value
     */
    _getHumanNumericValue(line) {
        const match = line.match(/^[\s]*([+-])?(\d+\.?\d*|\.\d+)([kKMGTPEZYRQ])?/);
        if (!match) return 0;
        const sign = match[1] === '-' ? -1 : 1;
        const value = Number(match[2]);
        const suffix = match[3] ? match[3].toUpperCase() : '';
        const power = HUMAN_NUMERIC_UNITS[suffix] || 0;
        return sign * value * (1024 ** power);
    }

    /**
     * Gets the leading month value from a line. Unknown months are 0.
     * @param {string} line - The line to parse
     * @returns {number} - The month value (0-12)
     */
    _getMonthValue(line) {
        const match = line.match(/^\s*([A-Za-z]{3})/);
        if (!match) return 0;
        const index = MONTHS.indexOf(match[1].toUpperCase());
        return index === -1 ? 0 : index + 1;
    }

    /**
     * Gets the leading general numeric value from a line.
     * @param {string} line - The line to parse
     * @returns {number} - The numeric value
     */
    _getGeneralNumericValue(line) {
        const match = line.match(/^[\s]*[+-]?(?:NaN|Infinity|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/i);
        return match ? Number(match[0]) : 0;
    }

    /**
     * Gets a stable random rank for a comparison key.
     * @param {string} key - The comparison key
     * @param {Map} randomRanks - The random ranks used by random sort
     * @returns {number} - The random rank
     */
    _getRandomRank(key, randomRanks) {
        if (!randomRanks.has(key)) {
            randomRanks.set(key, Math.random());
        }
        return randomRanks.get(key);
    }
}

export default Sort