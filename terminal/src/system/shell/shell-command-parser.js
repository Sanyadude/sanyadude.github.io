/**
 * ShellCommandParser - Base class (interface) for command line parsers
 *
 * A parser turns a raw command line string into a ShellCommandLine, according
 * to a specific command line syntax (e.g. POSIX/Unix, Windows/DOS).
 */
export class ShellCommandParser {
    /**
     * Parses a command line into a ShellCommandLine object
     * @param {ShellProgram} program - The program whose options/commands define the grammar
     * @param {string} commandLine - The raw command line to parse
     * @returns {ShellCommandLine} - The parsed command line object
     * @throws {Error} If not implemented by a subclass
     */
    parse(program, commandLine) {
        throw new Error('ShellCommandParser.parse() must be implemented by a subclass');
    }

    /**
     * Returns a string representation of the parser's help
     * @param {ShellProgram} program - The program whose options/commands define the grammar
     * @returns {string} - A string representation of the parser's help
     */
    getHelp(program) {
        throw new Error('ShellCommandParser.getHelp() must be implemented by a subclass');
    }

    /**
     * Returns the program name (first token) from a command line using the parser's tokenizer
     * Respects quoting/escaping rules of the active syntax
     * @param {string} commandLine - The raw command line
     * @returns {string|null} - The program name, or null if empty/invalid
     */
    getProgramName(commandLine) {
        throw new Error('ShellCommandParser.getProgramName() must be implemented by a subclass');
    }
}

export default ShellCommandParser
