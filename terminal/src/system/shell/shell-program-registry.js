import { ShellProgram } from './shell-program.js'
import { flag } from './shell-program-spec.js'

/**
 * ShellProgramRegistry - Registers ShellProgram instances from names or manifests
 */
export class ShellProgramRegistry {
    /**
     * Creates a new ShellProgramRegistry instance
     */
    constructor() {
        this._programs = new Map();
    }

    /**
     * Registers a program by name
     * @param {string} name - The name of the program to register
     * @returns {ShellProgram} - The registered program
     */
    register(name) {
        if (this._programs.has(name)) return this._programs.get(name);
        const program = new ShellProgram(name);
        this._addDefaultOptions(program);
        this._programs.set(name, program);
        return program;
    }

    /**
     * Registers programs from a manifest
     * @param {object} manifest - The manifest with programs description
     * @returns {ShellProgram[]|null} - The registered programs, or null if the manifest is invalid
     */
    registerFromManifest(manifest) {
        if (!manifest.name || typeof manifest.name !== 'string') return null;
        const programManifests = manifest.programs || [];
        const registeredPrograms = [];
        for (const programManifest of programManifests) {
            if (!programManifest.name || typeof programManifest.name !== 'string') continue;
            if (this._programs.has(programManifest.name)) {
                registeredPrograms.push(this._programs.get(programManifest.name));
                continue;
            }
            const program = new ShellProgram(programManifest.name);
            program.setDescription(programManifest.description || manifest.description || '');
            program.setVersion(programManifest.version || manifest.version || '');
            programManifest.commands?.forEach(command => {
                if (!command.name) return;
                program.addCommand(command);
            });
            programManifest.options?.forEach(option => {
                if (!option.name || typeof option.name !== 'string') return;
                program.addOption(option);
            });
            programManifest.arguments?.forEach(argument => {
                if (!argument.name) return;
                program.addArgument(argument);
            });
            this._addDefaultOptions(program);
            this._programs.set(programManifest.name, program);
            registeredPrograms.push(program);
        }
        return registeredPrograms;
    }

    /**
     * Adds default --help and --version options unless the program already defines them
     * @param {ShellProgram} program - The program to add default options to
     */
    _addDefaultOptions(program) {
        const options = program.getOptions();
        if (!options.has('help')) {
            program.addOption(flag({
                name: 'help',
                long: 'help',
                description: 'Display help',
            }));
        }
        if (!options.has('version')) {
            program.addOption(flag({
                name: 'version',
                long: 'version',
                description: 'Display version',
            }));
        }
    }

    /**
     * Unregisters a program
     * @param {string} name - The name of the program to unregister
     * @returns {ShellProgram|null} - The unregistered program, or null if it was not registered
     */
    unregister(name) {
        const program = this._programs.get(name);
        if (!program) return null;
        this._programs.delete(name);
        return program;
    }

    /**
     * Gets a program by name
     * @param {string} name - The name of the program
     * @returns {ShellProgram|undefined} - The program, or undefined if it was not registered
     */
    get(name) {
        return this._programs.get(name);
    }

    /**
     * Returns all registered programs
     * @returns {ShellProgram[]} - An array of all registered programs
     */
    list() {
        return Array.from(this._programs.values());
    }
}

export default ShellProgramRegistry