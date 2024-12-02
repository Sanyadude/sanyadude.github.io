export const DEFAULT_UI_FONT_SIZE = 16;
export const DEFAULT_UI_FONT_FAMILY = 'serif';

export class UIFont {
    constructor(fontSize = UIFont.DEFAULT_UI_FONT_SIZE, lineHeight = null, fontFamily = UIFont.DEFAULT_UI_FONT_FAMILY) {
        this._fontSize = fontSize;
        this._lineHeight = lineHeight;
        this._fontFamily = fontFamily;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIFont(this._fontSize, this._lineHeight, this._fontFamily);
    }

    setFontSize(fontSize = UIFont.DEFAULT_UI_FONT_SIZE) {
        this.fontSize = fontSize;
        return this;
    }

    set fontSize(fontSize) {
        this._fontSize = fontSize;
        this.applyProxy();
    }

    get fontSize() {
        return this._fontSize;
    }

    setFontFamily(fontFamily = UIFont.DEFAULT_UI_FONT_FAMILY) {
        this.fontFamily = fontFamily;
        return this;
    }

    set fontFamily(fontFamily) {
        this._fontFamily = fontFamily;
        this.applyProxy();
    }

    get fontFamily() {
        return this._fontFamily;
    }

    setLineHeight(lineHeight = UIFont.DEFAULT_UI_FONT_SIZE) {
        this.lineHeight = lineHeight;
        return this;
    }

    set lineHeight(lineHeight) {
        this._lineHeight = lineHeight;
        this.applyProxy();
    }

    get lineHeight() {
        return this._lineHeight;
    }

    static get default() {
        return new UIFont();
    }

    static get body() {
        const bodyFontSize = Number(window.getComputedStyle(document.body)
            .getPropertyValue('font-size')
            .match(/\d+/)[0]);
        const bodyFontFamily = window.getComputedStyle(document.body)
            .getPropertyValue('font-family').replace(/"/g, '');
        return new UIFont(bodyFontSize, bodyFontSize, bodyFontFamily);
    }

    static get DEFAULT_UI_FONT_SIZE() {
        return DEFAULT_UI_FONT_SIZE;
    }

    static get DEFAULT_UI_FONT_FAMILY() {
        return DEFAULT_UI_FONT_FAMILY;
    }

    static createFactory(family) {
        return {
            create: (fontSize, lineHeight) => new UIFont(fontSize, lineHeight, family)
        };
    }

    static fromFamily(family) {
        return new UIFont(UIFont.DEFAULT_UI_FONT_SIZE, UIFont.DEFAULT_UI_FONT_SIZE, family);
    }

}

export default UIFont