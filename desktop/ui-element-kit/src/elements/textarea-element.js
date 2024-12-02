import UIElement from '../ui-element/ui-element.js'

export class TextAreaElement extends UIElement {
    static get tag() {
        return 'textarea';
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

    setResize(value) {
        this._setProperty('resize', value);
        return this;
    }

    setResizeNone() {
        this.setResize('none');
        return this;
    }

    getResize() {
        return this._properties['resize']?.toValue()[0];
    }

    resetResize() {
        this._resetProperty('resize');
        return this;
    }

    setRows(value) {
        this._setElementAttribute('rows', value);
        return this;
    }

    getRows() {
        return this._getElementAttribute('rows');
    }

    resetRows() {
        this._resetElementAttribute('rows');
        return this;
    }

    selectText() {
        this._element.select();
        return this;
    }
}

export default TextAreaElement