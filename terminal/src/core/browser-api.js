/**
 * BrowserAPI - A class for interacting with the browser API
 */
export class BrowserAPI {
    /**
     * Creates a new browser API
     * @param {object} options - The options for the browser API
     */
    constructor(options = {}) {
        const defaultOptions = {};
        this._options = { ...defaultOptions, ...(options || {}) };
    }

    /**
     * Downloads a file
     * @param {string} name - The name of the file
     * @param {ArrayBuffer} content - The content of the file
     * @param {string} type - The type of the file
     */
    downloadFile(name, content = new ArrayBuffer(0), type = 'application/octet-stream') {
        const blob = new Blob([content], { type });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    /**
     * Loads a file
     * @param {URL} url - The URL of the file
     * @returns {Promise<ArrayBuffer>} - The content of the file
     */
    async loadFile(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load file');
        return response.arrayBuffer();
    }
}

/**
 * Creates a browser API factory
 * @param {object} options - The options for the browser API factory
 * @returns {Object} The browser API factory
 */
export const createBrowserAPIFactory = () => {
    return {
        browserAPI: (options = {}) => new BrowserAPI(options),
    }
}

export default BrowserAPI