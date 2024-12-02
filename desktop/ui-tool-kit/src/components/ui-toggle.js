import { DivElement } from '../../../ui-element-kit/index.js'
import UIControl from './ui-control.js'
import { UIColor, UIRect, UISizeMode, UIFont, UIState, UIDisplayMode, UIShadow, UIBorder } from '../ui-graphic.js'
import { setBackgroundColor, setBorder, setBorderRadius, setShadow } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

const DEFAULT_STATE = Object.freeze({
    on: new UIState(),
    off: new UIState()
})

const TOGGLE_BORDER_WIDTH = UIFont.DEFAULT_UI_FONT_SIZE / 8;
const TOGGLE_WIDTH = UIFont.DEFAULT_UI_FONT_SIZE * 2 - TOGGLE_BORDER_WIDTH * 2;
const TOGGLE_HEIGHT = UIFont.DEFAULT_UI_FONT_SIZE;

const setThumbFrame = (propery, context) => {
    context._toggleThumbElement
        .setWidth(propery.width)
        .setHeight(propery.height)
        .setTop(context.frame.height / 2 - propery.height / 2 - (context.border ? context.border.width : 0))
}

export class UIToggle extends UIControl {

    static get defaultConfig() {
        return {
            frame: new UIRect(0, 0, TOGGLE_WIDTH, TOGGLE_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            displayMode: UIDisplayMode.flex,
            border: new UIBorder(TOGGLE_BORDER_WIDTH, UIColor.black),
            thumbFrame: new UIRect(0, 0, TOGGLE_HEIGHT - TOGGLE_BORDER_WIDTH * 2, TOGGLE_HEIGHT - TOGGLE_BORDER_WIDTH * 2),
            thumbBackgroundColor: UIColor.black,
            thumbBorder: null,
            thumbBorderRadius: 0,
            thumbShadow: null,
            value: false,
            states: DEFAULT_STATE
        };
    }

    static get defaultState() {
        return DEFAULT_STATE;
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIToggle');

        this._toggleThumbElement = DivElement.create('UIToggleThumb');
        this._uiElement.addChild(this._toggleThumbElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setCursorPointer()
            .setPositionRelative()
            .onClick(() => this.toggle())
        this._toggleThumbElement
            .setDisplayInlineBlock()
            .setBoxSizingBorderBox()
            .setPositionAbsolute()

        this.thumbBackgroundColor = config.thumbBackgroundColor;

        this.thumbBorder = config.thumbBorder;
        this.thumbBorderRadius = config.thumbBorderRadius;

        this.thumbShadow = config.thumbShadow;

        this.thumbFrame = config.thumbFrame;

        this.states = config.states;
        this.state = config.states.off;
        this.value = config.value;
        this.onValueChanged = config.onValueChanged;
    }

    set value(value) {
        if (value)
            this._uiElement.setJustifyContentEnd();
        else
            this._uiElement.setJustifyContentStart();
        this.state = value ? this.states.on : this.states.off;
        super.value = value;
    }

    get value() {
        return this._value;
    }

    set frame(uiRect) {
        super.frame = uiRect;
        this._thumbFrameProxy?.apply();
    }

    get frame() {
        return super.frame;
    }

    set border(uiBorder) {
        super.border = uiBorder;
        this._thumbFrameProxy?.apply();
    }

    get border() {
        return super.border;
    }

    setThumbFrame(uiRect = UIRect.zero) {
        this.thumbFrame = uiRect;
        return this;
    }

    set thumbFrame(uiRect) {
        this._thumbFrameProxy = new UIPropertyProxy(uiRect?.copy(), this, (propery, context) => setThumbFrame(propery, context));
        this._thumbFrameProxy.apply();
    }

    get thumbFrame() {
        return this._thumbFrameProxy?.property;
    }

    setThumbBackgroundColor(uiColor) {
        this.thumbBackgroundColor = uiColor;
        return this;
    }

    set thumbBackgroundColor(uiColor) {
        this._thumbBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._toggleThumbElement));
        this._thumbBackgroundColorProxy.apply();
    }

    get thumbBackgroundColor() {
        return this._thumbBackgroundColorProxy?.property;
    }

    setThumbBorder(uiBorder = UIBorder.default) {
        this.thumbBorder = uiBorder;
        return this;
    }

    set thumbBorder(uiBorder) {
        this._thumbBorderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => setBorder(propery, context._toggleThumbElement));
        this._thumbBorderProxy.apply();
    }

    get thumbBorder() {
        return this._thumbBorderProxy?.property;
    }

    setThumbBorderRadius(thumbBorderRadius = 0) {
        this.thumbBorderRadius = thumbBorderRadius;
        return this;
    }

    set thumbBorderRadius(thumbBorderRadius) {
        this._thumbBorderRadius = thumbBorderRadius;
        setBorderRadius(this._thumbBorderRadius, this._toggleThumbElement);
    }

    get thumbBorderRadius() {
        return this._thumbBorderRadius;
    }

    setThumbShadow(uiShadow = UIShadow.none) {
        this.thumbShadow = uiShadow;
        return this;
    }

    set thumbShadow(uiShadow) {
        this._thumbShadowProxy = new UIPropertyProxy(uiShadow?.copy(), this, (propery, context) => setShadow(propery, context._toggleThumbElement));
        this._thumbShadowProxy.apply();
    }

    get thumbShadow() {
        return this._thumbShadowProxy?.property;
    }

    toggle() {
        this.value = !this.value;
        return this;
    }

    toggleOn() {
        this.value = true;
        return this;
    }

    toggleOff() {
        this.value = false;
        return this;
    }
}

export default UIToggle