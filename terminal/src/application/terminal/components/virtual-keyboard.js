const IME_PLACEHOLDER_KEYS = Object.freeze(['Unidentified', 'Process']);
const IME_PLACEHOLDER_KEY_CODE = 229;

const INPUT_TYPE_TO_KEY = Object.freeze({
    deleteContentBackward: 'Backspace',
    deleteWordBackward: 'Backspace',
    deleteContentForward: 'Delete',
    deleteWordForward: 'Delete',
    insertLineBreak: 'Enter',
});

const KEY_CODES = Object.freeze({
    Backspace: 8,
    Enter: 13,
    Delete: 46,
});

const REAL_KEYDOWN_INPUT_GUARD_MS = 100;

/**
 * VirtualKeyboard - hidden input for the on-screen keyboard and IME-to-key translation
 */
export class VirtualKeyboard {
    /**
     * Creates a new VirtualKeyboard instance
     */
    constructor() {
        this._lastKeyDownTime = 0;
        this._inputElement = null;
        this._keyDownListeners = new Set();
        this._init();
    }

    /**
     * Creates the hidden textarea used by the on-screen keyboard
     * @returns {HTMLTextAreaElement} - The input element
     */
    _createInput() {
        const inputElement = document.createElement('textarea');
        Object.assign(inputElement.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '1px',
            height: '1px',
            opacity: '0',
            padding: '0',
            border: '0',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            pointerEvents: 'none',
            background: 'transparent',
            color: 'transparent',
        });
        inputElement.setAttribute('autocapitalize', 'off');
        inputElement.setAttribute('autocomplete', 'off');
        inputElement.setAttribute('autocorrect', 'off');
        inputElement.setAttribute('spellcheck', 'false');
        return inputElement;
    }

    /**
     * Initializes the virtual keyboard
     */
    _init() {
        this._inputElement = this._createInput();
        this._inputElement.addEventListener('input', (event) => {
            this._handleInput(event);
        });
    }

    /**
     * Returns the hidden input element
     * @returns {HTMLTextAreaElement} - The input element
     */
    getInput() {
        return this._inputElement;
    }

    /**
     * Consumes a keydown event
     * @param {KeyboardEvent} event - The key down event
     * @returns {KeyboardEvent|null} - The event to dispatch, or null if it is an IME placeholder
     */
    consumeKeyDown(event) {
        if (this._isImePlaceholderKey(event)) return null;
        this._lastKeyDownTime = Date.now();
        return event;
    }

    /**
     * Handles the input event from the hidden field
     * @param {InputEvent} event - The input event
     */
    _handleInput(event) {
        for (const keyEvent of this._consumeInput(event)) {
            this._emitKey(keyEvent);
        }
    }

    /**
     * Consumes an input event from the hidden field
     * @param {InputEvent} event - The input event
     * @returns {object[]} - Synthetic key events to dispatch
     */
    _consumeInput(event) {
        const controlKey = INPUT_TYPE_TO_KEY[event.inputType];
        if (controlKey) {
            this._inputElement.value = '';
            return [this._createKeyEvent(controlKey)];
        }
        const text = event.data || this._inputElement.value;
        this._inputElement.value = '';
        if (!text) return [];
        if (Date.now() - this._lastKeyDownTime < REAL_KEYDOWN_INPUT_GUARD_MS) return [];
        return this._keysFromText(text).map((key) => this._createKeyEvent(key));
    }

    /**
     * Returns true when the key event is an IME placeholder
     * @param {KeyboardEvent} event - The key event
     * @returns {boolean} - True if the event should be ignored
     */
    _isImePlaceholderKey(event) {
        return event.keyCode === IME_PLACEHOLDER_KEY_CODE
            || IME_PLACEHOLDER_KEYS.includes(event.key);
    }

    /**
     * Maps inserted text to key names
     * @param {string} text - The inserted text
     * @returns {string[]} - The key names
     */
    _keysFromText(text) {
        const keys = [];
        for (const char of text) {
            keys.push(char === '\n' || char === '\r' ? 'Enter' : char);
        }
        return keys;
    }

    /**
     * Creates a synthetic key event for the terminal key pipeline
     * @param {string} key - The key to emit
     * @returns {object} - A key-event-like object
     */
    _createKeyEvent(key) {
        return {
            key,
            keyCode: KEY_CODES[key] ?? key.charCodeAt(0),
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            preventDefault() { },
            stopPropagation() { },
        };
    }

    /**
     * Adds a listener for the key event
     * @param {Function} listener - The listener to add
     * @returns {Function} - A function to remove the listener
     */
    onKey(listener) {
        this._keyDownListeners.add(listener);
        return () => this._keyDownListeners.delete(listener);
    }

    /**
     * Emits a key event to the listeners
     * @param {KeyboardEvent|object} event - The key event
     */
    _emitKey(event) {
        for (const listener of this._keyDownListeners) {
            listener(event);
        }
    }

    
    /**
     * Focuses the hidden input element so the on-screen keyboard can open on touch devices
     */
    focus() {
        if (document.activeElement === this._inputElement) {
            this._inputElement.blur();
        }
        this._inputElement.focus({ preventScroll: true });
    }
}

export default VirtualKeyboard