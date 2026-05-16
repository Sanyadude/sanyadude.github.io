import DirectoryEntry from './directory-entry.js'
import FileEntry from './file-entry.js'
import EntryPath from './entry-path.js'

/**
 * PathSearch - Provides path search utilities
 * Maintains path search algorithms for breadth-first and depth-first search
 */
export class PathSearch {
    /**
     * Performs a breadth-first search on the given directory
     * @param {DirectoryEntry} directory - The directory to search
     * @param {string} prefix - The prefix to add to the path
     * @returns {EntryPath[]} The paths found
     */
    static breadthFirstSearch(directory, prefix = '') {
        let paths = [];
        let queue = [new EntryPath(directory, prefix)];
        while (queue.length > 0) {
            const currentDirectoryPath = queue.shift();
            for (const entry of currentDirectoryPath.getEntry().getEntries()) {
                const currentPath = `${currentDirectoryPath.getPath()}${entry.getName()}`;
                if (entry instanceof DirectoryEntry) {
                    const directoryPath = `${currentPath}/`;
                    paths.push(new EntryPath(entry, directoryPath));
                    queue.push(new EntryPath(entry, directoryPath));
                } else if (entry instanceof FileEntry) {
                    paths.push(new EntryPath(entry, currentPath));
                }
            }
        }
        return paths;
    }

    /**
     * Performs a depth-first search on the given directory
     * @param {DirectoryEntry} directory - The directory to search
     * @param {string} prefix - The prefix to add to the path
     * @returns {EntryPath[]} The paths found
     */
    static depthFirstSearch(directory, prefix = '') {
        let paths = [];
        let stack = directory.getEntries().map(entry => new EntryPath(entry, prefix));
        while (stack.length > 0) {
            const currentDirectoryPath = stack.pop();
            const currentEntry = currentDirectoryPath.getEntry();
            const currentPath = `${currentDirectoryPath.getPath()}${currentEntry.getName()}`;
            if (currentEntry instanceof DirectoryEntry) {
                const directoryPath = `${currentPath}/`;
                paths.push(new EntryPath(currentEntry, directoryPath));
                currentEntry.getEntries().forEach(entry => stack.push(new EntryPath(entry, directoryPath)));
            } else if (currentEntry instanceof FileEntry) {
                paths.push(new EntryPath(currentEntry, currentPath));
            }
        }
        return paths;
    }

}

export default PathSearch