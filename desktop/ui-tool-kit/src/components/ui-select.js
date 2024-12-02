import { DivElement } from '../../../ui-element-kit/index.js'
import UIControl from './ui-control.js'
import { UIDisplayMode, UIBorder } from '../ui-graphic.js'
import { setBackgroundColor, setBorderRadius, setBorder, setPadding } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

export class UISelect extends UIControl {

    static get defaultConfig() {
        return {
            displayMode: UIDisplayMode.flex,
            optionsBackgroundColor: null,
            optionsBorder: null,
            optionsBorderRadius: 0,
            optionHighlightBackgroundColor: null,
            optionPadding: null,
            placeholder: 'Select Option',
            placeholderOption: true,
            options: [],
            value: null
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UISelect');

        this._selectOptionValue = DivElement.create('UISelectOptionValue');
        this._uiElement.addChild(this._selectOptionValue);

        this._selectOptionContainerElement = DivElement.create('UISelectOptionContainer');
        this._uiElement.addChild(this._selectOptionContainerElement);

        this._selectOptionPlaceholder = DivElement.create('UISelectOptionPlaceholder');
        this._selectOptionContainerElement.addChild(this._selectOptionPlaceholder);

        this._selectOptionElements = [];
        config.options.forEach((option, index) => {
            const selectOptionElement = DivElement.create(`UISelectOption${index}`);
            this._selectOptionElements.push(selectOptionElement);
            this._selectOptionContainerElement.addChild(selectOptionElement);
        });
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setCursorPointer()
            .setUserSelectNone()
            .setPositionRelative()
            .onClick((uiElement, event) => this.toggleOptions())

        this._selectOptionValue
            .setDisplayInlineBlock()
            .setFullWidth()
            .setOverflowHidden()
            .setWhiteSpaceNowrap()

        this._selectOptionContainerElement
            .setBoxSizingBorderBox()
            .setPositionAbsolute()
            .setFullWidth()
            .setLeft(0)
            .setTop(100, '%')
            .setMaxHeight(400, '%')
            .setOverflowAuto()
            .setZIndex(1)
            .hide()
            .onClick((uiElement, event) => event.stopPropagation())

        this._selectOptionPlaceholder
            .setDisplayBlock()
            .hide()
            .onClick((uiElement, event) => this.resetOption())

        this._selectOptionElements.forEach((selectOptionElement, index) => {
            selectOptionElement
                .setText(config.options[index])
                .onMouseEnter((uiElement, event) => {
                    if (!this._optionHighlightBackgroundColor) return;
                    uiElement.setBackgroundColor(this._optionHighlightBackgroundColor.rgba())
                })
                .onMouseLeave((uiElement, event) => uiElement.resetBackgroundColor())
                .onClick((uiElement, event) => this.selectOption(index))
        })

        this.optionsBackgroundColor = config.optionsBackgroundColor;
        this.optionsBorder = config.optionsBorder;
        this.optionsBorderRadius = config.optionsBorderRadius;

        this.optionHighlightBackgroundColor = config.optionHighlightBackgroundColor;
        this.optionPadding = config.optionPadding;

        this.placeholder = config.placeholder;
        this.placeholderOption = config.placeholderOption;

        this.state = config.state;
        this.value = config.value;
        this.onValueChanged = config.onValueChanged;
    }

    setValue(value = null, ignoreNextTrigger) {
        return super.setValue(value, ignoreNextTrigger);
    }

    set value(value) {
        const selectOptionElement = this._selectOptionElements[value];
        this._selectOptionValue.setText(selectOptionElement 
            ? selectOptionElement.getText() 
            : this._selectOptionPlaceholder.getText());
        super.value = selectOptionElement ? value : null;
    }

    get value() {
        return super.value;
    }

    setPlaceholder(placeholder = '') {
        this.placeholder = placeholder;
        return this;
    }

    set placeholder(placeholder) {
        this._placeholder = placeholder;
        this._selectOptionValue.setText(this._placeholder);
        this._selectOptionPlaceholder.setText(this._placeholder)
    }

    get placeholder() {
        return this._placeholder;
    }

    setPlaceholderOption(placeholderOption) {
        this.placeholderOption = placeholderOption;
        return this;
    }

    set placeholderOption(placeholderOption) {
        this._placeholderOption = placeholderOption;
        if (this._placeholderOption)
            this._selectOptionPlaceholder.show();
        else
            this._selectOptionPlaceholder.hide();
    }

    get placeholderOption() {
        return this._placeholderOption;
    }

    setOptionsBackgroundColor(uiColor) {
        this.optionsBackgroundColor = uiColor;
        return this;
    }

    set optionsBackgroundColor(uiColor) {
        this._optionsBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._selectOptionContainerElement));
        this._optionsBackgroundColorProxy.apply();
    }

    get optionsBackgroundColor() {
        return this._optionsBackgroundColorProxy?.property;
    }

    setOptionsBorder(uiBorder = UIBorder.default) {
        this.optionsBorder = uiBorder;
        return this;
    }

    set optionsBorder(uiBorder) {
        this._optionsBorderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => setBorder(propery, context._selectOptionContainerElement));
        this._optionsBorderProxy.apply();
    }

    get optionsBorder() {
        return this._optionsBorderProxy?.property;
    }

    setOptionsBorderRadius(optionsBorderRadius = 0) {
        this.optionsBorderRadius = optionsBorderRadius;
        return this;
    }

    set optionsBorderRadius(optionsBorderRadius) {
        this._optionsBorderRadius = optionsBorderRadius;
        setBorderRadius(this._optionsBorderRadius, this._selectOptionContainerElement);
    }

    get optionsBorderRadius() {
        return this._optionsBorderRadius;
    }

    setOptionHighlightBackgroundColor(uiColor) {
        this.optionHighlightBackgroundColor = uiColor;
        return this;
    }

    set optionHighlightBackgroundColor(uiColor) {
        this._optionHighlightBackgroundColor = uiColor ? uiColor.copy() : null;
    }

    get optionHighlightBackgroundColor() {
        if (!this._optionHighlightBackgroundColor) return null;
        return this._optionHighlightBackgroundColor;
    }

    setOptionPadding(uiOffset) {
        this.optionPadding = uiOffset;
        return this;
    }

    set optionPadding(uiOffset) {
        this._optionPaddingProxy = new UIPropertyProxy(uiOffset?.copy(), this, (propery, context) => {
            context._selectOptionElements.forEach(uiElement => setPadding(propery, uiElement));
            setPadding(propery, context._selectOptionPlaceholder);
        });
        this._optionPaddingProxy.apply();
    }

    get optionPadding() {
        return this._optionPaddingProxy?.property;
    }

    resetOption() {
        this._selectOptionContainerElement.hide();
        this.value = null;
    }

    selectOption(index) {
        this._selectOptionContainerElement.hide();
        this.value = index;
    }

    toggleOptions() {
        if (this._selectOptionContainerElement.isHidden())
            this._selectOptionContainerElement.show();
        else
            this._selectOptionContainerElement.hide();
    }

}

export default UISelect