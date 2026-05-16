/**
 * Path - Provides path manipulation utilities
 * Maintains path validation, splitting, resolution, and other path-related operations
 */
export class Path {
    /**
     * Gets the directory separator
     * @returns {string} The directory separator
     */
    static get DIRECTORY_SEPARATOR() {
        return '/';
    }

    /**
     * Checks if a path is valid
     * @param {string} path - The path to check
     * @returns {boolean} True if the path is valid, false otherwise
     */
    static isValid(path) {
        if (!path || typeof path !== 'string') return false;
        // Check for double slashes
        if (path.includes('//')) return false;
        // Check for '..' as a path component (not in filenames)
        const parts = path.split('/').filter(p => p !== '');
        if (parts.includes('..')) return false;
        return true;
    }

    /**
     * Creates a path from the given parameters
     * @param {...string} params - The parameters to join
     * @returns {string} The created path
     */
    static create(...params) {
        if (params.length === 0) return '';
        const isAbsolute = params[0].startsWith('/');
        const parts = params
            .map(p => p.trim())
            .filter(p => p !== '')
            .map(p => p.replace(/^\/+|\/+$/g, ''));
        const result = parts.join('/');
        return isAbsolute ? '/' + result : result;
    }

    /**
     * Gets the parts of a path
     * @param {string} path - The path to get the parts of
     * @returns {string[]} The parts of the path
     */
    static getParts(path) {
        if (!Path.isValid(path)) return [];
        const trimmed = path.trim().replace(/\\/g, '/');
        const cleaned = trimmed.replace(/^\/+|\/+$/g, '');
        const parts = cleaned.split('/');
        return parts.filter(p => p !== '');
    }

    /**
     * Trims the path
     * @param {string} path - The path to trim
     * @returns {string} The trimmed path
     */
    static trim(path) {
        if (!Path.isValid(path)) return path;
        return path.replace(/^\/+|\/+$/g, '');
    }

    /**
     * Normalizes a path:
     * - Converts backslashes to slashes
     * - Collapses consecutive slashes
     * - Trims leading/trailing slashes (optional for absolute paths)
     * @param {string} path - The path to normalize
     * @returns {string} The normalized path
     */
    static normalize(path) {
        if (!Path.isValid(path)) return path;
        //change backslashes to slashes
        let normalized = path.replace(/\\/g, '/');
        //strip start and end of ""
        normalized = normalized.replace(/^"|"$/g, '');
        //reduce multiple slashes to one
        normalized = normalized.replace(/\/+/g, '/');
        //remove trailing slash
        if (normalized !== '/' && normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized;
    }

    /**
     * Checks if a path is an absolute path
     * @param {string} path - The path to check
     * @returns {boolean} True if the path is an absolute path, false otherwise
     */
    static isAbsolutePath(path) {
        if (!Path.isValid(path)) return false;
        return path.startsWith('/');
    }

    /**
     * Gets the depth of a path
     * @param {string} path - The path to get the depth of
     * @returns {number} The depth of the path
     */
    static getDepth(path) {
        if (!Path.isValid(path)) return 0;
        return Path.getParts(path).length;
    }

    /**
     * Gets the base name of a path
     * @param {string} path - The path to get the base name of
     * @returns {string} The base name of the path
     */
    static getName(path) {
        if (!Path.isValid(path)) return '';
        const parts = Path.getParts(path);
        if (parts.length === 0) return '';
        return parts[parts.length - 1];
    }

    /**
     * Checks if a path is a subdirectory of another path
     * @param {string} parentPath - The parent path
     * @param {string} childPath - The child path
     * @returns {boolean} True if the path is a subdirectory of the other path, false otherwise
     */
    static isSubdirectory(parentPath, childPath) {
        if (!Path.isValid(parentPath) || !Path.isValid(childPath)) return false;
        const parentParts = Path.getParts(parentPath);
        const childParts = Path.getParts(childPath);
        if (childParts.length <= parentParts.length) return false;
        for (let i = 0; i < parentParts.length; i++) {
            if (parentParts[i] !== childParts[i]) return false;
        }
        return true;
    }

    /**
     * Compares two paths lexicographically 
     * @param {string} path1 - The first path
     * @param {string} path2 - The second path
     * @returns {number} -1 if path1 is less than path2, 1 if path1 is greater than path2, 0 if they are equal
     */
    static comparePaths(path1, path2) {
        if (!Path.isValid(path1) || !Path.isValid(path2)) return 0;
        const parts1 = Path.getParts(path1);
        const parts2 = Path.getParts(path2);
        const minLength = Math.min(parts1.length, parts2.length);
        for (let i = 0; i < minLength; i++) {
            if (parts1[i] < parts2[i]) return -1;
            if (parts1[i] > parts2[i]) return 1;
        }
        if (parts1.length < parts2.length) return -1;
        if (parts1.length > parts2.length) return 1;
        return 0;
    }

    /**
     * Gets the common path of two paths
     * @param {string} path1 - The first path
     * @param {string} path2 - The second path
     * @returns {string} The common path of the two paths
     */
    static getCommonPath(path1, path2) {
        if (!Path.isValid(path1) || !Path.isValid(path2)) return '';
        const parts1 = Path.getParts(path1);
        const parts2 = Path.getParts(path2);
        let commonLength = 0;
        const minLength = Math.min(parts1.length, parts2.length);
        for (let i = 0; i < minLength; i++) {
            if (parts1[i] !== parts2[i]) break;
            commonLength++;
        }
        if (commonLength === 0) return '';
        const commonParts = parts1.slice(0, commonLength);
        return Path.create(...commonParts);
    }

    /**
     * Resolves a relative path to an absolute path
     * @param {string} basePath - The base path
     * @param {string} relativePath - The relative path
     * @returns {string} The absolute path
     */
    static resolvePath(basePath, relativePath) {
        if (!relativePath || relativePath === '.') return basePath;
        if (relativePath.startsWith('/')) return Path.trim(relativePath);
        const baseParts = Path.getParts(basePath);
        const relativeParts = relativePath.split('/');
        const resolvedParts = [...baseParts];
        for (const part of relativeParts) {
            if (part === '' || part === '.') {
                continue;
            } else if (part === '..') {
                if (resolvedParts.length > 0) {
                    resolvedParts.pop();
                }
            } else {
                resolvedParts.push(part);
            }
        }
        return Path.create(...resolvedParts);
    }

    /**
     * Gets the relative path from one path to another
     * @param {string} fromPath - The starting path
     * @param {string} toPath - The target path
     * @returns {string} The relative path
     */
    static getRelativePath(fromPath, toPath) {
        if (!Path.isValid(fromPath) || !Path.isValid(toPath)) return '.';
        // If paths are identical, return current directory indicator
        if (fromPath === toPath) return '.';
        const fromParts = Path.getParts(fromPath);
        const toParts = Path.getParts(toPath);
        let commonLength = 0;
        const minLength = Math.min(fromParts.length, toParts.length);
        for (let i = 0; i < minLength; i++) {
            if (fromParts[i] === toParts[i]) {
                commonLength++;
            } else {
                break;
            }
        }
        // Calculate relative path
        const upLevels = fromParts.length - commonLength;
        const relativeParts = toParts.slice(commonLength);
        if (upLevels === 0 && relativeParts.length === 0) return '.';
        const upPath = upLevels > 0 ? '../'.repeat(upLevels) : '';
        const relativePath = relativeParts.length > 0 ? relativeParts.join('/') : '';
        const result = upPath + relativePath;
        return result || '.';
    }

    /**
     * Gets the name part of a file full name
     * @param {string} fileFullName - The file full name
     * @returns {string} The name part of the file full name
     */
    static getNamePart(fileFullName) {
        const lastDotIndex = fileFullName.lastIndexOf('.');
        // If no dot found or at the start (hidden files), return the full name
        if (lastDotIndex <= 0) return fileFullName;
        return fileFullName.slice(0, lastDotIndex);
    }

    /**
     * Gets the extension part of a file full name
     * @param {string} fileFullName - The file full name
     * @returns {string} The extension part of the file full name
     */
    static getExtensionPart(fileFullName) {
        const lastDotIndex = fileFullName.lastIndexOf('.');
        // If no dot found or at the start (hidden files), return empty string
        if (lastDotIndex <= 0) return '';
        return fileFullName.slice(lastDotIndex + 1);
    }
}

export default Path