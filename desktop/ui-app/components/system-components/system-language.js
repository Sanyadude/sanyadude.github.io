import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { APP_LANGUAGE } from '../../config/config.js'
import { LANGUAGES, LANGUAGES_NAME2_MAP } from '../../config/languages.js'

const DEFAULT_LANGUAGE = APP_LANGUAGE;
const DEFAULT_SYSTEM_LANGUAGES = [DEFAULT_LANGUAGE];
const DEFAULT_KEYBOARD_LANGUAGES = [DEFAULT_LANGUAGE, 'uk'];

const NAVIGATOR_LANGUAGE = (window.navigator.language || window.navigator.userLanguage || DEFAULT_LANGUAGE).slice(0,2);

export class SystemLanguage {
    constructor() {
        this.systemLanguages = null;
        this.systemLanguage = null;

        this.keyboardLanguages = null;
        this.keyboardLanguageIndex = null;
        this.keyboardLanguage = null;

        this._init();
    }

    _init() {
        this.changeSystemLanguageSet(DEFAULT_SYSTEM_LANGUAGES);
        this.changeSystemLanguage(DEFAULT_LANGUAGE);

        this.changeKeyboardLanguageSet(DEFAULT_KEYBOARD_LANGUAGES);
        this.changeKeyboardLanguage(NAVIGATOR_LANGUAGE);

        EventEmitter.subscribe('system-keyboard-language-change', (payload) => {
            this.changeKeyboardLanguage(payload.language);
        });
    }

    getAllLanguages() {
        return LANGUAGES;
    }

    getLanguageByCode(languageCode) {
        return LANGUAGES.find(language => language.name2 == languageCode) || LANGUAGES_NAME2_MAP[DEFAULT_LANGUAGE];
    }

    getLanguageFromSet(language, languages) {
        return languages.find(lang => lang.name2 == language) || LANGUAGES_NAME2_MAP[DEFAULT_LANGUAGE];
    }
    
    getLanguagesFromSet(languages) {
        const languagesFiltered = languages.map(language => LANGUAGES_NAME2_MAP[language]).filter(language => language);
        return languagesFiltered.length > 0
            ? languagesFiltered
            : [LANGUAGES_NAME2_MAP[DEFAULT_LANGUAGE]];
    }

    getKeyboardLanguageIndex(language, languages) {
        const keyboardLanguageIndex = languages.findIndex(lang => lang.name2 == language);
        return keyboardLanguageIndex >= 0
            ? keyboardLanguageIndex
            : 0
    }

    changeSystemLanguageSet(languages) {
        this.systemLanguages = this.getLanguagesFromSet(languages);
        EventEmitter.emit('system-language-set-changed', { targetLanguages: languages, languages: this.systemLanguages });
    }

    changeSystemLanguage(language) {
        this.systemLanguage = this.getLanguageFromSet(language, this.systemLanguages);
        EventEmitter.emit('system-language-changed', { targetLanguage: language, language: this.systemLanguage });
    }

    changeKeyboardLanguageSet(languages) {
        this.keyboardLanguages = this.getLanguagesFromSet(languages);
        EventEmitter.emit('system-keyboard-language-set-changed', { targetLanguages: languages, languages: this.keyboardLanguages });
    }

    changeKeyboardLanguage(language) {
        this.keyboardLanguageIndex = this.getKeyboardLanguageIndex(language, this.keyboardLanguages);
        this.keyboardLanguage = this.keyboardLanguages[this.keyboardLanguageIndex];
        EventEmitter.emit('system-keyboard-language-changed', { targetLanguage: language, language: this.keyboardLanguage });
    }
}

export default SystemLanguage;