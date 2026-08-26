import { ACTIONS } from '../config/actions.js'

/**
 * Interrupt command (Ctrl+C) - cancels input or foreground process
 */
export class InterruptCommand {
    constructor() {
        this.name = ACTIONS.INTERRUPT;
    }

    /**
     * Executes the interrupt command
     * @param {object} context - Context
     */
    execute(context) {
        if (context.textSelection.isActive()) {
            context.textSelection.reset();
        }
        if (context.shell.isProcessing()) {
            context.shell.abortCurrentJob();
            context.terminalApi.writeOutputLine('^C');
            context.terminalApi.showPrompt();
            return;
        }
        const prompt = context.shell.getPrompt();
        const promptText = context.inputPrompt.formatPromptText(prompt.user, prompt.host, prompt.cwd);
        const inputText = context.textBuffer.getInputText();
        context.terminalApi.writeOutputLine(`${promptText}${inputText}^C`);
        context.terminalApi.showPrompt();
    }
}

export default InterruptCommand
