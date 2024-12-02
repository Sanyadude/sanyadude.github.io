import { DivElement, InputElement } from '../../../ui-element-kit/index.js'
import UIControl from './ui-control.js'
import { UIColor, UIDisplayMode } from '../ui-graphic.js'
import { setFont, setTextColor, setTextAlign } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

export class UITextField extends UIControl {

    static get defaultConfig() {
        return {
            displayMode: UIDisplayMode.flex,
            placeholder: '',
            value: ''
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UITextField');

        this._textFieldInputElement = InputElement.create('UITextFieldInput');
        this._uiElement.addChild(this._textFieldInputElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()

        this._textFieldInputElement
            .setDisplayInlineBlock()
            .setBoxSizingBorderBox()
            .setOutlineNone()
            .setFullWidth()
            .setPadding(0)
            .setBorder(0)
            .setBackgroundColor(UIColor.transparent.rgba())
            .onInput((uiElement, event) => this.value = uiElement.getValue())

        this.placeholder = config.placeholder;

        this.state = config.state;
        this.value = config.value;
        this.onValueChanged = config.onValueChanged;
    }

    getTextFieldInputElement() {
        return this._textFieldInputElement;
    }

    setValue(value = '', ignoreNextTrigger) {
        return super.setValue(value, ignoreNextTrigger);
    }

    set value(value) {
        this._textFieldInputElement.setValue(value);
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
        this._textFieldInputElement.setPlaceholder(placeholder);
    }

    get placeholder() {
        return this._placeholder;
    }

    set font(uiFont) {
        this._fontProxy = new UIPropertyProxy(uiFont?.copy(), this, (propery, context) => {
            setFont(propery, context._textFieldInputElement);
            if (propery && propery.lineHeight) {
                context._textFieldInputElement.setHeight(propery.lineHeight)
            } else {
                context._textFieldInputElement.resetHeight()
            }
        });
        this._fontProxy.apply();
    }

    get font() {
        return super.font;
    }

    set textColor(uiColor) {
        this._textColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setTextColor(propery, context._textFieldInputElement));
        this._textColorProxy.apply();
    }

    get textColor() {
        return super.textColor;
    }

    set textAlign(textAlign) {
        if (!textAlign) return;
        this._textAlign = textAlign;
        setTextAlign(this._textAlign, this._textFieldInputElement);
    }

    get textAlign() {
        return this._textAlign;
    }

    selectText() {
        this._textFieldInputElement.selectText();
        return this;
    }
}

export default UITextField