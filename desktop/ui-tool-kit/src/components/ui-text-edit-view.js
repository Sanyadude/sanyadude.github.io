import { DivElement, TextAreaElement } from '../../../ui-element-kit/index.js'
import UIControl from './ui-control.js'
import { UIColor, UIDisplayMode } from '../ui-graphic.js'
import { setFont, setTextColor, setTextAlign, setPadding } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

export class UITextEditView extends UIControl {

    static get defaultConfig() {
        return {
            displayMode: UIDisplayMode.flex,
            placeholder: '',
            value: ''
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UITextEditView');

        this._textEditViewTextareaElement = TextAreaElement.create('UITextEditViewTextarea');
        this._uiElement.addChild(this._textEditViewTextareaElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()

        this._textEditViewTextareaElement
            .setDisplayInlineBlock()
            .setBoxSizingBorderBox()
            .setOutlineNone()
            .setFullSize()
            .setPadding(0)
            .setBorder(0)
            .setResizeNone()
            .setBackgroundColor(UIColor.transparent.rgba())
            .onInput((uiElement, event) => this.value = uiElement.getValue())

        this.placeholder = config.placeholder;

        this.state = config.state;
        this.value = config.value;
        this.onValueChanged = config.onValueChanged;
    }

    getTextEditViewTextareaElement() {
        return this._textEditViewTextareaElement;
    }

    setValue(value = '', ignoreNextTrigger) {
        return super.setValue(value, ignoreNextTrigger);
    }

    set value(value) {
        this._textEditViewTextareaElement.setValue(value);
        super.value = value;
    }

    get value() {
        return this._value;
    }

    setPlaceholder(placeholder = '') {
        this.placeholder = placeholder;
        return this;
    }

    set placeholder(placeholder) {
        this._placeholder = placeholder;
        this._textEditViewTextareaElement.setPlaceholder(placeholder);
    }

    get placeholder() {
        return this._placeholder;
    }

    set font(uiFont) {
        this._fontProxy = new UIPropertyProxy(uiFont?.copy(), this, (propery, context) => setFont(propery, context._textEditViewTextareaElement));
        this._fontProxy.apply();
    }

    get font() {
        return super.font;
    }

    set textColor(uiColor) {
        this._textColor = uiColor ? uiColor.copy() : null;
        setTextColor(this._textColor, this._textEditViewTextareaElement);
    }

    get textColor() {
        if (!this._textColor) return null;
        return this._textColor.copy();
    }

    set textAlign(textAlign) {
        if (!textAlign) return;
        this._textAlign = textAlign;
        setTextAlign(this._textAlign, this._textEditViewTextareaElement);
    }

    get textAlign() {
        return this._textAlign;
    }

    set padding(uiOffset) {
        super.padding = uiOffset;
        setPadding(this._padding, this._textEditViewTextareaElement);
    }

    get padding() {
        return super.padding;
    }

    selectText() {
        this._textEditViewTextareaElement.selectText();
        return this;
    }
}

export default UITextEditView