import { TerminalClear } from '../cli-applications/terminal-clear/terminal-clear.js'
import { TerminalHistory } from '../cli-applications/terminal-history/terminal-history.js'
import { TerminalSettings } from '../cli-applications/terminal-settings/terminal-settings.js'

export const CLI_APPS = Object.freeze({
    clear: new TerminalClear(),
    history: new TerminalHistory(),
    settings: new TerminalSettings(),
});

export default CLI_APPS