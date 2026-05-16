import FileSystemManager from './file-system-manager.js'
import DirectoryEntry from './directory-entry.js'
import FileEntry from './file-entry.js'
import Path from './path.js'

/**
 * FileSystemExplorer - Provides file system navigation similar to Windows Explorer or command-line
 * Maintains current directory, navigation history, and provides convenient navigation methods
 */
export class FileSystemExplorer {
    /**
     * Creates a FileSystemExplorer instance
     * @param {FileSystemManager} fileSystemManager - The file system manager to use
     * @param {string} initialPath - Initial path to start at (default: '' for root)
     */
    constructor(fileSystemManager, initialPath = '') {
        if (!fileSystemManager || !(fileSystemManager instanceof FileSystemManager)) {
            throw new Error('FileSystemExplorer requires a FileSystemManager instance');
        }
        this.fileSystemManager = fileSystemManager;
        this.currentPath = initialPath || '';
        this.history = [this.currentPath];
        this.historyIndex = 0;
    }

    /**
     * Gets the file system manager
     * @returns {FileSystemManager} The file system manager
     */
    getFileSystemManager() {
        return this.fileSystemManager;
    }

    /**
     * Gets the absolute path of a path relative to the current directory
     * @param {string} relativePath - Relative path (relative or absolute)
     * @returns {string} Absolute path
     */
    getAbsolutePath(path) {
        return Path.resolvePath(this.currentPath, path);
    }

    /**
     * Gets the relative path from the current directory to a path
     * @param {string} path - Relative path from the current directory to a path
     * @returns {string} Relative path (e.g., '../dir/file' or '.' for same path)
     */
    getRelativePathTo(path) {
        return Path.getRelativePath(this.currentPath, path);
    }

    /**
     * Gets the relative path to the current directory from a path
     * @param {string} path - Relative path to the current directory from a path
     * @returns {string} Relative path (e.g., '../dir/file' or '.' for same path)
     */
    getRelativePathFrom(path) {
        return Path.getRelativePath(path, this.currentPath);
    }

    /**
     * Gets the current directory path
     * @returns {string} Current directory path (empty string for root)
     */
    getCurrentPath() {
        return this.currentPath;
    }

    /**
     * Gets the current directory entry
     * @returns {DirectoryEntry|null} Current directory entry, or null if path is invalid
     */
    getCurrentDirectory() {
        return this.fileSystemManager.getDirectory(this.currentPath);
    }

    /**
     * Checks if currently at root directory
     * @returns {boolean} True if at root, false otherwise
     */
    isAtRoot() {
        return this.currentPath === '' || this.currentPath === null;
    }

    /**
     * Gets the path of the root directory
     * @returns {string} The path of the root directory
     */
    getRootPath() {
        return this.fileSystemManager.getRootName();
    }

    /**
     * Gets the root directory entry
     * @returns {DirectoryEntry} The root directory entry
     */
    getRootDirectory() {
        return this.fileSystemManager.getRoot();
    }

    /**
     * Changes the current directory to the specified path
     * Supports relative paths (../, ../../, ./dir, etc.) and absolute paths
     * @param {string} path - Path to navigate to (relative or absolute)
     * @returns {boolean} True if navigation was successful, false otherwise
     * @throws {Error} If path format is invalid
     */
    changeDirectory(path) {
        if (!path || typeof path !== 'string') return false;
        const absolutePath = this.getAbsolutePath(path);
        const directory = this.fileSystemManager.getDirectory(absolutePath);
        if (!directory) return false;
        this.currentPath = absolutePath;
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(this.currentPath);
        this.historyIndex = this.history.length - 1;
        return true;
    }

    /**
     * Navigates to the parent directory
     * @returns {boolean} True if navigation was successful, false if already at root
     */
    goUp() {
        if (this.isAtRoot()) return false;
        const parts = Path.getParts(this.currentPath);
        if (parts.length <= 1) return this.changeDirectory('');
        const parentParts = parts.slice(0, -1);
        const parentPath = Path.create(...parentParts);
        return this.changeDirectory(parentPath);
    }

    /**
     * Navigates to root directory
     * @returns {boolean} Always returns true
     */
    goToRoot() {
        return this.changeDirectory('');
    }

    /**
     * Navigates back in history (like browser back button)
     * @returns {boolean} True if navigation was successful, false if already at beginning
     */
    goBack() {
        if (!this.canGoBack()) return false;
        this.historyIndex--;
        this.currentPath = this.history[this.historyIndex];
        return true;
    }

    /**
     * Navigates forward in history (like browser forward button)
     * @returns {boolean} True if navigation was successful, false if already at end
     */
    goForward() {
        if (!this.canGoForward()) return false;
        this.historyIndex++;
        this.currentPath = this.history[this.historyIndex];
        return true;
    }

    /**
     * Checks if can navigate back
     * @returns {boolean} True if back navigation is possible
     */
    canGoBack() {
        return this.historyIndex > 0;
    }
    
    /**
     * Checks if can navigate forward
     * @returns {boolean} True if forward navigation is possible
     */
    canGoForward() {
        return this.historyIndex < this.history.length - 1;
    }

    /**
     * Clears navigation history
     */
    clearHistory() {
        this.history = [this.currentPath];
        this.historyIndex = 0;
    }

    /**
     * Gets navigation history
     * @returns {string[]} Array of paths in history
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Gets all entries (files and directories) in the current directory
     * @returns {Array<DirectoryEntry|FileEntry>} Array of entries in current directory
     */
    getEntries() {
        return this.fileSystemManager.getEntriesAt(this.currentPath);
    }

    /**
     * Gets only files in the current directory
     * @returns {FileEntry[]} Array of file entries
     */
    getFiles() {
        return this.fileSystemManager.getFilesAt(this.currentPath);
    }

    /**
     * Gets only directories in the current directory
     * @returns {DirectoryEntry[]} Array of directory entries
     */
    getDirectories() {
        return this.fileSystemManager.getDirectoriesAt(this.currentPath);
    }

    /**
     * Gets information about the current directory
     * @returns {Object} Directory information object
     */
    getCurrentDirectoryInfo() {
        const directory = this.getCurrentDirectory();
        if (!directory) return null;
        const files = this.getFiles();
        const directories = this.getDirectories();
        return {
            path: this.currentPath || '/',
            name: directory.getName(),
            entries: files.length + directories.length,
            files: files.length,
            directories: directories.length,
            empty: directory.isEmpty(),
            size: directory.getSize(),
            depth: Path.getDepth(this.currentPath)
        };
    }

    /**
     * Checks if a path exists relative to current directory
     * @param {string} path - Path to check (relative or absolute)
     * @returns {boolean} True if path exists
     */
    exists(path) {
        return this.fileSystemManager.exists(this.getAbsolutePath(path));
    }

    /**
     * Gets an entry at the specified path relative to current directory
     * @param {string} path - Path to entry (relative or absolute)
     * @returns {DirectoryEntry|FileEntry|null} Entry if found, null otherwise
     */
    getEntry(path) {
        return this.fileSystemManager.getEntry(this.getAbsolutePath(path));
    }

    /**
     * Gets a file at the specified path relative to current directory
     * @param {string} path - Path to file (relative or absolute)
     * @returns {FileEntry|null} File entry if found, null otherwise
     */
    getFile(path) {
        return this.fileSystemManager.getFile(this.getAbsolutePath(path));
    }

    /**
     * Gets a directory at the specified path relative to current directory
     * @param {string} path - Path to directory (relative or absolute)
     * @returns {DirectoryEntry|null} Directory entry if found, null otherwise
     */
    getDirectory(path) {
        return this.fileSystemManager.getDirectory(this.getAbsolutePath(path));
    }

    /**
     * Creates a file at the specified path with the given content
     * @param {string} path - Path to the file
     * @param {string} content - Content of the file
     * @param {boolean} overwrite - If true, overwrites existing file
     * @returns {FileEntry} The created file entry
     */
    createFile(path, content = '', overwrite = false) {
        return this.fileSystemManager.createFile(this.getAbsolutePath(path), content, overwrite);
    }

    /**
     * Creates a directory at the specified path relative to the current directory
     * @param {string} path - Path to the directory
     * @param {boolean} overwrite - If true, overwrites existing directory
     * @returns {DirectoryEntry} The created directory entry
     */
    createDirectory(path, overwrite = false) {
        return this.fileSystemManager.createDirectory(this.getAbsolutePath(path), overwrite);
    }
}

export default FileSystemExplorer
