import Entry from './entry.js'

/**
 * FileEntry - Represents a file in the file system
 * @extends Entry
 */
export class FileEntry extends Entry {
    /**
     * Creates a new file entry
     * @param {string} name - The name of the file
     * @param {string|Uint8Array|ArrayBuffer|Object|any} content - The content of the file
     */
    constructor(name, content) {
        super(name);
        if (typeof content === 'string') {
            this.content = new TextEncoder().encode(content);
        } else if (content instanceof Uint8Array) {
            this.content = content;
        } else if (content instanceof ArrayBuffer) {
            this.content = new Uint8Array(content);
        } else if (typeof content === 'object') {
            const jsonStr = JSON.stringify(content);
            this.content = new TextEncoder().encode(jsonStr);
        } else if (content != null && content.toString) {
            this.content = new TextEncoder().encode(content.toString());
        } else {
            this.content = new Uint8Array(0);
        }
    }

    /**
     * Gets the name part of the file
     * @returns {string} The name part of the file
     */
    getNamePart() {
        return FileEntry.getNamePart(this.name);
    }

    /**
     * Gets the extension part of the file
     * @returns {string} The extension part of the file
     */
    getExtensionPart() {
        return FileEntry.getExtensionPart(this.name);
    }

    /**
     * Gets the content of the file
     * @returns {Uint8Array} The content of the file
     */
    read() {
        this.metadata.accessed = Date.now();
        return this.content;
    }

    /**
     * Gets the content of the file as a string
     * @returns {string} The content of the file as a string
     */
    readAsString() {
        this.metadata.accessed = Date.now();
        return new TextDecoder().decode(this.content);
    }

    /**
     * Gets the content of the file as an array of string lines
     * @returns {string[]} The content of the file as an array of lines
     */
    readAsLines() {
        return this.readAsString().split(/\r?\n/);
    }

    /**
     * Gets the content of the file as a JSON object
     * @returns {Object} The content of the file as a JSON object
     */
    readAsJSON() {
        try {
            return JSON.parse(this.readAsString());
        } catch (e) {
            return null;
        }
    }

    /**
     * Reads a specific line (0-based index) from the file content
     * @param {number} lineNumber - The line number to read (0-based)
     * @returns {string|null} The line content, or null if line does not exist
     */
    readLine(lineNumber) {
        this.metadata.accessed = Date.now();
        if (lineNumber < 0) return null;
        const decoder = new TextDecoder();
        let currentLine = 0;
        let start = 0;
        for (let i = 0; i < this.content.length; i++) {
            // \n in bytes is 10 (ASCII or UTF-8)
            if (this.content[i] === 10) {
                if (currentLine === lineNumber) {
                    return decoder.decode(this.content.subarray(start, i));
                }
                start = i + 1;
                currentLine++;
            }
        }
        if (currentLine === lineNumber && start < this.content.length) {
            return decoder.decode(this.content.subarray(start));
        }
        return null;
    }

    /**
     * Writes the content to the file
     * @param {string|Uint8Array|ArrayBuffer} content - The content to write to the file
     */
    write(content) {
        if (typeof content === 'string') {
            this.writeString(content);
        } else {
            this.writeBytes(content);
        }
        return this;
    }

    /**
     * Writes the content to the file as a byte array
     * @param {Uint8Array|ArrayBuffer} content - The content to write to the file as a byte array
     */
    writeBytes(content) {
        if (!(content instanceof Uint8Array) && !(content instanceof ArrayBuffer)) {
            throw new Error('Content must be a Uint8Array or ArrayBuffer');
        }
        this.content = content instanceof ArrayBuffer ? new Uint8Array(content) : content;
        this.metadata.modified = Date.now();
        return this;
    }

    /**
     * Writes the content to the file as a string
     * @param {string} content - The content to write to the file as a string
     */
    writeString(content) {
        if (typeof content !== 'string') {
            throw new Error('Content must be a string');
        }
        this.content = new TextEncoder().encode(content);
        this.metadata.modified = Date.now();
        return this;
    }

    /**
     * Writes the content to the file as an array of lines
     * @param {string[]} lines - The content to write to the file as an array of lines
     */
    writeLines(lines) {
        if (!Array.isArray(lines)) {
            throw new Error('Lines must be an array');
        }
        this.writeString(lines.join('\n'));
        return this;
    }

    /**
     * Writes the content to the file as a JSON object
     * @param {object} data - The content to write to the file as a JSON object
     */
    writeJSON(data) {
        if (typeof data !== 'object') {
            throw new Error('Data must be an object');
        }
        this.writeString(JSON.stringify(data));
        return this;
    }

    /**
     * Appends the content to the file
     * @param {string} content - The content to append to the file
     */
    writeLine(content) {
        const newContent = new TextEncoder().encode('\n' + content);
        let combined = new Uint8Array(this.content.length + newContent.length);
        combined.set(this.content, 0);
        combined.set(newContent, this.content.length);
        this.write(combined);
        return this;
    }

    /**
     * Gets the size of the file
     * @returns {number} The size of the file in characters
     */
    getSize() {
        return this.content.length;
    }

    /**
     * Checks if the file is empty
     * @returns {boolean} True if the file is empty, false otherwise
     */
    isEmpty() {
        return this.content.length === 0;
    }

    /**
     * Clears file content
     */
    clear() {
        this.content = new Uint8Array(0);
        this.metadata.modified = Date.now();
        return this;
    }
}

export default FileEntry