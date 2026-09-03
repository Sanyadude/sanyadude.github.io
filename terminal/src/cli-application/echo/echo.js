import { Application } from '../../system/application/application.js'
import { ECHO_MANIFEST } from './echo-manifest.js'

/**
 * Echo - Application for displaying text
 * @extends {Application}
 */
export class Echo extends Application {
    /**
     * Creates a new Echo instance
     */
    constructor() {
        super('echo', ECHO_MANIFEST);
    }

    /**
     * Executes the `echo` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {string} - The result of the echo command execution
     */
    main(commandLine) {
        const args = commandLine.getArguments();
        const options = commandLine.getOptions();
        let text = args.length === 0 ? commandLine.getStdin() : args.join(' ');
        const enableEscapes = Boolean(options['enable-escapes']) && !Boolean(options['disable-escapes']);
        if (enableEscapes) {
            text = this._interpretEscapes(text);
        }
        const noTrailingNewline = Boolean(options['no-newline']);
        if (noTrailingNewline) return text;
        return text + '\n';
    }

    /**
     * Interprets common backslash escape sequences
     * @param {string} text - The text to interpret
     * @returns {string}
     */
    _interpretEscapes(text) {
        const escapes = {
            a: '\x07',
            b: '\b',
            e: '\x1b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t',
            v: '\v',
            '\\': '\\',
        };
        return text.replace(/\\([abefnrtv\\])/g, (_, ch) => escapes[ch]);
    }
}

export default Echo