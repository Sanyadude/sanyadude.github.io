import { Application } from '../../system/application/application.js'
import { DIRECTORY_MANIFEST } from './directory-manifest.js'
import { ATTRIBUTE_TYPES, SORT_TYPES, TIME_TYPES, DEFAULT_TIME_TYPE, DEFAULT_WIDTH, DEFAULT_PADDING } from './config.js'

/**
 * Directory - Application for listing directory contents
 * @extends {Application}
 */
export class Directory extends Application {
    /**
     * Creates a new Directory instance
     */
    constructor() {
        super('directory', DIRECTORY_MANIFEST);
    }

    /**
     * Executes the `dir` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the dir command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const args = commandLine.getArguments();
        const path = args.join(' ');
        const directoryPath = context.fileSystemExplorer.getAbsolutePath(path);
        const entries = context.fileSystemManager.getEntriesAt(directoryPath);
        if (options['recursive']) {
            return this._getRecursiveDirectoryInfo(entries, directoryPath, options, context);
        }
        return this._getDirectoryInfo(entries, directoryPath, options, context);
    }

    /**
     * Gets directory information
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {string} directoryPath - The path to the directory
     * @param {object} options - The options
     * @param {object} context - The context of the command execution
     * @returns {string} - The directory information
     */
    _getDirectoryInfo(entries, directoryPath = '', options = {}, context = {}) {
        const filteredEntries = this._filterEntries(entries, options);
        const sortedEntries = this._sortEntries(filteredEntries, options);
        return this._formatList(sortedEntries, directoryPath, options, context);
    }

    /**
     * Lists the entries recursively
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {string} path - The path
     * @param {object} options - The options
     * @param {object} context - The context of the command execution
     * @returns {string} - The list of the entries
     */
    _getRecursiveDirectoryInfo(entries, path = '', options = {}, context = {}) {
        const directoryInfo = this._getDirectoryInfo(entries, path, options, context);
        const section = `${directoryInfo}${directoryInfo ? '\n' : ''}`;
        const sections = [section];
        const filteredEntries = this._filterEntries(entries, options);
        const visibleEntries = this._sortEntries(filteredEntries, options);
        for (const entry of visibleEntries) {
            if (!entry.isDirectory()) continue;
            const childPath = path ? `${path}/${entry.getName()}` : entry.getName();
            const nestedSection = this._getRecursiveDirectoryInfo(entry.getEntries(), childPath, options, context);
            if (!nestedSection) continue;
            sections.push(nestedSection);
        }
        return sections.join('\n');
    }

    /**
     * Filters the entries by attributes
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The filtered entries
     */
    _filterEntries(entries, options = {}) {
        if (options['attributes'] === undefined) return entries.filter(entry => !this._hasAttribute(entry, 'hidden'));
        const attributeFilters = this._parseLetterOptions(options['attributes'], ATTRIBUTE_TYPES);
        if (attributeFilters.length === 0) return entries;
        return entries.filter(entry => {
            return attributeFilters.every(filter => {
                const hasAttribute = this._hasAttribute(entry, filter.type);
                return filter.negate ? !hasAttribute : hasAttribute;
            });
        });
    }

    /**
     * Checks whether an entry has an attribute
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {string} type - The attribute type
     * @returns {boolean} - True if the entry has the attribute
     */
    _hasAttribute(entry, type) {
        if (type === 'directory') return entry.isDirectory();
        if (type === 'hidden') return entry.isHidden();
        if (type === 'readonly') {
            const permissions = entry.getPermissions() || '';
            return permissions.length >= 2 && permissions[1] !== 'w';
        }
        return false;
    }

    /**
     * Sorts the entries
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {object} options - The options
     * @returns {Array<DirectoryEntry|FileEntry>} - The sorted entries
     */
    _sortEntries(entries, options = {}) {
        const sortTypes = this._parseLetterOptions(options['sort'], SORT_TYPES);
        if (sortTypes.length === 0) return entries;
        return entries.sort((a, b) => {
            for (const sortType of sortTypes) {
                const comparisonResult = this._compareBySortType(a, b, sortType.type, options);
                if (comparisonResult === 0) continue;
                return sortType.negate ? -comparisonResult : comparisonResult;
            }
            return 0;
        });
    }

    /**
     * Compares two entries by sort type
     * @param {DirectoryEntry|FileEntry} entryA - The first entry
     * @param {DirectoryEntry|FileEntry} entryB - The second entry
     * @param {string} type - The sort type
     * @param {object} options - The options
     * @returns {number} - The comparison result
     */
    _compareBySortType(entryA, entryB, type, options = {}) {
        if (type === 'name') {
            return entryA.getName().localeCompare(entryB.getName());
        }
        if (type === 'size') {
            const comparisonResult = entryA.getSize() - entryB.getSize();
            if (comparisonResult !== 0) return comparisonResult;
            return entryA.getName().localeCompare(entryB.getName());
        }
        if (type === 'date') {
            const timeType = this._getTimeType(options);
            const comparisonResult = this._getTime(entryA, timeType) - this._getTime(entryB, timeType);
            if (comparisonResult !== 0) return comparisonResult;
            return entryA.getName().localeCompare(entryB.getName());
        }
        if (type === 'extension') {
            return this._compareExtensions(entryA.getName(), entryB.getName());
        }
        if (type === 'group') {
            const comparisonResult = Number(entryB.isDirectory()) - Number(entryA.isDirectory());
            if (comparisonResult !== 0) return comparisonResult;
            return entryA.getName().localeCompare(entryB.getName());
        }
        return 0;
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
     * Formats the list of the entries into a string
     * @param {Array<DirectoryEntry|FileEntry>} entries - The entries
     * @param {string} directoryPath - The path to the directory
     * @param {object} options - The options
     * @param {object} context - The context of the command execution
     * @returns {string} - The formatted list
     */
    _formatList(entries, directoryPath = '', options = {}, context = {}) {
        const showBare = Boolean(options['bare']);
        if (showBare) {
            return entries.map(entry => entry.getName()).join('\n');
        }
        const spaceString = ' ';
        const lines = [` Directory of /${directoryPath}`, ''];
        if (options['wide'] || options['column']) {
            const names = entries.map(entry => this._getWideName(entry, options));
            const fillDirection = options['column'] ? 'column' : 'row';
            const width = this._getWidth(context);
            lines.push(this._formatColumns(names, fillDirection, width));
        } else {
            const showOwner = Boolean(options['owner']);
            const rows = entries.map(entry => this._getEntryRow(entry, options));
            const ownerWidth = showOwner
                ? Math.max(1, ...rows.map(row => row.owner.length))
                : 0;
            for (const row of rows) {
                const owner = showOwner ? `${row.owner.padEnd(ownerWidth, spaceString)} ` : '';
                lines.push(`${row.date}    ${row.type.padEnd(6, spaceString)} ${row.size.padStart(16, spaceString)} ${owner}${row.name}`);
            }
        }
        const paddingLength = 16;
        const files = entries.filter(entry => !entry.isDirectory());
        const directories = entries.filter(entry => entry.isDirectory());
        const totalFilesSize = this._formatSize(files.reduce((sum, file) => sum + file.getSize(), 0), options);
        const totalDirectoriesSize = this._formatSize(directories.reduce((sum, directory) => sum + directory.getSize(), 0), options);
        const maxSizeLength = Math.max(totalFilesSize.length, totalDirectoriesSize.length);
        lines.push(`${String(files.length).padStart(paddingLength, spaceString)} File(s) ${totalFilesSize.padStart(maxSizeLength, spaceString)} bytes`);
        lines.push(`${String(directories.length).padStart(paddingLength, spaceString)} Dir(s)  ${totalDirectoriesSize.padStart(maxSizeLength, spaceString)} bytes`);
        return lines.join('\n');
    }

    /**
     * Gets the wide-format display name for an entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {object} options - The options
     * @returns {string} - The display name
     */
    _getWideName(entry, options = {}) {
        const name = Boolean(options['lowercase']) ? entry.getName().toLowerCase() : entry.getName();
        return entry.isDirectory() ? `[${name}]` : name;
    }

    /**
     * Gets the output width from the terminal or the default
     * @param {object} context - The context of the command execution
     * @returns {number} - The output width
     */
    _getWidth(context = {}) {
        const columns = context.terminal ? context.terminal.getSize().columns : DEFAULT_WIDTH;
        return columns > 0 ? columns : DEFAULT_WIDTH;
    }

    /**
     * Formats names into columns
     * @param {string[]} list - The names
     * @param {string} fillDirection - row or column
     * @param {number} width - The output width
     * @returns {string} - The formatted columns
     */
    _formatColumns(list, fillDirection = 'row', width = DEFAULT_WIDTH) {
        if (list.length === 0) return '';
        const maxLength = Math.max(...list.map(item => item.length));
        const columns = Math.max(1, Math.floor((width + DEFAULT_PADDING) / (maxLength + DEFAULT_PADDING)));
        const columnCount = Math.min(columns, list.length);
        const rowCount = Math.ceil(list.length / columnCount);
        const rows = [];
        for (let row = 0; row < rowCount; row++) {
            const values = [];
            for (let column = 0; column < columnCount; column++) {
                const index = fillDirection === 'column'
                    ? row + column * rowCount
                    : row * columnCount + column;
                if (index < list.length) {
                    values.push(list[index]);
                }
            }
            rows.push(values.map((value, index) => {
                const isLast = index === values.length - 1;
                const pad = Math.max(0, maxLength + DEFAULT_PADDING - value.length);
                return isLast ? value : `${value}${' '.repeat(pad)}`;
            }).join('').trimEnd());
        }
        return rows.join('\n');
    }

    /**
     * Gets the display fields for an entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {object} options - The options
     * @returns {{date: string, type: string, size: string, owner: string, name: string}} - The entry row
     */
    _getEntryRow(entry, options = {}) {
        const useLowerCase = Boolean(options['lowercase']);
        return {
            date: this._formatDate(this._getTime(entry, this._getTimeType(options)), options),
            type: entry.isDirectory() ? '<DIR>' : '<FILE>',
            size: this._formatSize(entry.getSize(), options),
            owner: entry.getOwner() || '',
            name: useLowerCase ? entry.getName().toLowerCase() : entry.getName(),
        };
    }

    /**
     * Formats the date
     * @param {number} timestamp - The timestamp to format
     * @param {object} options - The options
     * @returns {string} - The formatted date
     */
    _formatDate(timestamp, options = {}) {
        const pad = (value) => value.toString().padStart(2, '0');
        const date = new Date(timestamp);
        const year = Boolean(options['four-digit-year']) ? date.getFullYear() : pad(date.getFullYear() % 100);
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${day}.${month}.${year}  ${hours}:${minutes}`;
    }

    /**
     * Formats the size
     * @param {number} size - The size
     * @param {object} options - The options
     * @returns {string} - The formatted size
     */
    _formatSize(size, options = {}) {
        const thousandSeparator = Boolean(options['thousands']) ? ' ' : '';
        return String(size).replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }

    /**
     * Parses letter options into options
     * @param {string} value - The value
     * @param {object} types - The types
     * @returns {Array<{type: string, negate: boolean}>} - The options
     */
    _parseLetterOptions(value, types) {
        if (typeof value !== 'string' || value.length === 0) return [];
        const normalizedValue = value.toUpperCase();
        const keys = Object.keys(types).join('');
        if (!new RegExp(`^[-${keys}]+$`).test(normalizedValue)) return [];
        const result = [];
        let negate = false;
        for (const character of normalizedValue) {
            if (character === '-') { negate = true; continue; }
            if (types[character]) {
                result.push({ type: types[character], negate });
                negate = false;
            }
        }
        return result;
    }

    /**
     * Gets the time type from options or the default
     * @param {object} options - The options
     * @returns {string} - The time type
     */
    _getTimeType(options = {}) {
        const timeType = options['time'];
        if (typeof timeType !== 'string' || timeType.length === 0) return DEFAULT_TIME_TYPE;
        const type = timeType[0].toUpperCase();
        if (TIME_TYPES[type]) return TIME_TYPES[type];
        return DEFAULT_TIME_TYPE;
    }

    /**
     * Gets the time of the entry
     * @param {DirectoryEntry|FileEntry} entry - The entry
     * @param {string} timeType - The time type
     * @returns {number} - The time
     */
    _getTime(entry, timeType) {
        if (timeType === 'created') return entry.getCreated();
        if (timeType === 'accessed') return entry.getAccessed();
        if (timeType === 'written') return entry.getModified();
        return entry.getModified();
    }
}

export default Directory