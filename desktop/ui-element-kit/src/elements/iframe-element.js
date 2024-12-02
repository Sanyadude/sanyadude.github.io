import UIElement from '../ui-element/ui-element.js'

export class IFrameElement extends UIElement {
    static get tag() {
        return 'iframe';
    }

    getContentWindowDocument() {
        return this._element.contentWindow?.document;
    }

    setSrc(value = '') {
        this._setElementAttribute('src', value);
        return this;
    }

    getSrc() {
        return this._getElementAttribute('src');
    }

    resetSrc() {
        this._removeElementAttribute('src');
        return this;
    }

    onLoad(listener, options) {
        this._addElementEventListener('load', listener, options);
        return this;
    }

    offLoad(listener, options) {
        this._removeElementEventListener('load', listener, options);
        return this;
    }

}

export default IFrameElement