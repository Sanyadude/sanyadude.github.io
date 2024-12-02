import UIElement from '../ui-element/ui-element.js'

export class InputElement extends UIElement {
    static get tag() {
        return 'input';
    }

    _init() {
        super._init();
        delete this._text;
    }

    _canSetText() {
        return false;
    }

    setPlaceholder(value) {
        this._setElementAttribute('placeholder', value);
        return this;
    }

    getPlaceholder() {
        return this._getElementAttribute('placeholder');
    }

    resetPlaceholder() {
        this._resetElementAttribute('placeholder');
        return this;
    }

    onInput(listener, options) {
        this._addElementEventListener('input', listener, options);
        return this;
    }

    offInput(listener, options) {
        this._removeElementEventListener('input', listener, options);
        return this;
    }

    setValue(value) {
        this._element.value = value;
        return this;
    }

    getValue() {
        return this._element.value;
    }

    selectText() {
        this._element.select();
        return this;
    }

}

export default InputElement