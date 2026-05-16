import { THEMES } from '../config/themes.js'

const DEFAULT_THEME_NAME = 'pastel-dark';

/**
 * ThemeProvider class - represents a theme provider for the terminal
 */
export class ThemeProvider {
    /**
     * Creates a new ThemeProvider instance
     */
    constructor(defaultThemeName = DEFAULT_THEME_NAME) {
        this._themes = THEMES;
        this._theme = this._themes[defaultThemeName];
    }

    // Event handler for theme change
    onThemeChange() {}

    /**
     * Returns all available themes
     * @returns {Object} - An object with the theme names as keys and the theme objects as values
     */
    getThemes() {
        return this._themes;
    }

    /**
     * Sets the current theme
     * @param {string} themeName - The name of the theme to set
     * @returns {ThemeProvider} - The instance of the ThemeProvider
     */
    setTheme(themeName = DEFAULT_THEME_NAME) {
        if (!this._themes[themeName]) return this;
        this._theme = this._themes[themeName];
        this.onThemeChange?.({ theme: this._theme });
        return this;
    }

    /**
     * Sets the next theme
     * @returns {ThemeProvider} - The instance of the ThemeProvider
     */
    setNextTheme() {
        const themeNames = Object.keys(this._themes);
        const currentIndex = themeNames.indexOf(this._theme.name);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        const nextThemeName = themeNames[nextIndex];
        this.setTheme(nextThemeName);
        return this;
    }

    /**
     * Sets the previous theme
     * @returns {ThemeProvider} - The instance of the ThemeProvider
     */
    setPreviousTheme() {
        const themeNames = Object.keys(this._themes);
        const currentIndex = themeNames.indexOf(this._theme.name);
        const previousIndex = (currentIndex - 1 + themeNames.length) % themeNames.length;
        const previousThemeName = themeNames[previousIndex];
        this.setTheme(previousThemeName);
        return this;
    }

    /**
     * Returns the theme of the terminal
     * @returns {object} - The theme
     */
    getTheme() {
        return this._theme;
    }

    /**
     * Returns the name of the theme
     * @returns {string} - The name of the theme
     */
    getThemeName() {
        return this._theme.name;
    }
}

export default ThemeProvider