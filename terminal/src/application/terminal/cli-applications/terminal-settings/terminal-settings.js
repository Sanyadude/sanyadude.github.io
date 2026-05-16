import { Application } from '../../../../system/application/application.js'
import { TERMINAL_SETTINGS_MANIFEST } from './terminal-settings-manifest.js'

/**
 * TerminalSettings - Application for changing terminal settings
 * @extends {Application}
 */
export class TerminalSettings extends Application {
    /**
     * Creates a new TerminalSettings instance
     */
    constructor() {
        super('terminal-settings', TERMINAL_SETTINGS_MANIFEST);
    }

    /**
     * Executes the `terminal` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the terminal command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const api = context.terminal;
        if (options['scrollbar-use-theme']) {
            api.toggleScrollbarUseTheme();
            return `Scrollbar use theme ${api.isScrollbarUseThemeEnabled() ? 'enabled' : 'disabled'}`;
        }
        if (options['debug']) {
            api.toggleDebug();
            return `Debug element ${api.isDebugEnabled() ? 'shown' : 'hidden'}`;
        }
        if (options['linux-prompt']) {
            api.setLinuxPrompt();
            return 'Prompt formatting set to linux style';
        }
        if (options['windows-prompt']) {
            api.setWindowsPrompt();
            return 'Prompt formatting set to windows style';
        }
        if (options['cursor-caret']) {
            api.setCursorStyleCaret();
            return 'Cursor is caret';
        }
        if (options['cursor-underline']) {
            api.setCursorStyleUnderline();
            return 'Cursor is underline';
        }
        if (options['theme']) {
            const themes = api.getThemes();
            if (options['theme'] === 'list') {
                return themes.map(theme => theme.name).join(',');
            }
            if (options['theme'] === 'test') {
                return this._generateThemeGrid(api.getTheme());
            }
            if (options['theme'] === 'current') {
                return `Current theme: ${api.getTheme().name}`;
            }
            if (options['theme'] === 'default') {
                api.setTheme();
                return `Theme set to default (${api.getTheme().name})`;
            }
            const themeName = options['theme'];
            const theme = themes.find(t => t.name === themeName);
            if (!theme) return `Invalid theme: ${themeName}`;
            api.setTheme(theme.name);
            return `Theme set to ${theme.name}`;
        }
        if (options['prev-theme'] || options['theme'] === 'prev') {
            api.setPreviousTheme();
            return `Theme set to ${api.getTheme().name}`;
        }
        if (options['next-theme'] || options['theme'] === 'next') {
            api.setNextTheme();
            return `Theme set to ${api.getTheme().name}`;
        }
        return '';
    }

    /**
     * Generates a theme grid
     * @param {object} theme - The theme to generate the grid for
     * @returns {string} - The generated grid
     */
    _generateThemeGrid(theme) {
        const styles = [0, 1, 2, 3, 4, 5, 7, 8, 9];
        const fgCodes = [...Array(8).keys()].map(i => 30 + i)
            .concat([...Array(8).keys()].map(i => 90 + i));
        const bgCodes = [...Array(8).keys()].map(i => 40 + i)
            .concat([...Array(8).keys()].map(i => 100 + i));
        const gridWidth = 86;
        const lines = [];
        lines.push('-'.repeat(gridWidth));
        lines.push(`Theme: ${theme.name}`);
        lines.push('-'.repeat(gridWidth));
        lines.push('STYLE ' + styles.map(style => `  ${style.toString()}m `).join(''));
        lines.push('      ' + styles.map(style => `\x1b[${style.toString()}m gYw \x1b[0m`).join(''));
        lines.push('-'.repeat(gridWidth));
        lines.push('BG\\FG ' + fgCodes.map(code => ` ${code.toString()}m `).join(''));
        for (const bgCode of bgCodes) {
            let row = `${bgCode.toString().padStart(4)}m `;
            for (const fgCode of fgCodes) {
                row += `\x1b[${fgCode};${bgCode}m gYw \x1b[0m`;
            }
            lines.push(row);
        }
        lines.push('-'.repeat(gridWidth));
        return lines.join('\n');
    }
}

export default TerminalSettings
