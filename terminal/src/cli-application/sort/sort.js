import { Application } from '../../system/application/application.js'
import { SORT_MANIFEST } from './sort-manifest.js'

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
        const filePath = args[0];
        const file = context.fileSystemExplorer.getFile(filePath);
        if (!file) return `File not found: ${filePath}`;
        return this._sortText(file.readAsString(), options);
    }

    /**
     * Sorts the text
     * @param {string} text - The text to sort
     * @param {object} options - The options object
     * @returns {string} - The sorted text
     */
    _sortText(text = '', options = {}) {
        const lines = text.split(/\r?\n/);
        const randomRanks = new Map();
        const sortedLines = lines.sort((firstLine, secondLine) => this._compareLines(firstLine, secondLine, options, randomRanks));
        return sortedLines.join('\n');
    }

    /**
     * Compares two lines using the selected sort options.
     * @param {string} firstLine - The first line to compare
     * @param {string} secondLine - The second line to compare
     * @param {object} options - The options object
     * @param {Map} randomRanks - The random ranks used by random sort
     * @returns {number} - The comparison result
     */
    _compareLines(firstLine, secondLine, options = {}, randomRanks = new Map()) {
        let result;
        if (options['random-sort']) {
            result = this._compareRandom(firstLine, secondLine, options, randomRanks);
        } else if (options['general-numeric-sort']) {
            result = this._compareNumbersGeneral(firstLine, secondLine, options);
        } else if (options['numeric']) {
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
     * @param {object} options - The options object
     * @param {Map} randomRanks - The random ranks used by random sort
     * @returns {number} - The comparison result
     */
    _compareRandom(firstLine, secondLine, options = {}, randomRanks = new Map()) {
        const firstKey = this._getComparisonLineKey(firstLine, options);
        const secondKey = this._getComparisonLineKey(secondLine, options);
        const firstRank = this._getRandomRank(firstKey, randomRanks);
        const secondRank = this._getRandomRank(secondKey, randomRanks);

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