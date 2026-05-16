/**
 * SystemHost - Represents a system host
 */
export class SystemHost {
    /**
     * Creates a new SystemHost instance
     * @param {string} name - The name of the host
     * @param {string} address - The address of the host
     * @param {number|null} port - The port of the host
     */
    constructor(name, address, port = null) {
        if (!name || typeof name !== 'string') {
            throw new Error('Host name must be a non-empty string');
        }
        if (!address || typeof address !== 'string') {
            throw new Error('Host address must be a non-empty string');
        }
        this._name = name;
        this._address = address;
        this._port = port;
    }

    /**
     * Gets the name of the host
     * @returns {string} The name of the host
     */
    getName() {
        return this._name;
    }

    /**
     * Sets the name of the host
     * @param {string} name - The name of the host
     */
    setName(name) {
        this._name = name;
    }

    /**
     * Gets the address of the host
     * @returns {string} The address of the host
     */
    getAddress() {
        return this._address;
    }

    /**
     * Sets the address of the host
     * @param {string} address - The address of the host
     */
    setAddress(address) {
        this._address = address;
    }

    /**
     * Gets the port of the host
     * @returns {number|null} The port of the host
     */
    getPort() {
        return this._port;
    }

    /**
     * Sets the port of the host
     * @param {number|null} port - The port of the host
     */
    setPort(port) {
        this._port = port;
    }

    /**
     * Gets the full address of the host
     * @returns {string} The full address of the host
     */
    getFullAddress() {
        return `${this._address}${this._port ? `:${this._port}` : ''}`;
    }
}

export default SystemHost