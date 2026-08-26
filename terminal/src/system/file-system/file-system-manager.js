import DirectoryEntry from './directory-entry.js'
import FileEntry from './file-entry.js'
import Path from './path.js'
import PathSearch from './path-search.js'

/**
 * FileSystemManager - Manages an in-memory hierarchical file system
 * Provides methods for creating, reading, updating, and deleting files and directories
 */
export class FileSystemManager {
    /**
     * Creates a new FileSystemManager instance
     * @param {string} rootDirectoryName - Name of the root directory (default: 'root')
     */
    constructor(rootDirectoryName = 'root') {
        this.rootDirectory = new DirectoryEntry(rootDirectoryName);
    }

    /**
     * Gets the root directory entry
     * @returns {DirectoryEntry} The root directory entry
     */
    getRoot() {
        return this.rootDirectory;
    }

    /**
     * Gets the name of the root directory
     * @returns {string} The name of the root directory
     */
    getRootName() {
        return this.rootDirectory.getName();
    }

    /**
     * Validates that a path is a valid string and doesn't contain invalid characters
     * @private
     * @param {string|null|undefined} path - Path to validate
     * @throws {Error} If path is not a string or contains invalid characters (//, .. as path component)
     */
    _validatePath(path) {
        if (path === null || path === undefined) {
            return; // Allow null/undefined for optional path parameters
        }
        if (typeof path !== 'string') {
            throw new Error('Path must be a string');
        }
        // Check for double slashes (path separator issue)
        if (path.includes('//')) {
            throw new Error('Invalid path: contains double slashes');
        }
        // Check for '..' as a path component (directory traversal), but allow it in filenames
        // Split path and check if any part is exactly '..'
        const parts = path.split('/').filter(p => p !== '');
        if (parts.includes('..')) {
            throw new Error('Invalid path: contains parent directory reference (..)');
        }
    }

    /**
     * Validates that an entry name is valid (non-empty, no path separators)
     * @private
     * @param {string} name - Entry name to validate
     * @throws {Error} If name is empty or contains path separators
     */
    _validateName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Entry name must be a non-empty string');
        }
        if (name.includes('/') || name.includes('\\')) {
            throw new Error('Entry name cannot contain path separators');
        }
    }

    /**
     * Gets the parent directory of a given path
     * @private
     * @param {string} path - Path to get parent directory for
     * @returns {DirectoryEntry} Parent directory entry, or root if path is at root level
     */
    _getParentDirectory(path) {
        const parts = Path.getParts(path);
        if (parts.length === 0) return this.rootDirectory;
        const parentParts = parts.slice(0, -1);
        if (parentParts.length === 0) return this.rootDirectory;
        const parentPath = Path.create(...parentParts);
        return this.getDirectory(parentPath);
    }

    /**
     * Creates a directory at the specified path
     * Creates parent directories if they don't exist
     * @param {string} path - Path where the directory should be created
     * @param {boolean} overwrite - If true, removes existing entry at path before creating (default: false)
     * @returns {DirectoryEntry} The created directory entry
     * @throws {Error} If creating the directory fails
     */
    createDirectory(path, overwrite = false) {
        this._validatePath(path);
        const parts = Path.getParts(path);
        if (parts.length === 0) return this.rootDirectory;
        const name = parts.pop();
        if (!name) {
            throw new Error('Directory name cannot be empty');
        }
        const existingFile = this.getFile(path);
        if (existingFile && !overwrite) {
            throw new Error(`A file already exists at path: ${path}`);
        }
        if (existingFile && overwrite) {
            this.removeFile(path);
        }
        const existingDirectory = this.getDirectory(path);
        if (existingDirectory) {
            if (!overwrite) return existingDirectory;
            this.removeDirectory(path, true);
        }
        let currentDirectory = this.rootDirectory;
        for (let part of parts) {
            let directory = currentDirectory.getEntry(part);
            if (!directory) {
                directory = new DirectoryEntry(part);
                currentDirectory.addEntry(directory);
            } else if (!(directory instanceof DirectoryEntry)) {
                throw new Error(`Cannot create directory: ${part} is a file`);
            }
            currentDirectory = directory;
        }
        const directory = new DirectoryEntry(name);
        currentDirectory.addEntry(directory);
        return directory;
    }

    /**
     * Creates multiple directories at once
     * @param {string[]} paths - Array of paths where directories should be created
     * @returns {DirectoryEntry[]} Array of created directory entries
     * @throws {Error} If creating the directories fails
     */
    createDirectories(paths) {
        if (!Array.isArray(paths)) {
            throw new Error('Paths must be an array');
        }
        return paths.map(path => this.createDirectory(path));
    }

    /**
     * Creates a file at the specified path with the given content
     * Creates parent directories if they don't exist
     * @param {string} path - Path where the file should be created
     * @param {string} content - Initial file content (default: '')
     * @param {boolean} overwrite - If true, overwrites existing file or removes directory at path (default: false)
     * @returns {FileEntry} The created file entry
     * @throws {Error} If creating the file fails
     */
    createFile(path, content = '', overwrite = false) {
        this._validatePath(path);
        const parts = Path.getParts(path);
        if (parts.length === 0) {
            throw new Error('Cannot create file at root path');
        }
        const name = parts.pop();
        if (!name) {
            throw new Error('File name cannot be empty');
        }
        const existingDirectory = this.getDirectory(path);
        if (existingDirectory && !overwrite) {
            throw new Error(`A directory already exists at path: ${path}`);
        }
        if (existingDirectory && overwrite) {
            this.removeDirectory(path, true);
        }
        const existingFile = this.getFile(path);
        if (existingFile != null) {
            if (!overwrite) return existingFile;
            existingFile.write(content);
            return existingFile;
        }
        let currentDirectory = this.rootDirectory;
        for (let part of parts) {
            let directory = currentDirectory.getEntry(part);
            if (!directory) {
                directory = new DirectoryEntry(part);
                currentDirectory.addEntry(directory);
            } else if (!(directory instanceof DirectoryEntry)) {
                throw new Error(`Cannot create file: ${part} is a file, not a directory`);
            }
            currentDirectory = directory;
        }
        const file = new FileEntry(name, content);
        currentDirectory.addEntry(file);
        return file;
    }

    /**
     * Creates multiple files at once
     * @param {string[]} paths - Array of paths where files should be created
     * @param {string} content - Initial content for all files (default: '')
     * @returns {FileEntry[]} Array of created file entries
     * @throws {Error} If creating the files fails
     */
    createFiles(paths, content = '') {
        if (!Array.isArray(paths)) {
            throw new Error('Paths must be an array');
        }
        return paths.map(path => this.createFile(path, content));
    }

    /**
     * Gets a directory entry at the specified path
     * @param {string|null|undefined|''} path - Path to the directory (empty string or null returns root)
     * @returns {DirectoryEntry|null} The directory entry, or null if not found or path points to a file
     */
    getDirectory(path) {
        this._validatePath(path);
        if (!path) return this.rootDirectory;
        const parts = Path.getParts(path);
        let currentDirectory = this.rootDirectory;
        if (parts.length === 0) return currentDirectory;
        for (let part of parts) {
            currentDirectory = currentDirectory.getEntry(part);
            if (!currentDirectory || !(currentDirectory instanceof DirectoryEntry)) return null;
        }
        return currentDirectory;
    }

    /**
     * Gets multiple directory entries by their paths
     * @param {...string} paths - Variable number of paths to get directories for
     * @returns {DirectoryEntry[]} Array of directory entries (null entries are filtered out)
     */
    getDirectories(...paths) {
        return paths.map(path => this.getDirectory(path)).filter(entry => entry != null);
    }

    /**
     * Gets a file entry at the specified path
     * @param {string|null|undefined|''} path - Path to the file
     * @returns {FileEntry|null} The file entry, or null if not found or path points to a directory
     */
    getFile(path) {
        this._validatePath(path);
        if (!path) return null;
        const parts = Path.getParts(path);
        if (parts.length === 0) return null;
        let currentDirectory = this.rootDirectory;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDirectory = currentDirectory.getEntry(parts[i]);
            if (!currentDirectory || !(currentDirectory instanceof DirectoryEntry)) return null;
        }
        const lastEntry = currentDirectory.getEntry(parts[parts.length - 1]);
        return lastEntry instanceof FileEntry ? lastEntry : null;
    }

    /**
     * Gets multiple file entries by their paths
     * @param {...string} paths - Variable number of paths to get files for
     * @returns {FileEntry[]} Array of file entries (null entries are filtered out)
     */
    getFiles(...paths) {
        return paths.map(path => this.getFile(path)).filter(entry => entry != null);
    }

    /**
     * Gets any entry (file or directory) at the specified path
     * @param {string|null|undefined|''} path - Path to the entry (empty string or null returns root)
     * @returns {DirectoryEntry|FileEntry|null} The entry, or null if not found
     */
    getEntry(path) {
        this._validatePath(path);
        if (!path) return this.rootDirectory;
        const parts = Path.getParts(path);
        let currentDirectory = this.rootDirectory;
        if (parts.length === 0) return currentDirectory;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDirectory = currentDirectory.getEntry(parts[i]);
            if (!currentDirectory || !(currentDirectory instanceof DirectoryEntry)) return null;
        }
        const lastEntry = currentDirectory.getEntry(parts[parts.length - 1]);
        return lastEntry ? lastEntry : null;
    }

    /**
     * Gets multiple entries (files or directories) by their paths
     * @param {...string} paths - Variable number of paths to get entries for
     * @returns {Array<DirectoryEntry|FileEntry>} Array of entries (null entries are filtered out)
     */
    getEntries(...paths) {
        return paths.map(path => this.getEntry(path)).filter(entry => entry != null);
    }

    /**
     * Removes a directory at the specified path
     * @param {string} path - Path to the directory to remove
     * @param {boolean} recursive - If true, removes directory and all its contents (default: false)
     * @returns {DirectoryEntry|null} The removed directory entry, or null if not found
     * @throws {Error} If directory is not empty
     */
    removeDirectory(path, recursive = false) {
        this._validatePath(path);
        const parts = Path.getParts(path);
        if (parts.length === 0) return null;
        let currentDirectory = this.rootDirectory;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDirectory = currentDirectory.getEntry(parts[i]);
            if (!currentDirectory || !(currentDirectory instanceof DirectoryEntry)) return null;
        }
        const directoryToRemove = currentDirectory.getEntry(parts[parts.length - 1]);
        if (!directoryToRemove || !(directoryToRemove instanceof DirectoryEntry)) return null;
        if (!recursive && !directoryToRemove.isEmpty(path)) {
            throw new Error(`Directory is not empty: ${path}`);
        }
        if (recursive) {
            const removeChildren = (dir) => {
                const entries = dir.getEntries();
                for (const entry of entries) {
                    if (entry instanceof DirectoryEntry) {
                        removeChildren(entry);
                    }
                    dir.removeEntry(entry.getName());
                }
            };
            removeChildren(directoryToRemove);
        }
        currentDirectory.removeEntry(directoryToRemove.getName());
        return directoryToRemove;
    }

    /**
     * Removes multiple directories by their paths
     * Supports both: removeDirectories(...paths) and removeDirectories(...paths, recursive)
     * @param {...string} paths - Variable number of paths to remove directories from
     * @param {boolean} recursive - If true, removes directory and all its contents
     * @returns {DirectoryEntry[]} Array of removed directory entries (null entries are filtered out)
     */
    removeDirectories(...paths) {
        let recursive = false;
        let actualPaths = paths;
        if (paths.length > 0 && typeof paths[paths.length - 1] === 'boolean') {
            recursive = paths[paths.length - 1];
            actualPaths = paths.slice(0, -1);
        }
        return actualPaths.map(path => this.removeDirectory(path, recursive)).filter(entry => entry != null);
    }

    /**
     * Removes a file at the specified path
     * @param {string} path - Path to the file to remove
     * @returns {FileEntry|null} The removed file entry, or null if not found
     */
    removeFile(path) {
        this._validatePath(path);
        const parts = Path.getParts(path);
        if (parts.length === 0) return null;
        let currentDirectory = this.rootDirectory;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDirectory = currentDirectory.getEntry(parts[i]);
            if (!currentDirectory || !(currentDirectory instanceof DirectoryEntry)) return null;
        }
        const fileToRemove = currentDirectory.getEntry(parts[parts.length - 1]);
        if (!fileToRemove || !(fileToRemove instanceof FileEntry)) return null;
        currentDirectory.removeEntry(fileToRemove.getName());
        return fileToRemove;
    }

    /**
     * Removes multiple files by their paths
     * @param {...string} paths - Variable number of paths to remove files from
     * @returns {FileEntry[]} Array of removed file entries (null entries are filtered out)
     */
    removeFiles(...paths) {
        return paths.map(path => this.removeFile(path)).filter(entry => entry != null);
    }

    /**
     * Removes any entry (file or directory) at the specified path
     * @param {string} path - Path to the entry to remove
     * @returns {DirectoryEntry|FileEntry|null} The removed entry, or null if not found
     * @throws {Error} If directory is not empty
     */
    removeEntry(path) {
        this._validatePath(path);
        const parts = Path.getParts(path);
        if (parts.length === 0) return null;
        let currentDirectory = this.rootDirectory;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDirectory = currentDirectory.getEntry(parts[i]);
            if (!currentDirectory || !(currentDirectory instanceof DirectoryEntry)) return null;
        }
        const entryToRemove = currentDirectory.getEntry(parts[parts.length - 1]);
        if (!entryToRemove) return null;
        if (entryToRemove instanceof DirectoryEntry && !entryToRemove.isEmpty(path)) {
            throw new Error(`Directory is not empty: ${path}`);
        }
        currentDirectory.removeEntry(entryToRemove.getName());
        return entryToRemove;
    }

    /**
     * Removes multiple entries (files or directories) by their paths
     * @param {...string} paths - Variable number of paths to remove entries from
     * @returns {Array<DirectoryEntry|FileEntry>} Array of removed entries (null entries are filtered out)
     * @throws {Error} If removing the entries fails
     */
    removeEntries(...paths) {
        return paths.map(path => this.removeEntry(path)).filter(entry => entry != null);
    }

    /**
     * Gets comprehensive statistics about a directory and its contents
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {Object|null} Statistics object with files, directories, totalSize, maxDepth, isEmpty, or null if directory doesn't exist
     */
    getStatistics(path = '') {
        const directory = path === '' ? this.rootDirectory : this.getDirectory(path);
        if (!directory) return null;
        let files = 0;
        let directories = 0;
        let size = 0;
        let maxDepth = 0;
        const countEntries = (dir, depth = 0) => {
            if (depth > maxDepth) {
                maxDepth = depth;
            }
            for (const entry of dir.getEntries()) {
                if (entry instanceof DirectoryEntry) {
                    directories++;
                    countEntries(entry, depth + 1);
                } else if (entry instanceof FileEntry) {
                    files++;
                    size += entry.getSize();
                }
            }
        };
        countEntries(directory);
        return {
            files: files,
            directories: directories,
            size: size,
            depth: maxDepth,
            empty: directory.getEntries().length === 0
        };
    }

    /**
     * Gets the maximum depth of a directory tree (deepest nested directory)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {number} Maximum depth, or -1 if directory doesn't exist
     */
    getDepth(path = '') {
        const directory = path === '' ? this.rootDirectory : this.getDirectory(path);
        if (!directory) return -1;
        let maxDepth = 0;
        const calculateDepth = (dir, currentDepth = 0) => {
            if (currentDepth > maxDepth) {
                maxDepth = currentDepth;
            }
            for (const entry of dir.getEntries()) {
                if (entry instanceof DirectoryEntry) {
                    calculateDepth(entry, currentDepth + 1);
                }
            }
        };
        calculateDepth(directory);
        return maxDepth;
    }

    /**
     * Checks if an entry exists at the specified path
     * @param {string} path - Path to check
     * @returns {boolean} True if entry exists, false otherwise
     */
    exists(path) {
        return this.getEntry(path) !== null;
    }

    /**
     * Checks if the path points to a directory
     * @param {string} path - Path to check
     * @returns {boolean} True if path points to a directory, false otherwise
     */
    directoryExists(path) {
        return this.getDirectory(path) !== null;
    }

    /**
     * Checks if the path points to a file
     * @param {string} path - Path to check
     * @returns {boolean} True if path points to a file, false otherwise
     */
    fileExists(path) {
        return this.getFile(path) !== null;
    }

    /**
     * Gets the full path string for a given entry object
     * @param {DirectoryEntry|FileEntry} entry - Entry object to get path for
     * @returns {string|null} Full path string (empty string for root), or null if entry not found
     */
    getPath(entry) {
        if (!entry) return null;
        if (entry === this.rootDirectory) return '';
        const findPath = (dir, targetEntry, currentPath = '') => {
            for (const childEntry of dir.getEntries()) {
                const childPath = currentPath === ''
                    ? childEntry.getName()
                    : Path.create(currentPath, childEntry.getName());

                if (childEntry === targetEntry) {
                    return childEntry instanceof DirectoryEntry
                        ? `${childPath}/`
                        : childPath;
                }
                if (childEntry instanceof DirectoryEntry) {
                    const found = findPath(childEntry, targetEntry, childPath);
                    if (found !== null) return found;
                }
            }
            return null;
        };
        const path = findPath(this.rootDirectory, entry);
        return path;
    }

    /**
     * Gets all entries (files and directories) in a directory
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {Array<DirectoryEntry|FileEntry>} Array of entries in the directory
     */
    getEntriesAt(path = '') {
        const directory = path === '' ? this.rootDirectory : this.getDirectory(path);
        if (!directory) return [];
        return directory.getEntries();
    }

    /**
     * Gets only directories in a directory
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {DirectoryEntry[]} Array of directory entries in the directory
     */
    getDirectoriesAt(path = '') {
        return this.getEntriesAt(path).filter(entry => entry instanceof DirectoryEntry);
    }

    /**
     * Gets only files in a directory
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {FileEntry[]} Array of file entries in the directory
     */
    getFilesAt(path = '') {
        return this.getEntriesAt(path).filter(entry => entry instanceof FileEntry);
    }

    /**
     * Gets the count of entries (files and directories) in a directory
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {number} Number of entries in the directory
     */
    getEntryCount(path = '') {
        return this.getEntriesAt(path).length;
    }

    /**
     * Gets the count of directories in a directory
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {number} Number of directories in the directory
     */
    getDirectoryCount(path = '') {
        return this.getDirectoriesAt(path).length;
    }

    /**
     * Gets the count of files in a directory
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {number} Number of files in the directory
     */
    getFileCount(path = '') {
        return this.getFilesAt(path).length;
    }

    /**
     * Moves any entry (file or directory) from source path to destination path
     * Automatically determines entry type and calls appropriate move method
     * @param {string} sourcePath - Current path of the entry
     * @param {string} destinationPath - New path for the entry
     * @param {boolean} overwrite - If true, replaces existing entry at destination (default: false)
     * @returns {DirectoryEntry|FileEntry} The moved entry
     * @throws {Error} If moving the entry fails
     */
    move(sourcePath, destinationPath, overwrite = false) {
        this._validatePath(sourcePath);
        this._validatePath(destinationPath);
        if (sourcePath === '') {
            throw new Error('Source path cannot be empty');
        }
        const entry = this.getEntry(sourcePath);
        if (!entry) {
            throw new Error(`Source entry does not exist: ${sourcePath}`);
        }
        if (this.rootDirectory === entry) {
            throw new Error('Cannot move root directory');
        }
        const sourceParentDirectory = this._getParentDirectory(sourcePath);
        if (!sourceParentDirectory) {
            throw new Error('Parent directory for source does not exist');
        }
        if (entry.isDirectory()) {
            const normalizedSource = Path.trim(sourcePath);
            const normalizedDest = Path.trim(destinationPath);
            if (normalizedDest === normalizedSource) {
                throw new Error('Cannot move directory into itself');
            }
            if (normalizedDest.startsWith(normalizedSource + '/')) {
                throw new Error('Cannot move directory into its own subdirectory');
            }
        }
        const sourceName = Path.getName(sourcePath);
        const destinationEntry = this.getEntry(destinationPath);
        const finalDestinationPath = destinationEntry && destinationEntry.isDirectory()
            ? Path.create(destinationPath, sourceName)
            : destinationPath;
        const destinationParentDirectory = this._getParentDirectory(finalDestinationPath);
        if (!destinationParentDirectory) {
            throw new Error('Parent directory for destination does not exist');
        }
        const finalDestinationEntry = this.getEntry(finalDestinationPath);
        if (finalDestinationEntry && !overwrite) {
            throw new Error(`Destination already exists: ${finalDestinationPath}`);
        }
        if (finalDestinationEntry && overwrite) {
            this.removeEntry(finalDestinationPath);
        }
        const entryName = entry.getName();
        sourceParentDirectory.removeEntry(entryName);
        const newName = Path.getName(finalDestinationPath);
        if (newName !== entryName) {
            entry.rename(newName);
        }
        destinationParentDirectory.addEntry(entry);
        return entry;
    }

    /**
     * Copies an entry (file or directory) from source path to destination path
     * @param {string} sourcePath - Path of the source entry
     * @param {string} destinationPath - Path where the entry should be copied
     * @returns {DirectoryEntry|FileEntry} The copied entry
     * @throws {Error} If copying the entry fails
     */
    copy(sourcePath, destinationPath, overwrite = false) {
        this._validatePath(sourcePath);
        this._validatePath(destinationPath);
        if (sourcePath === '') {
            throw new Error('Source path cannot be empty');
        }
        const entry = this.getEntry(sourcePath);
        if (!entry) {
            throw new Error(`Source entry does not exist: ${sourcePath}`);
        }
        if (this.rootDirectory === entry) {
            throw new Error('Cannot copy root directory');
        }
        const sourceParentDirectory = this._getParentDirectory(sourcePath);
        if (!sourceParentDirectory) {
            throw new Error('Parent directory for source does not exist');
        }
        if (entry.isDirectory()) {
            const normalizedSource = Path.trim(sourcePath);
            const normalizedDest = Path.trim(destinationPath);
            if (normalizedDest === normalizedSource) {
                throw new Error('Cannot copy directory into itself');
            }
            if (normalizedDest.startsWith(normalizedSource + '/')) {
                throw new Error('Cannot copy directory into its own subdirectory');
            }
        }
        const sourceName = Path.getName(sourcePath);
        const destinationEntry = this.getEntry(destinationPath);
        const finalDestinationPath = destinationEntry && destinationEntry.isDirectory()
            ? Path.create(destinationPath, sourceName)
            : destinationPath;
        const destinationParentDirectory = this._getParentDirectory(finalDestinationPath);
        if (!destinationParentDirectory) {
            throw new Error('Parent directory for destination does not exist');
        }
        const finalDestinationEntry = this.getEntry(finalDestinationPath);
        if (finalDestinationEntry && !overwrite) {
            throw new Error(`Destination already exists: ${finalDestinationPath}`);
        }
        if (finalDestinationEntry && overwrite) {
            this.removeEntry(finalDestinationPath);
        }
        const cloneEntry = (entryToCopy, name) => {
            if (entryToCopy instanceof DirectoryEntry) {
                const directory = new DirectoryEntry(name);
                for (const childEntry of entryToCopy.getEntries()) {
                    directory.addEntry(cloneEntry(childEntry, childEntry.getName()));
                }
                return directory;
            }
            return new FileEntry(name, new Uint8Array(entryToCopy.read()));
        };
        const newName = Path.getName(finalDestinationPath);
        const copiedEntry = cloneEntry(entry, newName);
        destinationParentDirectory.addEntry(copiedEntry);
        return copiedEntry;
    }

    /**
     * Renames an entry (file or directory)
     * @param {string} path - Path to the entry
     * @param {string} name - New name for the entry
     * @returns {DirectoryEntry|FileEntry} The renamed entry
     * @throws {Error} If entry does not exist
     */
    rename(path, name) {
        this._validatePath(path);
        this._validateName(name);
        const entry = this.getEntry(path);
        if (!entry) {
            throw new Error(`Entry does not exist: ${path}`);
        }
        entry.rename(name);
        return entry;
    }

    /**
     * Gets all paths in the filesystem using depth-first search
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {EntryPath[]} Array of EntryPath objects containing entry and path information
     */
    getEntryPaths(path = '') {
        if (!path) return PathSearch.depthFirstSearch(this.rootDirectory, '');
        const directory = this.getDirectory(path);
        if (!directory) return [];
        return PathSearch.depthFirstSearch(directory, '');
    }

    /**
     * Gets all paths in a directory as strings (not EntryPath objects)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {string[]} Array of path strings
     */
    getPaths(path = '') {
        const paths = this.getEntryPaths(path);
        return paths.map(ep => ep.getPath());
    }

    /**
     * Gets all file paths as strings
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {string[]} Array of file path strings
     */
    getFilePaths(path = '') {
        const paths = this.getEntryPaths(path);
        return paths
            .filter(ep => ep.getEntry() instanceof FileEntry)
            .map(ep => ep.getPath());
    }

    /**
     * Gets all directory paths as strings
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {string[]} Array of directory path strings (with trailing '/')
     */
    getDirectoryPaths(path = '') {
        const paths = this.getEntryPaths(path);
        return paths
            .filter(ep => ep.getEntry() instanceof DirectoryEntry)
            .map(ep => ep.getPath());
    }

    /**
     * Filters all paths in the filesystem using a callback function
     * @param {Function} callback - Function that receives EntryPath and returns boolean
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {EntryPath[]} Array of EntryPath objects that match the filter
     */
    filter(callback, path = '') {
        if (typeof callback != 'function') return [];
        return this.getEntryPaths(path).filter(path => callback(path));
    }

    /**
     * Searches for entries whose names contain the search string
     * @param {string} search - String to search for in entry names
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {EntryPath[]} Array of EntryPath objects matching the search
     */
    search(search, path = '') {
        if (!search || typeof search !== 'string') return [];
        return this.filter(path => path.getEntry().getName().includes(search), path);
    }

    /**
     * Finds entry paths matching a pattern with advanced options
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options
     * @param {string} options.type - Filter by type: 'all', 'file', or 'directory' (default: 'all')
     * @param {boolean} options.caseSensitive - Whether search is case sensitive (default: false)
     * @param {boolean} options.useRegex - Whether pattern is a regex (default: false)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {EntryPath[]} Array of EntryPath objects matching the pattern
     * @throws {Error} If the pattern is invalid
     */
    find(pattern, options = {}, path = '') {
        if (typeof pattern !== 'string') return [];
        const { type = 'all', useRegex = false, caseSensitive = false } = options;
        let regex;
        if (useRegex) {
            try {
                regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
            } catch (e) {
                throw new Error(`Invalid regex pattern: ${pattern}`);
            }
        } else {
            const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            regex = new RegExp(escapedPattern, caseSensitive ? 'g' : 'gi');
        }
        return this.filter(path => {
            const entry = path.getEntry();
            const name = entry.getName();
            let matches;
            if (useRegex) {
                regex.lastIndex = 0;
                matches = regex.test(name);
            } else {
                matches = caseSensitive
                    ? name.includes(pattern)
                    : name.toLowerCase().includes(pattern.toLowerCase());
            }
            if (!matches) return false;
            if (type === 'file') return entry instanceof FileEntry;
            if (type === 'directory') return entry instanceof DirectoryEntry;
            return true;
        }, path);
    }

    /**
     * Finds entries matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {Array<FileEntry|DirectoryEntry>} Array of file or directory entries matching the pattern
     */
    findEntries(pattern, options = {}, path = '') {
        return this.find(pattern, options, path).map(ep => ep.getEntry());
    }

    /**
     * Finds paths of entries matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {string[]} Array of path strings matching the pattern
     */
    findPaths(pattern, options = {}, path = '') {
        return this.find(pattern, options, path).map(ep => ep.getPath());
    }

    /**
     * Finds file entry paths matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {EntryPath[]} Array of EntryPath objects for matching files
     */
    findFileEntryPaths(pattern, options = {}, path = '') {
        return this.find(pattern, { ...options, type: 'file' }, path);
    }

    /**
     * Finds file entries matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {FileEntry[]} Array of FileEntry objects for matching files
     */
    findFiles(pattern, options = {}, path = '') {
        return this.findFileEntryPaths(pattern, options, path).map(ep => ep.getEntry());
    }

    /**
     * Finds paths of file entries matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {string[]} Array of file path strings matching the pattern
     */
    findFilePaths(pattern, options = {}, path = '') {
        return this.findFileEntryPaths(pattern, options, path).map(ep => ep.getPath());
    }

    /**
     * Finds directory entry paths matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {EntryPath[]} Array of EntryPath objects for matching directories
     */
    findDirectoryEntryPaths(pattern, options = {}, path = '') {
        return this.find(pattern, { ...options, type: 'directory' }, path);
    }

    /**
     * Finds directory entries matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {DirectoryEntry[]} Array of DirectoryEntry objects for matching directories
     */
    findDirectories(pattern, options = {}, path = '') {
        return this.findDirectoryEntryPaths(pattern, options, path).map(ep => ep.getEntry());
    }

    /**
     * Finds paths of directory entries matching a pattern
     * @param {string} pattern - Pattern to search for
     * @param {object} options - Search options (see find() for details)
     * @param {string} path - Path to the directory (default: '' for root)
     * @returns {string[]} Array of directory path strings matching the pattern
     */
    findDirectoryPaths(pattern, options = {}, path = '') {
        return this.findDirectoryEntryPaths(pattern, options, path).map(ep => ep.getPath());
    }

    /**
     * Serializes the entire filesystem to a JSON object
     * @returns {Object} JSON object representing the filesystem structure
     */
    toJSON() {
        const serializeEntry = (entry) => {
            if (entry instanceof DirectoryEntry) {
                return {
                    type: 'directory',
                    name: entry.getName(),
                    entries: entry.getEntries().map(e => serializeEntry(e))
                };
            } else if (entry instanceof FileEntry) {
                return {
                    type: 'file',
                    name: entry.getName(),
                    content: entry.read()
                };
            }
            return null;
        };
        return {
            rootName: this.rootDirectory.getName(),
            root: serializeEntry(this.rootDirectory)
        };
    }

    /**
     * Creates a directory from a JSON object
     * @param {string} path - Path where the directory should be created
     * @param {object} json - JSON object representing the directory structure
     * @returns {DirectoryEntry} The created directory entry
     */
    createFromJSON(path, json = {}) {
        const directory = this.createDirectory(path);
        if (!json || !json.type) {
            return directory;
        }
        const deserializeEntry = (data) => {
            if (data.type === 'directory') {
                const dir = new DirectoryEntry(data.name);
                if (data.entries && Array.isArray(data.entries)) {
                    data.entries.forEach(entryData => {
                        const entry = deserializeEntry(entryData);
                        if (entry) {
                            dir.addEntry(entry);
                        }
                    });
                }
                return dir;
            } else if (data.type === 'file') {
                return new FileEntry(data.name, data.content || '');
            }
            return null;
        };
        const entry = deserializeEntry(json);
        const currentEntry = directory.getEntry(entry.getName());
        if (currentEntry) {
            directory.removeEntry(currentEntry.getName());
        }
        directory.addEntry(entry);
        return directory;
    }

    /**
     * Deserializes a filesystem from a JSON object
     * @static
     * @param {object} json - JSON object representing the filesystem structure
     * @returns {FileSystemManager} New FileSystemManager instance with deserialized filesystem
     * @throws {Error} If the JSON structure is invalid
     */
    static fromJSON(json) {
        if (!json || !json.root) {
            throw new Error('Invalid JSON structure for filesystem');
        }
        const deserializeEntry = (data) => {
            if (data.type === 'directory') {
                const dir = new DirectoryEntry(data.name);
                if (data.entries && Array.isArray(data.entries)) {
                    data.entries.forEach(entryData => {
                        const entry = deserializeEntry(entryData);
                        if (entry) {
                            dir.addEntry(entry);
                        }
                    });
                }
                return dir;
            } else if (data.type === 'file') {
                return new FileEntry(data.name, data.content || '');
            }
            return null;
        };
        const manager = new FileSystemManager(json.rootName || 'root');
        const rootData = json.root;
        if (rootData.type === 'directory') {
            const newRoot = deserializeEntry(rootData);
            if (newRoot) {
                manager.rootDirectory = newRoot;
            }
        }
        return manager;
    }

}

export default FileSystemManager