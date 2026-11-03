import { ACTIONS } from '../actions.js'

/**
 * Interrupt command (Ctrl+C) - cancels input or foreground process
 */
export class InterruptCommand {
    constructor() {
        this.name = ACTIONS.INTERRUPT;
    }

    /**
     * Executes the interrupt command
     * @param {Shell} shell The shell
     */
    execute(shell) {
        const readline = shell.getReadline();
        const terminal = shell.getTerminal();
        const reading = shell.isReading();
        if (reading) {
            shell.cancelRead();
        }
        if (shell.isProcessing()) {
            shell.abortCurrentJob();
            terminal.writeLine('^C');
            return;
        }
        if (reading) {
            terminal.writeLine('^C');
            terminal.writePrompt();
            return;
        }
        const text = readline.getText();
        readline.cancelLine();
        terminal.writeLine(`${text}^C`);
        terminal.writePrompt();
    }
}

export default InterruptCommand