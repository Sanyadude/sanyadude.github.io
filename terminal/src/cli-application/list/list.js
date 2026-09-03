import { Application } from '../../system/application/application.js'
import { LIST_MANIFEST } from './list-manifest.js'
import {
    DEFAULT_WIDTH, DEFAULT_PADDING,
    DEFAULT_FORMAT, DEFAULT_SORT_TYPE, DEFAULT_TIME_TYPE, 
    DEFAULT_INDICATOR_STYLE, DEFAULT_COLOR_RULE, DEFAULT_TIME_STYLE, DEFAULT_QUOTING_STYLE, 
    TIME_STYLES, QUOTING_STYLES, SORT_TYPES, TIME_TYPES, FORMATS, INDICATOR_STYLES, COLOR_RULES,
    COLORS, AUTO_COLOR_ENABLED, C_ESCAPE_MAP,
    BINARY_UNITS_SIZE_MAP, DECIMAL_UNITS_SIZE_MAP, SI_UNITS_SIZE_MAP
} from './config.js'
import { StrftimeFormatter } from '../../core/datetime/strftime-formatter.js'
import { Path } from '../../system/file-system/path.js'

/**
 * List - Application for listing directory contents
 * @extends {Application}
 */
export class List extends Application {
    /**
     * Creates a new List instance
     */
    constructor() {
        super('list', LIST_MANIFEST);
        this._cache = {};
        this._strftimeFormatter = new StrftimeFormatter();
    }

    /**
     * Executes the `ls` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the ls command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const args = commandLine.getArguments();
        const path = args.join(' ');
        const fullPath = context.fileSystemExplorer.getAbsolutePath(path);
        const directoryExists = context.fileSystemManager.directoryExists(fullPath);
        if (!directoryExists) {
            return `Directory not found: ${path}`;
        }
        const entries = context.fileSystemManager.getEntriesAt(fullPath);
        if (options['recursive']) {
            return this._getRecursiveDirectoryInfo(entries, '.', options);
        }
        return this._getDirectoryInfo(entries, options);
    }

    /**
     * Lists the entries recursively
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {string} path - The path
     * @param {object} options - The options
     * @returns {string} - The list of the entries
     */
    _getRecursiveDirectoryInfo(entries, path = '.', options = {}) {
        const directoryInfo = this._getDirectoryInfo(entries, options);
        const section = `${path}:\n${directoryInfo}${directoryInfo ? '\n' : ''}`;
        const sections = [section];
        const filteredEntries = this._filterEntries(entries, options);
        const visibleEntries = this._sortEntries(filteredEntries, options);
        for (const entry of visibleEntries) {
            if (!entry.isDirectory()) continue;
            const childPath = `${path}/${entry.getName()}`;
            const nestedSection = this._getRecursiveDirectoryInfo(entry.getEntries(), childPath, options);
            if (!nestedSection) continue;
            sections.push(nestedSection);
        }
        return sections.join('\n');
    }

    /**
     * Lists the directory information
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {string} - The directory information
     */
    _getDirectoryInfo(entries, options = {}) {
        const filteredEntries = this._filterEntries(entries, options);
        const sortedEntries = this._sortEntries(filteredEntries, options);
        const groupEntries = this._groupEntries(sortedEntries, options);
        const format = this._getFormat(options);
        if (format === 'long' || format === 'verbose') {
            return this._formatLongList(groupEntries, options);
        }
        return this._formatList(groupEntries, options);
    }

    /**
     * Filters the entries
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The filtered entries
     */
    _filterEntries(entries, options = {}) {
        const all = Boolean(options['all'] || options['unsorted']);
        const ignoreBackups = Boolean(options['ignore-backups']);
        const ignorePattern = options['ignore'];
        const hidePattern = options['hide'];
        let filteredEntries = entries;
        if (ignoreBackups) {
            filteredEntries = filteredEntries.filter(entry => !entry.getName().endsWith('~'));
        }
        if (!all) {
            filteredEntries = filteredEntries.filter(entry => !entry.getName().startsWith('.'));
        }
        if (ignorePattern) {
            filteredEntries = filteredEntries.filter(entry => !Path.globToRegExp(ignorePattern).test(entry.getName()));
        }
        if (hidePattern && !all) {
            filteredEntries = filteredEntries.filter(entry => !Path.globToRegExp(hidePattern).test(entry.getName()));
        }
        return filteredEntries;
    }

    /**
     * Sorts the entries
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The sorted entries
     */
    _sortEntries(entries, options = {}) {
        const sortType = this._getSortType(options);
        if (sortType === 'none') return entries;
        const reverseOrder = Boolean(options['reverse']);
        const timeType = this._getTimeType(options);
        return entries.sort((a, b) => {
            const itemA = reverseOrder ? b : a;
            const itemB = reverseOrder ? a : b;
            const nameA = itemA.getName();
            const nameB = itemB.getName();
            if (sortType === 'name') {
                return nameA.localeCompare(nameB);
            }
            if (sortType === 'size') {
                const comparisonResult = itemB.getSize() - itemA.getSize();
                if (comparisonResult !== 0) return comparisonResult;
                return nameA.localeCompare(nameB);
            }
            if (sortType === 'time') {
                const comparisonResult = this._getTime(itemB, timeType) - this._getTime(itemA, timeType);
                if (comparisonResult !== 0) return comparisonResult;
                return nameA.localeCompare(nameB);
            }
            if (sortType === 'width') {
                const comparisonResult = nameA.length - nameB.length;
                if (comparisonResult !== 0) return comparisonResult;
                return nameA.localeCompare(nameB);
            }
            if (sortType === 'version') {
                return this._compareVersionNames(itemA.getName(), itemB.getName());
            }
            if (sortType === 'extension') {
                return this._compareExtensions(itemA.getName(), itemB.getName());
            }
            return 0;
        });
    }

    /**
     * Gets the extension of a name
     * @param {string} name - The name
     * @returns {string} The extension of the name
     */
    _getExtension(name) {
        const index = name.lastIndexOf('.');
        return index <= 0 ? '' : name.slice(index + 1);
    }

    /**
     * Compares the extensions of two names
     * @param {string} nameA - The first name
     * @param {string} nameB - The second name
     * @returns {number} The comparison result
     */
    _compareExtensions(nameA, nameB) {
        const extensionA = this._getExtension(nameA);
        const extensionB = this._getExtension(nameB);
        if (extensionA && !extensionB) return -1;
        if (!extensionA && extensionB) return 1;
        const comparisonResult = extensionA.localeCompare(extensionB);
        if (comparisonResult !== 0) return comparisonResult;
        return nameA.localeCompare(nameB);
    }
    /**
     * Compares the version of two names
     * @param {string} nameA - The first name
     * @param {string} nameB - The second name
     * @returns {number} The comparison result
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
     * Groups the entries by directories and files
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The grouped entries
     */
    _groupEntries(entries, options = {}) {
        const groupDirectoriesFirst = Boolean(options['group-directories-first']);
        if (!groupDirectoriesFirst) return entries;
        const directories = [];
        const files = [];
        for (const entry of entries) {
            if (entry.isDirectory()) {
                directories.push(entry);
            } else {
                files.push(entry);
            }
        }
        return [...directories, ...files];
    }

    /**
     * Formats the list of the entries into a string
     * @param {string[]} list - The list
     * @param {object} options - The options
     * @returns {string} - The formatted list
     */
    _formatList(entries, options = {}) {
        if (entries.length === 0) return '';
        const list = entries.map(entry => this._getFormattedEntryName(entry, options));
        const format = this._getFormat(options);
        if (format === 'commas') {
            return list.join(', ');
        }
        if (format === 'long' || format === 'verbose' || format === 'single-column') {
            return list.join(this._getTerminatingCharacter(options));
        }
        if (format === 'across' || format === 'horizontal') {
            return this._formatColumns(list, 'row', options);
        }
        if (format === 'vertical') {
            return this._formatColumns(list, 'column', options);
        }
        return list.join(' ');
    }

    /**
     * Formats the columns
     * @param {string[]} list - The list
     * @param {string} fillDirection - The fill direction (row or column)
     * @param {object} options - The options
     * @returns {string} - The formatted columns
     */
    _formatColumns(list, fillDirection = 'row', options = {}) {
        if (list.length === 0) return '';
        const width = this._getWidth(options);
        const maxLength = Math.max(...list.map(item => this._getVisibleLength(item)));
        const columns = width <= 0
            ? list.length
            : Math.max(1, Math.floor((width + DEFAULT_PADDING) / (maxLength + DEFAULT_PADDING)));
        const columnCount = Math.min(columns, list.length);
        const rowCount = Math.ceil(list.length / columnCount);
        const rows = [];
        for (let row = 0; row < rowCount; row++) {
            const values = [];
            for (let column = 0; column < columnCount; column++) {
                let index;
                if (fillDirection === 'column') {
                    index = row + column * rowCount;
                } else {
                    index = row * columnCount + column;
                }
                if (index < list.length) {
                    values.push(String(list[index]));
                }
            }
            rows.push(values.map((value, index) => {
                const isLast = index === values.length - 1;
                const pad = width <= 0
                    ? DEFAULT_PADDING
                    : Math.max(0, maxLength + DEFAULT_PADDING - this._getVisibleLength(value));
                return isLast
                    ? value
                    : `${value}${' '.repeat(pad)}`;
            }).join('').trimEnd());
        }
        return rows.join(this._getTerminatingCharacter(options));
    }

    /**
     * Visible length of text, ignoring ANSI SGR codes
     * @param {string} text - The text that may contain ANSI codes
     * @returns {number} - The visible character count
     */
    _getVisibleLength(text) {
        return String(text).replace(/\x1b\[[0-9;]*m/g, '').length;
    }

    /**
     * Formats entries in long listing format
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @returns {string} - The formatted long list
     */
    _formatLongList(entries, options = {}) {
        const total = `total ${entries.length}`;
        if (entries.length === 0) return total;
        const timeType = this._getTimeType(options);
        const rows = entries.map(entry => {
            const mode = `${entry.isDirectory() ? 'd' : '-'}${entry.getPermissions()}`;
            const link = entry.isDirectory() ? 2 : 1;
            const author = entry.getAuthor();
            const owner = entry.getOwner();
            const group = entry.getGroup();
            const size = this._formatSize(entry.getSize(), options);
            const timestamp = this._getTime(entry, timeType);
            const date = this._formatDate(timestamp, options);
            const name = this._getFormattedEntryName(entry, options);
            return { mode, link, owner, group, author, size, date, name };
        });
        const maxOwner = Math.max(...rows.map(row => row.owner.length));
        const maxGroup = Math.max(...rows.map(row => row.group.length));
        const maxAuthor = Math.max(...rows.map(row => row.author.length));
        const maxSize = Math.max(...rows.map(row => row.size.length));
        const printOwner = !Boolean(options['no-owner']);
        const printGroup = !Boolean(options['long-no-group'] || options['no-group']);
        const printAuthor = Boolean(options['author']);
        let longList = `${total}\n`;
        for (const row of rows) {
            longList += `${row.mode} ${row.link} `;
            if (printOwner) {
                longList += `${row.owner.padEnd(maxOwner)} `;
            }
            if (printGroup) {
                longList += `${row.group.padEnd(maxGroup)} `;
            }
            if (printAuthor) {
                longList += `${row.author.padEnd(maxAuthor)} `;
            }
            longList += `${row.size.padStart(maxSize)} ${row.date} ${row.name}`;
            longList += this._getTerminatingCharacter(options);
        }
        return longList;
    }

    /**
     * Formats the size
     * @param {number} size - The size
     * @param {object} options - The options
     * @returns {string} - The formatted size
     */
    _formatSize(bytes, options = {}) {
        const cacheKey = options['block-size'];
        const humanReadable = Boolean(options['human-readable']);
        const si = Boolean(options['si']);
        if (humanReadable || si) {
            const base = si ? 1000 : 1024;
            const unitMap = si ? SI_UNITS_SIZE_MAP : BINARY_UNITS_SIZE_MAP;
            return this._formatHumanSize(bytes, base, unitMap);
        }
        let blockSize = this._cache[cacheKey];
        if (!blockSize) {
            blockSize = this._getBlockSize(options);
            this._cache[cacheKey] = blockSize;
        }
        const { blockBytes, suffix } = blockSize;
        const blockCount = Math.ceil(bytes / blockBytes);
        return `${blockCount}${suffix}`;
    }

    /**
     * Formats the human readable size
     * @param {number} bytes - The bytes
     * @param {number} base - The base
     * @param {object} unitMap - The unit map
     * @returns {string} - The formatted human readable size
     */
    _formatHumanSize(bytes, base, unitMap) {
        const size = Number.isFinite(bytes) ? Math.max(0, bytes) : 0;
        if (size < base) return String(Math.round(size));
        const units = Object.entries(unitMap);
        const last = units[units.length - 1];
        const [unit, power] = units.find(([, exp]) => size < base ** (exp + 1)) ?? last;
        const value = size / (base ** power);
        const formattedValue = value < 10 ? value.toFixed(1) : String(Math.round(value));
        return `${formattedValue}${unit}`;
    }

    /**
     * Gets the time of the entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {string} timeType - The time type
     * @returns {number} - The time
     */
    _getTime(entry, timeType) {
        if (timeType === 'access' || timeType === 'atime' || timeType === 'use') {
            return entry.getAccessed();
        }
        if (timeType === 'modification' || timeType === 'mtime') {
            return entry.getModified();
        }
        if (timeType === 'status' || timeType === 'ctime') {
            return entry.getChanged();
        }
        if (timeType === 'birth' || timeType === 'creation') {
            return entry.getCreated();
        }
        return entry.getModified();
    }

    /**
     * Gets the formatted name of the entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {object} options - The options
     * @returns {string} - The formatted name
     */
    _getFormattedEntryName(entry, options = {}) {
        const indicatorStyle = this._getIndicatorStyle(options);
        const indicator = this._getIndicator(entry, indicatorStyle);
        let displayName = this._formatDisplayName(entry.getName(), options);
        if (indicator) {
            displayName += indicator;
        }
        const color = this._getColor(entry, this._getColoringRule(options));
        return color ? `\x1b[${color}m${displayName}\x1b[0m` : displayName;
    }

    /**
     * Formats the display name of the entry
     * @param {string} name - The name
     * @param {object} options - The options
     * @returns {string} - The formatted display name
     */
    _formatDisplayName(name, options = {}) {
        const quotingStyle = this._getQuotingStyle(options);
        const hideControlCharacters = Boolean(options['hide-control-chars']);
        if (quotingStyle === 'c') {
            return `"${this._escapeNongraphicCStyle(name, '"')}"`;
        }
        if (quotingStyle === 'escape') {
            return this._escapeNongraphicCStyle(name, ' ');
        }
        if (quotingStyle === 'literal') {
            return hideControlCharacters ? this._hideControlCharacters(name) : name;
        }
        if (quotingStyle === 'locale') {
            return this._quoteLocale(name, hideControlCharacters);
        }
        if (quotingStyle === 'shell') {
            return this._quoteShell(name, false, false, hideControlCharacters);
        }
        if (quotingStyle === 'shell-always') {
            return this._quoteShell(name, true, false, hideControlCharacters);
        }
        if (quotingStyle === 'shell-escape-always') {
            return this._quoteShell(name, true, true, hideControlCharacters);
        }
        return this._quoteShell(name, false, true, hideControlCharacters);
    }

    /**
     * Quotes a name for a POSIX shell
     * @param {string} name - The name
     * @param {boolean} always - Quote even when the name is shell-safe
     * @param {boolean} dollar - Use $'...' when the name has control characters
     * @param {boolean} hideControlCharacters - Replace control characters with ?
     * @returns {string} - The quoted name
     */
    _quoteShell(name, always, dollar, hideControlCharacters) {
        const displayName = hideControlCharacters ? this._hideControlCharacters(name) : name;
        if (displayName === '') return `''`;
        const hasControlCharacters = [...displayName].some(char => this._isControlCharacter(char));
        if (dollar && hasControlCharacters) {
            return `$'${this._escapeNongraphicCStyle(displayName, `'`)}'`;
        }
        if (!always && this._isShellSafeName(displayName)) return displayName;
        return `'${displayName.split(`'`).join(`'\\''`)}'`;
    }

    /**
     * Quotes a name using locale-style ASCII double quotes when needed
     * @param {string} name - The name
     * @param {boolean} hideControlCharacters - Replace control characters with ?
     * @returns {string} - The quoted name
     */
    _quoteLocale(name, hideControlCharacters) {
        const displayName = hideControlCharacters ? this._hideControlCharacters(name) : name;
        if (displayName === '') return `""`;
        if (this._isShellSafeName(displayName)) return displayName;
        return `"${displayName.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }

    /**
     * Checks whether a name can be left unquoted in a POSIX shell
     * @param {string} name - The name
     * @returns {boolean} - True if the name is safe unquoted
     */
    _isShellSafeName(name) {
        return !/[^A-Za-z0-9._+\-\/@=,:%]/.test(name);
    }

    /**
     * C-style escapes for nongraphic characters (-b / -Q / shell `$'...'`)
     * @param {string} name - The name
     * @param {string} extraCharacters - The extra characters to escape
     * @returns {string} - The escaped name
     */
    _escapeNongraphicCStyle(name, extraCharacters = '') {
        return [...name].map(char => {
            if (C_ESCAPE_MAP[char]) return C_ESCAPE_MAP[char];
            if (extraCharacters.includes(char)) return `\\${char}`;
            if (!this._isControlCharacter(char)) return char;
            return `\\${char.codePointAt(0).toString(8).padStart(3, '0')}`;
        }).join('');
    }

    /**
     * Hides the control characters in the name
     * @param {string} name - The name
     * @returns {string} - The hidden name
     */
    _hideControlCharacters(name) {
        return [...name].map(char => this._isControlCharacter(char) ? '?' : char).join('');
    }

    /**
     * Checks if the character is a nongraphic (control) character
     * @param {string} char - The character
     * @returns {boolean} - True if the character is a control character
     */
    _isControlCharacter(char) {
        const codePoint = char.codePointAt(0);
        return (codePoint >= 0x00 && codePoint <= 0x1f) || (codePoint >= 0x7f && codePoint <= 0x9f);
    }

    /**
     * Gets the indicator for the entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {string} indicatorStyle - The indicator style
     * @returns {string} - The indicator
     */
    _getIndicator(entry, indicatorStyle) {
        if (indicatorStyle === 'none') {
            return '';
        }
        if (indicatorStyle === 'slash') {
            return entry.isDirectory() ? '/' : '';
        }
        if (indicatorStyle === 'file-type') {
            return '';
        }
        if (indicatorStyle === 'classify') {
            const isDirectory = entry.isDirectory();
            const isExecutable = entry.getPermissions().charAt(2) === 'x';
            if (isDirectory) return '/';
            return isExecutable ? '*' : '';
        }
        return '';
    }

    /**
     * Gets the color for the entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {string} colorRule - The color rule
     * @returns {number} - The color
     */
    _getColor(entry, colorRule) {
        if (colorRule === 'never') {
            return COLORS.DEFAULT;
        }
        if (colorRule === 'auto' && AUTO_COLOR_ENABLED || colorRule === 'always') {
            const isDirectory = entry.isDirectory();
            const isExecutable = entry.getPermissions().charAt(2) === 'x';
            if (isDirectory) return COLORS.DIRECTORY;
            if (isExecutable) return COLORS.EXECUTABLE;
            return COLORS.DEFAULT;
        }
        return COLORS.DEFAULT;
    }

    /**
     * Formats the date (`Mon DD HH:MM`, or `Mon DD  YYYY` if older than six months)
     * @param {number} timestamp - The timestamp to format
     * @param {object} options - The options
     * @returns {string} - The formatted date
     */
    _formatDate(timestamp, options = {}) {
        const style = this._getTimeStyle(options);
        const date = new Date(timestamp);
        if (style.startsWith('+')) {
            return this._strftimeFormatter.format(date, style.slice(1));
        }
        const recent = Math.abs(Date.now() - timestamp) <= 1000 * 60 * 60 * 24 * 30 * 6;
        const formats = {
            'full-iso': '%Y-%m-%d %H:%M:%S.%N %z',
            'long-iso': '%Y-%m-%d %H:%M',
            'iso': recent ? '%m-%d %H:%M' : '%Y-%m-%d',
            'locale': recent ? '%b %_d %H:%M' : '%b %_d  %Y',
        };
        const format = formats[style] ?? formats.locale;
        return this._strftimeFormatter.format(date, format);
    }

    /**
     * Gets the block size
     * @param {object} options - The options
     * @returns {object} - The block size
     */
    _getBlockSize(options = {}) {
        const blockSize = options['block-size'];
        const defaultBlockSize = { blockBytes: 1, suffix: '' };
        if (!blockSize) return defaultBlockSize;
        const match = String(blockSize).trim().match(/^(\d+)?(.*)$/i);
        if (!match) return defaultBlockSize;
        const [, countPart, unitPart] = match;
        const hasExplicitCount = countPart != null;
        const blockCount = hasExplicitCount ? Number(countPart) : 1;
        if (!Number.isFinite(blockCount) || blockCount <= 0) {
            return defaultBlockSize;
        }
        const unitName = unitPart.trim().toUpperCase();
        const createResult = (blockBytes, suffix) => ({
            blockBytes,
            suffix: hasExplicitCount ? '' : suffix,
        });
        if (unitName === '' || unitName === 'B') {
            return createResult(blockCount, '');
        }
        const binaryPrefixMatch = unitName.match(/^([KMGTPEZYRQ])IB$/);
        if (binaryPrefixMatch) {
            const prefix = binaryPrefixMatch[1];
            const power = BINARY_UNITS_SIZE_MAP[prefix];
            if (power != null) {
                return createResult(blockCount * (1024 ** power), prefix);
            }
        }
        const decimalPower = DECIMAL_UNITS_SIZE_MAP[unitName];
        if (decimalPower != null) {
            return createResult(blockCount * (1000 ** decimalPower), unitName);
        }
        const binaryPower = BINARY_UNITS_SIZE_MAP[unitName];
        if (binaryPower != null) {
            return createResult(blockCount * (1024 ** binaryPower), unitName);
        }
        return defaultBlockSize;
    }

    /**
     * Gets the format from options or default format
     * @param {object} options - The options object
     * @returns {string} - The format
     */
    _getFormat(options = {}) {
        const format = options['format'];
        if (FORMATS.includes(format)) return format;
        if (options['horizontal']) return 'horizontal';
        if (options['commas']) return 'commas';
        if (options['long'] || options['long-no-group'] || options['no-owner'] || options['full-time']) return 'long';
        if (options['single-column']) return 'single-column';
        if (options['columns']) return 'vertical';
        return DEFAULT_FORMAT;
    }

    /**
     * Gets the sort type from options or default sort type
     * @param {object} options - The options object
     * @returns {string} - The sort type
     */
    _getSortType(options = {}) {
        const sortType = options['sort'];
        if (SORT_TYPES.includes(sortType)) return sortType;
        if (options['no-sort']) return 'none';
        if (options['unsorted']) return 'none';
        if (options['sort-size']) return 'size';
        if (options['sort-time']) return 'time';
        if (options['version-sort']) return 'version';
        if (options['sort-extension']) return 'extension';
        return DEFAULT_SORT_TYPE;
    }

    /**
     * Gets the time type from options or default time type
     * @param {object} options - The options object
     * @returns {string} - The time type
     */
    _getTimeType(options = {}) {
        const timeType = options['time'];
        if (TIME_TYPES.includes(timeType)) return timeType;
        if (options['access-time']) return 'access';
        if (options['ctime']) return 'status';
        return DEFAULT_TIME_TYPE;
    }

    /**
     * Gets the indicator style from options or default indicator style
     * @param {object} options - The options object
     * @returns {string} - The indicator style
     */
    _getIndicatorStyle(options = {}) {
        const indicatorStyle = options['indicator-style'];
        if (INDICATOR_STYLES.includes(indicatorStyle)) return indicatorStyle;
        if (options['slash']) return 'slash';
        if (options['file-type']) return 'file-type';
        if (options['classify']) return 'classify';
        return DEFAULT_INDICATOR_STYLE;
    }

    /**
     * Gets the color rule from options or default color rule
     * @param {object} options - The options object
     * @returns {string} - The color rule
     */
    _getColoringRule(options = {}) {
        const colorRule = options['color'];
        if (COLOR_RULES.includes(colorRule)) return colorRule;
        return DEFAULT_COLOR_RULE;
    }

    /**
     * Gets the time style from options or default time style
     * @param {object} options - The options object
     * @returns {string} - The time style
     */
    _getTimeStyle(options = {}) {
        const timeStyle = options['time-style'];
        const isFormatString = typeof timeStyle === 'string' && timeStyle.length > 0 && timeStyle.startsWith('+');
        if (isFormatString) return timeStyle;
        if (TIME_STYLES.includes(timeStyle)) return timeStyle;
        if (options['full-time']) return 'full-iso';
        return DEFAULT_TIME_STYLE;
    }

    /**
     * Gets the quoting style from options or the default style
     * @param {object} options - The options object
     * @returns {string} - The quoting style
     */
    _getQuotingStyle(options = {}) {
        const quotingStyle = options['quoting-style'];
        if (QUOTING_STYLES.includes(quotingStyle)) return quotingStyle;
        if (options['literal']) return 'literal';
        if (options['escape']) return 'escape';
        if (options['quote-name']) return 'c';
        return DEFAULT_QUOTING_STYLE;
    }

    /**
     * Gets the width from options or default width but not less than 1
     * Gets the width from options or default width.
     * 0 means unlimited (no line wrapping / as many columns as needed).
     * @param {object} options - The options object
     * @returns {number} - The width
     * @returns {number} - The width, or 0 for unlimited
     */
    _getWidth(options = {}) {
        const rawWidth = options['width'];
        if (rawWidth === 0 || rawWidth === '0') return 0;
        const width = Number(rawWidth);
        if (rawWidth != null && rawWidth !== '' && !Number.isNaN(width)) {
            return Math.max(width, 1);
        }
        return DEFAULT_WIDTH;
    }

    /**
     * Gets the terminating character from options or default terminating character
     * @param {object} options - The options object
     * @returns {string} - The terminating character
     */
    _getTerminatingCharacter(options = {}) {
        const zero = Boolean(options['zero']);
        if (zero) return '\0';
        return '\n';
    }
}

export default List