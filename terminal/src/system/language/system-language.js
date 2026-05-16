import { APP_LANGUAGE } from '../../config/config.js'
import { LANGUAGES, LANGUAGES_NAME2_MAP, LANGUAGES_NAME_TYPES } from '../../config/languages.js'

/**
 * SystemLanguage - A class for managing the system language
 */
export class SystemLanguage {
    /**
     * Gets the default language
     * @returns {string} - The default language
     */
    static get DEFAULT_LANGUAGE() { return APP_LANGUAGE; }

    /**
     * Creates a new SystemLanguage instance
     */
    constructor() {
        this.systemLanguages = null;
        this.systemLanguage = null;

        this.keyboardLanguages = null;
        this.keyboardLanguageIndex = null;
        this.keyboardLanguage = null;

        this._init();
    }

    /**
     * Initializes the SystemLanguage instance
     */
    _init() {
        this.changeSystemLanguageSet([SystemLanguage.DEFAULT_LANGUAGE]);
        this.changeSystemLanguage(SystemLanguage.DEFAULT_LANGUAGE);

        this.changeKeyboardLanguageSet([SystemLanguage.DEFAULT_LANGUAGE]);
        
        const navigatorLanguage = (window.navigator.language || window.navigator.userLanguage || SystemLanguage.DEFAULT_LANGUAGE).slice(0,2);
        this.changeKeyboardLanguage(navigatorLanguage);
    }

    /**
     * Gets all languages
     * @returns {Array} - The all languages
     */
    getAllLanguages() {
        return LANGUAGES;
    }

    /**
     * Gets a language by name
     * @param {string} name - The name of the language
     * @param {string} type - The type of the language
     * @returns {Object} - The language
     */
    getLanguageByName(name, type = LANGUAGES_NAME_TYPES.name2) {
        return this.getLanguageFromSet(LANGUAGES, name, type);
    }

    /**
     * Gets a language from a set
     * @param {Array} languages - The set of languages
     * @param {string} name - The name of the language
     * @param {string} type - The type of the language
     * @returns {Object} - The language
     */
    getLanguageFromSet(languages, name, type = LANGUAGES_NAME_TYPES.name2) {
        return languages.find(language => language[type] === name) || LANGUAGES_NAME2_MAP[SystemLanguage.DEFAULT_LANGUAGE];
    }
    
    /**
     * Gets languages from a set
     * @param {Array} languages - The set of languages
     * @returns {Array} - The languages
     */
    getLanguagesFromSet(languages) {
        const languagesFiltered = languages.map(language => LANGUAGES_NAME2_MAP[language]).filter(language => language);
        return languagesFiltered.length > 0
            ? languagesFiltered
            : [LANGUAGES_NAME2_MAP[SystemLanguage.DEFAULT_LANGUAGE]];
    }

    /**
     * Gets the keyboard language index
     * @param {string} language - The language
     * @param {Array} languages - The set of languages
     * @returns {number} - The keyboard language index
     */
    getKeyboardLanguageIndex(language, languages) {
        const keyboardLanguageIndex = languages.findIndex(lang => lang.name2 === language);
        return keyboardLanguageIndex >= 0
            ? keyboardLanguageIndex
            : 0
    }

    /**
     * Changes the system language set
     * @param {Array} languages - The set of languages
     */
    changeSystemLanguageSet(languages) {
        this.systemLanguages = this.getLanguagesFromSet(languages);
    }

    /**
     * Changes the system language
     * @param {string} language - The language
     */
    changeSystemLanguage(language) {
        this.systemLanguage = this.getLanguageFromSet(this.systemLanguages,language);
    }

    /**
     * Changes the keyboard language set
     * @param {Array} languages - The set of languages
     */
    changeKeyboardLanguageSet(languages) {
        this.keyboardLanguages = this.getLanguagesFromSet(languages);
    }

    /**
     * Changes the keyboard language
     * @param {string} language - The language
     */
    changeKeyboardLanguage(language) {
        this.keyboardLanguageIndex = this.getKeyboardLanguageIndex(language, this.keyboardLanguages);
        this.keyboardLanguage = this.keyboardLanguages[this.keyboardLanguageIndex];
    }
}

export default SystemLanguage