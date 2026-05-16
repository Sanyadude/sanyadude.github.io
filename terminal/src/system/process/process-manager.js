import { Process } from './process.js'

/**
 * Generates a unique process id
 * @returns {number} - The next process id
 */
const nextId = (() => {
    let id = 0;
    return () => ++id;
})();

/**
 * ProcessManager - A class for managing processes
 */
export class ProcessManager {
    /**
     * Creates a new ProcessManager instance
     * @param {ServiceProvider} serviceProvider - The service provider instance
     */
    constructor(serviceProvider) {
        this._serviceProvider = serviceProvider;

        this._applicationManager = this._serviceProvider.get('applicationManager');

        this._processes = new Map();
    }

    /**
     * Gets all processes
     * @returns {Process[]} - The processes
     */
    getProcesses() {
        return Array.from(this._processes.values());
    }

    /**
     * Gets a process by id
     * @param {number} id - The id of the process
     * @returns {Process} - The process
     */
    getProcess(id) {
        return this._processes.get(id);
    }

    /**
     * Creates a new process
     * @param {ShellCommandLine} commandLine - The command line to create the process
     * @returns {Process} - The process
     */
    createProcess(commandLine) {
        const id = nextId();
        const process = new Process(id, commandLine);
        this._processes.set(id, process);
        return process;
    }

    /**
     * Starts a new process
     * @param {number} id - The id of the process
     * @returns {Process} - The process
     */
    startProcess(id) {
        const process = this._processes.get(id);
        if (!process) return null;
        process.start();
        return process;
    }

    /**
     * Stops a process
     * @param {number} id - The id of the process
     * @returns {Process|null} - The process or null if the process was not found
     */
    stopProcess(id) {
        const process = this._processes.get(id);
        if (!process) return null;
        process.stop();
        return process;
    }

    /**
     * Terminates a process
     * @param {number} id - The id of the process
     * @param {any} result - The result of the process
     * @param {number} exitCode - The exit code of the process
     * @returns {Process|null} - The process or null if the process was not found
     */
    terminateProcess(id, result, exitCode = 0) {
        const process = this._processes.get(id);
        if (!process) return null;
        process.terminate(result, exitCode);
        return process;
    }

    /**
     * Kills a process
     * @param {number} id - The id of the process
     * @returns {Process|null} - The process or null if the process was not found
     */
    killProcess(id) {
        const process = this._processes.get(id);
        if (!process) return null;
        process.kill();
        this._processes.delete(id);
        return process;
    }

    /**
     * Runs a program
     * @param {string} programName - The name of the program to run
     * @param {ShellCommandLine} commandLine - The command line to run the program
     * @returns {Promise<any>} - The result of the program execution or error
     */
    async run(programName, commandLine) {
        const process = this.createProcess(commandLine);
        process.start();
        try {
            const result = await this._applicationManager.execute(programName, commandLine);
            if (result === null) {
                throw new Error(`Program not found: ${programName}`);
            }
            process.terminate(result);
            return result;
        } catch (error) {
            process.terminate(error?.toString(), 1);  // non-zero exit code
            return error?.toString();
        }
    }
}

export default ProcessManager