export const KEYBOARD_BUTTONS_NAME_CODE_MAP = Object.freeze({
    //Alphabet keys
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    //Number keys
    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,
    NUM_6: 54,
    NUM_7: 55,
    NUM_8: 56,
    NUM_9: 57,
    //Numpad keys
    NUMPAD_0: 96,
    NUMPAD_1: 97,
    NUMPAD_2: 98,
    NUMPAD_3: 99,
    NUMPAD_4: 100,
    NUMPAD_5: 101,
    NUMPAD_6: 102,
    NUMPAD_7: 103,
    NUMPAD_8: 104,
    NUMPAD_9: 105,
    //Function keys
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    //Special keys
    ESCAPE: 27,
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    CAPS_LOCK: 20,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    WINDOWS_KEY: 91,
    INSERT: 45,
    DELETE: 46,
    HOME: 36,
    END: 35,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    //Arrow keys
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    //Number pad keys
    NUM_LOCK: 144,
    NUM_MULTIPLY: 106,
    NUM_ADD: 107,
    NUM_SUBTRACT: 109,
    NUM_DECIMAL: 110,
    NUM_DIVIDE: 111,
    //Other special keys
    PRINT_SCREEN: 44,
    SCROLL_LOCK: 145,
    PAUSE_BREAK: 19,
    //Various other keys
    SEMICOLON: 186,
    EQUAL: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    SLASH: 191,
    BACKTICK: 192,
    OPEN_BRACKET: 219,
    BACKSLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222,
    //Other browser-specific keys
    CONTEXT_MENU: 93,
    //Modifier keys
    META: 91,
    ALT_GR: 225
});

export const KEYBOARD_BUTTONS_CODE_NAME_MAP = (() => {
    const reversed = {};
    for (const key in KEYBOARD_BUTTONS_NAME_CODE_MAP) {
        reversed[KEYBOARD_BUTTONS_NAME_CODE_MAP[key]] = key;
    }
    return reversed;
})();

export default {
    KEYBOARD_BUTTONS_NAME_CODE_MAP,
    KEYBOARD_BUTTONS_CODE_NAME_MAP
}