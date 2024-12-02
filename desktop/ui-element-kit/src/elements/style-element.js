import UIElement from '../ui-element/ui-element.js'

export class StyleElement extends UIElement {
    static get tag() {
        return 'style';
    }

    _init() {
        super._init();
        this._setElementAttribute('type', 'text/css');
        this._cssRules = {};
    }

    updateCss() {
        let cssRulesText = '';
        for (const selector in this._cssRules) {
            const cssDeclaration = this._cssRules[selector];
            cssRulesText += `${selector}{`;
            for (const property in cssDeclaration) {
                const value = cssDeclaration[property];
                cssRulesText += `${property}:${value};`;
            }
            cssRulesText += `}`;
        }
        this.setText(cssRulesText);
        return this;
    }

    addCssRuleDeclaration(selector, property, value) {
        if (!this._cssRules[selector])
            this._cssRules[selector] = {};
        this._cssRules[selector][property] = value;
        return this;
    }

    addCssRule(selector, rule) {
        if (!this._cssRules[selector])
            this._cssRules[selector] = {};
        Object.assign(this._cssRules[selector], rule);
        return this;
    }

}

export default StyleElement