import UIElement from '../ui-element/ui-element.js'

export class ImgElement extends UIElement {
    static get tag() {
        return 'img';
    }

    setAlt(value = '') {
        this._setElementAttribute('alt', value);
        return this;
    }

    getAlt() {
        return this._getElementAttribute('alt');
    }

    resetAlt() {
        this._removeElementAttribute('alt');
        return this;
    }

    setSrc(value = '') {
        this._setElementAttribute('src', value);
        return this;
    }

    getSrc() {
        return this._getElementAttribute('src');;
    }

    resetSrc() {
        this._removeElementAttribute('src');
        return this;
    }

    onLoad(listener) {
        this._addElementEventListener('load', listener);
        return this;
    }

}

export default ImgElement