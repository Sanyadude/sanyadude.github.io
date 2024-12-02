import { DivElement } from '../../../ui-element-kit/index.js'
import UIControl from './ui-control.js'
import { UIColor, UIDisplayMode } from '../ui-graphic.js'
import { setBackgroundColor, setBorder, setPadding } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

const setStepperValueBorder = (view) => {
    if (!view.border || !view.border.width) {
        view._stepperDecrementElement.resetBorderRight()
        view._stepperValueElement.resetBorderRight()
        return;
    }
    view._stepperDecrementElement
        .setBorderRight(view.border.width, view.border.color.rgba())
    view._stepperValueElement
        .setBorderRight(view.border.width, view.border.color.rgba())
}

export class UIStepper extends UIControl {

    static get defaultConfig() {
        return {
            displayMode: UIDisplayMode.flex,
            value: 0,
            stepValue: 1,
            incrementStepSymbol: '+',
            decrementStepSymbol: '-',
            minimumValue: -Infinity,
            maximumValue: Infinity,
            valueIsHidden: false,
            innerPadding: null
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIStepper');

        this._stepperDecrementElement = DivElement.create('UIStepperDecrement');
        this._uiElement.addChild(this._stepperDecrementElement);


        this._stepperValueElement = DivElement.create('UIStepperValue');
        this._uiElement.addChild(this._stepperValueElement);

        this._stepperIncrementElement = DivElement.create('UIStepperIncrement');
        this._uiElement.addChild(this._stepperIncrementElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setCursorPointer()
            .setPositionRelative()
            .setUserSelectNone()
        this._stepperValueElement
            .setDisplayFlex()
            .setJustifyContentCenter()
            .setAlignItemsCenter()
            .setBoxSizingBorderBox()
            .setFlexGrow(2)
        this._stepperDecrementElement
            .setDisplayFlex()
            .setJustifyContentCenter()
            .setAlignItemsCenter()
            .setBoxSizingBorderBox()
            .setFlexGrow(1)
            .setText(config.decrementStepSymbol)
            .onClick(() => this.decrement())
        this._stepperIncrementElement
            .setDisplayFlex()
            .setJustifyContentCenter()
            .setAlignItemsCenter()
            .setBoxSizingBorderBox()
            .setFlexGrow(1)
            .setText(config.incrementStepSymbol)
            .onClick(() => this.increment())

        this.innerPadding = config.innerPadding;
        this.decrementBackgroundColor = config.decrementBackgroundColor;
        this.incrementBackgroundColor = config.incrementBackgroundColor;

        this.stepValue = config.stepValue;
        this.minimumValue = config.minimumValue;
        this.maximumValue = config.maximumValue;

        this.valueIsHidden = config.valueIsHidden;

        this.state = config.state;
        this.value = config.value;
        this.onValueChanged = config.onValueChanged;
    }

    setValueIsHidden(valueIsHidden = true) {
        this.valueIsHidden = valueIsHidden;
        return this;
    }

    set valueIsHidden(valueIsHidden) {
        this._valueIsHidden = valueIsHidden;
        valueIsHidden ? this._stepperValueElement.hide() : this._stepperValueElement.show();
    }

    get valueIsHidden() {
        return this._valueIsHidden;
    }

    set border(uiBorder) {
        this._borderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => {
            setBorder(propery, context._uiElement);
            setStepperValueBorder(context, context._uiElement);
        });
        this._borderProxy.apply();
    }

    get border() {
        return super.border;
    }

    setInnerPadding(uiOffset) {
        this.innerPadding = uiOffset;
        return this;
    }

    set innerPadding(uiOffset) {
        this._innerPaddingProxy = new UIPropertyProxy(uiOffset?.copy(), this, (propery, context) => {
            setPadding(propery, context._stepperValueElement);
            setPadding(propery, context._stepperDecrementElement);
            setPadding(propery, context._stepperIncrementElement);
        });
        this._innerPaddingProxy.apply();
    }

    get innerPadding() {
        return this._innerPaddingProxy?.property;
    }

    setIncrementBackgroundColor(uiColor) {
        this.incrementBackgroundColor = uiColor;
        return this;
    }

    set incrementBackgroundColor(uiColor) {
        this._incrementBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._stepperIncrementElement));
        this._incrementBackgroundColorProxy.apply();
    }

    get incrementBackgroundColor() {
        return this._incrementBackgroundColorProxy?.property;
    }

    setDecrementBackgroundColor(uiColor = UIColor.white) {
        this.decrementBackgroundColor = uiColor;
        return this;
    }

    set decrementBackgroundColor(uiColor) {
        this._decrementBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._stepperDecrementElement));
        this._decrementBackgroundColorProxy.apply();
    }

    get decrementBackgroundColor() {
        return this._decrementBackgroundColorProxy?.property;
    }

    setValue(value = 0, ignoreNextTrigger) {
        return super.setValue(value, ignoreNextTrigger);
    }

    set value(value) {
        value = Math.min(Math.max(value, this.minimumValue), this.maximumValue);
        this._stepperValueElement.setText(value);
        super.value = value;
    }

    get value() {
        return this._value;
    }

    setStepValue(stepValue = 1) {
        this.stepValue = stepValue;
        return this;
    }

    set stepValue(stepValue) {
        this._stepValue = stepValue;
    }

    get stepValue() {
        return this._stepValue;
    }

    setMinimumValue(minimumValue = -Infinity) {
        this.minimumValue = minimumValue;
        return this;
    }

    set minimumValue(minimumValue) {
        this._minimumValue = minimumValue;
    }

    get minimumValue() {
        return this._minimumValue;
    }

    setMaximumValue(maximumValue = Infinity) {
        this.maximumValue = maximumValue;
        return this;
    }

    set maximumValue(maximumValue) {
        this._maximumValue = maximumValue;
    }

    get maximumValue() {
        return this._maximumValue;
    }

    increment() {
        this.value = this._value + this._stepValue;
        return this;
    }

    decrement() {
        this.value = this._value - this._stepValue;
        return this;
    }
}

export default UIStepper