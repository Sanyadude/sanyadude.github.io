/**
 * IdGeneratorFactory - Creates a function that generates unique sequential ids
 */
export class IdGeneratorFactory {
    /**
     * Creates a new incremental id generator function
     * @param {number} start The id to start from; the first call to the function returns start + 1
     * @returns {Function} The id generator function
     */
    static createIncremental(start = 0) {
        let id = start;
        return () => ++id;
    }
}

export default IdGeneratorFactory