/**
 *  ProcessStream class - represents an asynchronous stream of data for a process
 */
export class ProcessStream {
    /**
     * Creates a new ProcessStream instance
     */
    constructor() {
        this._queue = [];
        this._readers = [];
        this._closed = false;
        this._sink = null;
    }

    /**
     * Sends every write straight to a consumer instead of queuing it for read
     * Used by the pty master so terminal output is written as the process produces it
     * @param {Function|null} sink The consumer, or null to queue for readers again
     * @returns {ProcessStream} The stream
     */
    setSink(sink = null) {
        this._sink = typeof sink === 'function' ? sink : null;
        if (!this._sink) return this;
        while (this._queue.length > 0) {
            this._sink(this._queue.shift());
        }
        return this;
    }

    /**
     * Writes data to the stream
     * @param {any} data The data to write
     * @returns {boolean} True if the data was written, false otherwise
     */
    write(data) {
        if (this._closed) return false;
        if (this._sink) {
            this._sink(data);
            return true;
        }
        if (this._readers.length > 0) {
            const resolve = this._readers.shift();
            resolve(data);
            return true;
        }
        this._queue.push(data);
        return true;
    }

    /**
     * Returns queued data as one string and removes it from the stream
     * @returns {string} The queued text
     */
    collect() {
        const chunks = this._queue.splice(0, this._queue.length);
        return chunks.map((chunk) => String(chunk)).join('');
    }

    /**
     * Reads the next available data
     * @returns {Promise<any>} A promise that resolves to the data
     */
    read() {
        if (this._queue.length > 0) {
            return Promise.resolve(this._queue.shift());
        }
        if (this._closed) {
            return Promise.resolve(null);
        }
        return new Promise(resolve => {
            this._readers.push(resolve);
        });
    }

    /**
     * Closes the stream
     * @returns {boolean} True if the stream was closed, false otherwise
     */
    close() {
        if (this._closed) return false;
        this._closed = true;
        while (this._readers.length > 0) {
            const resolve = this._readers.shift();
            resolve(null);
        }
        return true;
    }

    /**
     * Checks if the stream is closed
     * @returns {boolean} True if the stream is closed, false otherwise
     */
    isClosed() {
        return this._closed;
    }
}

export default ProcessStream