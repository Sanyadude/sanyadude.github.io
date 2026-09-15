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
     * @param {number} exitCode - The exit code of the process
     * @returns {Process|null} - The process or null if the process was not found
     */
    terminateProcess(id, exitCode = 0) {
        const process = this._processes.get(id);
        if (!process) return null;
        process.terminate(exitCode);
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
        return process;
    }

    /**
     * Runs a program
     * @param {string} programName - The name of the program to run
     * @param {ShellCommandLine} commandLine - The command line to run the program
     * @param {ExecutionRuntime} callerRuntime - The inherited runtime for the program
     * @returns {Promise<any>} - The result of the program execution or error
     */
    async run(programName, commandLine, callerRuntime) {
        if (!this._applicationManager.resolve(programName)) {
            throw new Error(`Program not found: ${programName}`);
        }
        const process = this.createProcess(commandLine);
        process.start();
        const runtime = callerRuntime.forProcess(process);
        if (runtime.isAborted()) {
            process.kill();
            return;
        }
        try {
            const executePromise = this._applicationManager.execute(programName, commandLine, runtime);
            const outcome = await Promise.race([
                executePromise.then(
                    (value) => ({ ok: true, value }),
                    (error) => ({ ok: false, error }),
                ),
                runtime.whenAborted().then(() => ({ aborted: true })),
            ]);
            if (outcome.aborted || runtime.isAborted()) {
                process.kill();
                return;
            }
            if (!outcome.ok) {
                process.terminate(1);
                return outcome.error?.toString();
            }
            process.terminate();
            return outcome.value;
        } catch (error) {
            if (runtime.isAborted()) {
                process.kill();
                return;
            }
            process.terminate(1);
            return error?.toString();
        }
    }
}

export default ProcessManager