import UIElement from '../ui-element/ui-element.js'

export class SvgElement extends UIElement {
    static get tag() {
        return 'svg';
    }

    _init() {
        super._init();
        this._setElementAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    setViewBox(value) {
        this._setElementAttribute('viewBox', value);
        return this;
    }

    getViewBox() {
        return this._getElementAttribute('viewBox');
    }

    resetViewBox() {
        this._removeElementAttribute('viewBox');
        return this;
    }

}

export default SvgElement