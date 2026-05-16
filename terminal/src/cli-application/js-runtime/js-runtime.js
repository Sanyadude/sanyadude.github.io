import { Application } from '../../system/application/application.js'
import { JS_RUNTIME_MANIFEST } from './js-runtime-manifest.js'

/**
 * JSRuntime - Application for running JavaScript code
 * @extends {Application}
 */
export class JSRuntime extends Application {
    /**
     * Creates a new JS runtime instance
     */
    constructor() {
        super('js-runtime', JS_RUNTIME_MANIFEST);
        this._worker = null;
    }

    /**
     * Initializes the JS runtime
     */
    _init() {
        if (this._worker) return;
        this._worker = new Worker(new URL('./js-runtime-worker.js', import.meta.url));
    }

    /**
     * Called when the application is uninstalled
     * @param {ApplicationInstaller} applicationInstaller - The application installer instance
     * @returns {JSRuntime} - The JSRuntime instance
     */
    onUninstall(applicationInstaller) {
        this.dispose();
        return this;
    }

    /**
     * Executes the `js` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {Promise<string>} - A promise that resolves to the result of the code execution
     */
    main(commandLine, context) {
        const args = commandLine.getArguments();
        let code = '';
        if (args.length === 1 && args[0].endsWith('.js')) {
            const filePath = args[0];
            const file = context.fileSystemExplorer.getFile(filePath);
            if (!file) return `Error: File not found: ${filePath}`;
            code = file.readAsString();
        } else {
            code = args.join(' ')
        }
        return this.run(code);
    }

    /**
     * Runs the given code
     * @param {string} code - The code to run
     * @returns {Promise<string>} - A promise that resolves to the result of the code execution
     */
    run(code) {
        if (!this._worker) {
            this._init();
        }
        return new Promise((resolve, reject) => {
            this._worker.onmessage = (e) => resolve(e.data);
            this._worker.onerror = (e) => resolve(e.message);
            this._worker.postMessage(code);
        });
    }

    /**
     * Disposes the JS runtime
     * @returns {JSRuntime} - The JSRuntime instance
     */
    dispose() {
        if (this._worker) {
            this._worker.terminate();
            this._worker = null;
        }
        return this;
    }
}