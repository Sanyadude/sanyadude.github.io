import { DivElement } from '../../../ui-element-kit/index.js'
import UIControl from './ui-control.js'
import { UIFont, UIColor, UIRect, UISizeMode, UIEdgeSet, UIShadow, UIBorder } from '../ui-graphic.js'
import { setBackgroundColor, setBorder, setBorderRadius, setShadow } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

const minMaxValue = (value, min, max) => Math.min(Math.max(value, min), max);

const setValueOnSliderChange = (view, uiElement, event) => {
    const originalValue = view._value;
    const thumbWidth = view._sliderThumbElement.getClientWidth() || view.thumbFrame.width;
    const percentage = (event.clientX - uiElement.getClientLeft() - thumbWidth / 2) / (uiElement.getClientWidth() - thumbWidth);
    const percentageNormalized = minMaxValue(percentage, 0, 1);
    let newValue = view._minimumValue + Math.floor(percentageNormalized * (view._maximumValue - view._minimumValue));
    if (newValue != view._maximumValue && newValue != view._minimumValue) {
        const rest = newValue % view._stepValue;
        newValue = rest <= (view._stepValue / 2) ? newValue - rest : newValue + view._stepValue - rest;
    }
    if (originalValue == newValue) return;
    view.value = newValue;
}

const setThumbPositionOnTrack = (view, value) => {
    const fraction = (value - view._minimumValue) / (view._maximumValue - view._minimumValue);
    const fullWidth = view._uiElement.getClientWidth() || view.frame.width;
    const thumbWidth = view._sliderThumbElement.getClientWidth() || view.thumbFrame.width;
    const positionPx = thumbWidth / 2 + fraction * (fullWidth - thumbWidth);
    const percentage = positionPx / fullWidth * 100;
    view._sliderTrackFillElement.setWidthPercentage(percentage);
    view._sliderThumbElement.setLeft(percentage, '%');
}

const startSlide = (context, uiElement, event) => {
    context._sliding = true;
    const onMove = (event) => {
        event.preventDefault();
        if (!context._sliding) return;
        setValueOnSliderChange(context, uiElement, event);
    }
    const onMouseUp = (event) => {
        event.preventDefault();
        if (!context._sliding) return;
        setValueOnSliderChange(context, uiElement, event);
        context._sliding = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
}

const SLIDER_BORDER_WIDTH = UIFont.DEFAULT_UI_FONT_SIZE / 8;
const SLIDER_WIDTH = UIFont.DEFAULT_UI_FONT_SIZE * 8;
const SLIDER_HEIGHT = UIFont.DEFAULT_UI_FONT_SIZE;

const setThumbFrame = (propery, context) => {
    context._sliderThumbElement
        .setWidth(propery.width)
        .setHeight(propery.height)
        .setTop(context.frame.height / 2 - propery.height / 2 - (context.border ? context.border.width : 0))
        .setMarginLeft(-propery.width / 2)
    setThumbPositionOnTrack(context, context._value);
}

export class UISlider extends UIControl {

    static get defaultConfig() {
        return {
            frame: new UIRect(0, 0, SLIDER_WIDTH, SLIDER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            paddingEdges: UIEdgeSet.vertical,
            trackBackgroundColor: null,
            trackBorder: new UIBorder(SLIDER_BORDER_WIDTH, UIColor.black),
            trackBorderRadius: 0,
            trackFillBackgroundColor: null,
            thumbFrame: new UIRect(0, 0, SLIDER_HEIGHT, SLIDER_HEIGHT),
            thumbBackgroundColor: UIColor.black,
            thumbBorder: null,
            thumbBorderRadius: 0,
            thumbShadow: null,
            value: 0,
            stepValue: 1,
            minimumValue: 0,
            maximumValue: 100,
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UISlider');

        this._sliderTrackElement = DivElement.create('UISliderTrack');
        this._uiElement.addChild(this._sliderTrackElement);

        this._sliderTrackFillElement = DivElement.create('UISliderTrackFill');
        this._sliderTrackElement.addChild(this._sliderTrackFillElement);

        this._sliderThumbElement = DivElement.create('UISliderThumb');
        this._uiElement.addChild(this._sliderThumbElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setCursorPointer()
            .setUserSelectNone()
            .setPositionRelative()
            .onMouseDown((uiElement, event) => startSlide(this, uiElement))
        this._sliderTrackElement
            .setBoxSizingBorderBox()
            .setFullSize()
        this._sliderTrackFillElement
            .setFullHeight()
            .setWidthPercentage(0)
        this._sliderThumbElement
            .setBoxSizingBorderBox()
            .setPositionAbsolute()

        this.trackBackgroundColor = config.trackBackgroundColor;
        this.trackBorder = config.trackBorder;
        this.trackBorderRadius = config.trackBorderRadius;

        this.thumbBackgroundColor = config.thumbBackgroundColor;

        this.thumbBorder = config.thumbBorder;
        this.thumbBorderRadius = config.thumbBorderRadius;

        this.thumbShadow = config.thumbShadow;

        this.thumbFrame = config.thumbFrame;

        this.trackFillBackgroundColor = config.trackFillBackgroundColor;

        this.stepValue = config.stepValue;
        this.minimumValue = config.minimumValue;
        this.maximumValue = config.maximumValue;

        this.state = config.state;
        this.value = config.value;
        this.onValueChanged = config.onValueChanged;
    }

    setValue(value = 0, ignoreNextTrigger) {
        return super.setValue(value, ignoreNextTrigger);
    }

    set value(value) {
        value = minMaxValue(value, this._minimumValue, this._maximumValue);
        setThumbPositionOnTrack(this, value);
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

    setMinimumValue(minimumValue = 0) {
        this.minimumValue = minimumValue;
        return this;
    }

    set minimumValue(minimumValue) {
        this._minimumValue = minimumValue;
    }

    get minimumValue() {
        return this._minimumValue;
    }

    setMaximumValue(maximumValue = 100) {
        this.maximumValue = maximumValue;
        return this;
    }

    set maximumValue(maximumValue) {
        this._maximumValue = maximumValue;
    }

    get maximumValue() {
        return this._maximumValue;
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
    //track
    setTrackBackgroundColor(uiColor) {
        this.trackBackgroundColor = uiColor;
        return this;
    }

    set trackBackgroundColor(uiColor) {
        this._trackBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._sliderTrackElement));
        this._trackBackgroundColorProxy.apply();
    }

    get trackBackgroundColor() {
        return this._trackBackgroundColorProxy?.property;
    }

    setTrackBorder(uiBorder = UIBorder.default) {
        this.trackBorder = uiBorder;
        return this;
    }

    set trackBorder(uiBorder) {
        this._trackBorderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => setBorder(propery, context._sliderTrackElement));
        this._trackBorderProxy.apply();
    }

    get trackBorder() {
        return this._trackBorderProxy?.property;
    }

    setTrackBorderRadius(trackBorderRadius = 0) {
        this.trackBorderRadius = trackBorderRadius;
        return this;
    }

    set trackBorderRadius(trackBorderRadius) {
        this._trackBorderRadius = trackBorderRadius;
        setBorderRadius(this._trackBorderRadius, this._sliderTrackElement);
        setBorderRadius(this._trackBorderRadius, this._sliderTrackFillElement);
    }

    get trackBorderRadius() {
        return this._trackBorderRadius;
    }
    //thumb
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
        this._thumbBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._sliderThumbElement));
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
        this._thumbBorderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => setBorder(propery, context._sliderThumbElement));
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
        setBorderRadius(this._thumbBorderRadius, this._sliderThumbElement);
    }

    get thumbBorderRadius() {
        return this._thumbBorderRadius;
    }

    setThumbShadow(uiShadow = UIShadow.none) {
        this.thumbShadow = uiShadow;
        return this;
    }

    set thumbShadow(uiShadow) {
        this._thumbShadowProxy = new UIPropertyProxy(uiShadow?.copy(), this, (propery, context) => setShadow(propery, context._sliderThumbElement));
        this._thumbShadowProxy.apply();
    }

    get thumbShadow() {
        return this._thumbShadowProxy?.property;
    }

    setTrackFillBackgroundColor(uiColor) {
        this.trackFillBackgroundColor = uiColor;
        return this;
    }

    set trackFillBackgroundColor(uiColor) {
        this._trackFillBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._sliderTrackFillElement));
        this._trackFillBackgroundColorProxy.apply();
    }

    get trackFillBackgroundColor() {
        return this._trackFillBackgroundColorProxy?.property;
    }
}

export default UISlider