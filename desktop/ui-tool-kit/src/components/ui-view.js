import { DivElement } from '../../../ui-element-kit/index.js'
import UIComponent from './ui-component.js'
import { UIRect, UISizeMode, UIEdgeSet, UIDisplayMode, UIShadow, UIBorder, UIOffset } from '../ui-graphic.js'
import { 
    setBackgroundColor, setPosition, setFont, setTextColor, setTextAlign, 
    setPadding, setMargin, setBorder, setShadow, setDisplayMode, setBorderRadius, 
    setFrame, setInitialPosition, 
    setTextShadow
} from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

export class UIView extends UIComponent {

    static get defaultConfig() {
        return {
            //size & position
            frame: new UIRect(),
            widthMode: UISizeMode.default,
            heightMode: UISizeMode.default,
            anchor: UIEdgeSet.topLeft,
            initialPosition: true,
            displayMode: UIDisplayMode.default,
            //visibility
            isHidden: false,
            clipToFrame: false,
            opacity: 1,
            zIndex: 0,
            //styling
            backgroundColor: null,
            shadow: null,
            border: null,
            borderRadius: 0,
            //offsets
            padding: null,
            margin: null,
            //text
            font: null,
            textColor: null,
            textAlign: null,
            textShadow: null
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIView');
    }

    _configure(config) {
        this._uiElement.setBoxSizingBorderBox()

        this.superView = null;
        this.subViews = [];

        this.displayMode = config.displayMode;

        this.frame = config.frame;

        this.anchor = config.anchor;

        this.initialPosition = config.initialPosition;
        this.widthMode = config.widthMode;
        this.heightMode = config.heightMode;

        this.isHidden = config.isHidden;
        this.clipToFrame = config.clipToFrame;
        this.opacity = config.opacity;
        this.zIndex = config.zIndex;

        this.backgroundColor = config.backgroundColor;
        this.shadow = config.shadow;

        this.border = config.border;
        this.borderRadius = config.borderRadius;

        this.padding = config.padding;
        this.margin = config.margin;

        this.font = config.font;
        this.textColor = config.textColor;
        this.textAlign = config.textAlign;
        this.textShadow = config.textShadow;
    }

    show() {
        this._uiElement.show();
    }

    hide() {
        this._uiElement.hide();
    }

    setIsHidden(isHidden = true) {
        this.isHidden = isHidden;
        return this;
    }

    set isHidden(isHidden) {
        if (isHidden)
            this._uiElement.hide();
        else
            this._uiElement.show();
    }

    get isHidden() {
        return this._uiElement.isHidden();
    }

    setClipToFrame(clipToFrame = true) {
        this.clipToFrame = clipToFrame;
        return this;
    }

    set clipToFrame(clipToFrame) {
        this._clipToFrame = clipToFrame;
        if (this._clipToFrame)
            this._uiElement.setOverflowHidden();
        else
            this._uiElement.resetOverflow();
    }

    get clipToFrame() {
        return this._clipToFrame;
    }
    
    setOpacity(opacity = 1) {
        this.opacity = opacity;
        return this;
    }

    set opacity(opacity) {
        this._opacity = opacity;
        if (this.opacity === 1)
            this._uiElement.resetOpacity();
        else
            this._uiElement.setOpacity(this.opacity);
    }

    get opacity() {
        return this._opacity;
    }

    setZIndex(zIndex = 0) {
        this.zIndex = zIndex;
        return this;
    }

    set zIndex(zIndex) {
        this._zIndex = zIndex;
        if (this._zIndex)
            this._uiElement.setZIndex(this._zIndex);
        else
            this._uiElement.resetZIndex();
    }

    get zIndex() {
        return this._zIndex;
    }

    setDisplayMode(displayMode) {
        this.displayMode = displayMode;
        return this;
    }

    set displayMode(displayMode) {
        this._displayMode = displayMode;
        setDisplayMode(this, this._uiElement);
    }

    get displayMode() {
        return this._displayMode;
    }

    setAnchor(anchor) {
        this.anchor = anchor;
        return this;
    }

    set anchor(anchor) {
        if (!anchor) return;
        this._anchor = anchor;
        if (this._initialPosition) return;
        setPosition(this, this._uiElement)
    }

    get anchor() {
        return this._anchor;
    }

    setDefaultSize() {
        this.widthMode = UISizeMode.default;
        this.heightMode = UISizeMode.default;
        return this;
    }

    setFullSize() {
        this.widthMode = UISizeMode.fullSize;
        this.heightMode = UISizeMode.fullSize;
        return this;
    }

    setFrameSize() {
        this.widthMode = UISizeMode.frameSize;
        this.heightMode = UISizeMode.frameSize;
        return this;
    }

    setWidthMode(widthMode = UISizeMode.default) {
        this.widthMode = widthMode;
        return this;
    }

    set widthMode(widthMode) {
        this._widthMode = widthMode;
        switch (widthMode) {
            case UISizeMode.fullSize:
                this._uiElement.setFullWidth();
                break;
            case UISizeMode.frameSize:
                this._uiElement.setWidth(this.frame.width);
                break;
            case UISizeMode.default:
                this._uiElement.resetWidth();
                break;
        }
    }

    get widthMode() {
        return this._widthMode;
    }

    setHeightMode(heightMode = UISizeMode.default) {
        this.heightMode = heightMode;
        return this;
    }

    set heightMode(heightMode) {
        this._heightMode = heightMode;
        switch (heightMode) {
            case UISizeMode.fullSize:
                this._uiElement.setFullHeight();
                break;
            case UISizeMode.frameSize:
                this._uiElement.setHeight(this.frame.height);
                break;
            case UISizeMode.default:
                this._uiElement.resetHeight();
                break;
        }
    }

    get heightMode() {
        return this._heightMode;
    }

    setFrame(uiRect = UIRect.zero) {
        this.frame = uiRect;
        return this;
    }

    set frame(uiRect) {
        this._frameProxy = new UIPropertyProxy(uiRect?.copy(), this, (propery, context) => setFrame(context, context._uiElement));
        this._frameProxy.apply();
    }

    get frame() {
        return this._frameProxy?.property;
    }

    setInitialPosition(initialPosition = true) {
        this.initialPosition = initialPosition;
        return this;
    }

    set initialPosition(initialPosition) {
        this._initialPosition = initialPosition;
        setInitialPosition(this, this._uiElement)
    }

    get initialPosition() {
        return this._initialPosition;
    }

    setBackgroundColor(uiColor) {
        this.backgroundColor = uiColor;
        return this;
    }

    set backgroundColor(uiColor) {
        this._backgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._uiElement));
        this._backgroundColorProxy.apply();
    }

    get backgroundColor() {
        return this._backgroundColorProxy?.property;
    }

    setBorder(uiBorder = UIBorder.default) {
        this.border = uiBorder;
        return this;
    }

    set border(uiBorder) {
        this._borderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => setBorder(propery, context._uiElement));
        this._borderProxy.apply();
    }

    get border() {
        return this._borderProxy?.property;
    }

    setBorderRadius(borderRadius = 0) {
        this.borderRadius = borderRadius;
        return this;
    }

    set borderRadius(borderRadius) {
        this._borderRadius = borderRadius;
        setBorderRadius(this._borderRadius, this._uiElement);
    }

    get borderRadius() {
        return this._borderRadius;
    }

    setPadding(uiOffset = UIOffset.default) {
        this.padding = uiOffset;
        return this;
    }

    set padding(uiOffset) {
        this._paddingProxy = new UIPropertyProxy(uiOffset?.copy(), this, (propery, context) => setPadding(propery, context._uiElement));
        this._paddingProxy.apply();
    }

    get padding() {
        return this._paddingProxy?.property;
    }

    setMargin(uiOffset = UIOffset.default) {
        this.margin = uiOffset;
        return this;
    }

    set margin(uiOffset) {
        this._marginProxy = new UIPropertyProxy(uiOffset?.copy(), this, (propery, context) => setMargin(propery, context._uiElement));
        this._marginProxy.apply();
    }

    get margin() {
        return this._marginProxy?.property;
    }

    setShadow(uiShadow = UIShadow.none) {
        this.shadow = uiShadow;
        return this;
    }

    set shadow(uiShadow) {
        this._shadowProxy = new UIPropertyProxy(uiShadow?.copy(), this, (propery, context) => setShadow(propery, context._uiElement));
        this._shadowProxy.apply();
    }

    get shadow() {
        return this._shadowProxy?.property;
    }

    setFont(uiFont) {
        this.font = uiFont;
        return this;
    }

    set font(uiFont) {
        this._fontProxy = new UIPropertyProxy(uiFont?.copy(), this, (propery, context) => setFont(propery, context._uiElement));
        this._fontProxy.apply();
    }

    get font() {
        return this._fontProxy?.property;
    }

    setTextColor(uiColor) {
        this.textColor = uiColor;
        return this;
    }

    set textColor(uiColor) {
        this._textColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setTextColor(propery, context._uiElement));
        this._textColorProxy.apply();
    }

    get textColor() {
        return this._textColorProxy?.property;
    }

    setTextShadow(uiShadow) {
        this.shadow = uiShadow;
        return this;
    }

    set textShadow(uiShadow) {
        this._textShadowProxy = new UIPropertyProxy(uiShadow?.copy(), this, (propery, context) => setTextShadow(propery, context._uiElement));
        this._textShadowProxy.apply();
    }

    get textShadow() {
        return this._textShadowProxy?.property;
    }

    setTextAlign(textAlign) {
        this.textAlign = textAlign;
        return this;
    }

    set textAlign(textAlign) {
        if (!textAlign) return;
        this._textAlign = textAlign;
        setTextAlign(this._textAlign, this._uiElement);
    }

    get textAlign() {
        return this._textAlign;
    }

    addSubview(uiComponent) {
        if (!uiComponent.getUIElement) return this;
        this.subViews.push(uiComponent);
        this._uiElement.addChild(uiComponent.getUIElement());
        uiComponent.superView = this;
        return this;
    }

    addSubviews(uiComponents = []) {
        uiComponents.forEach(uiComponent => this.addSubview(uiComponent));
        return this;
    }

    getSubview(index) {
        if (!this.subViews[index]) return null;
        return this.subViews[index];
    }

    getFirsSubview() {
        return this.getSubview(0);
    }

    getLastSubview() {
        return this.getSubview(this.subViews.length - 1);
    }

    removeSubview(uiComponent) {
        if (!uiComponent.getUIElement) return this;
        this.subViews = this.subViews.filter(subView => subView !== uiComponent);
        this._uiElement.removeChild(uiComponent.getUIElement());
        uiComponent.superView = null;
        return this;
    }

    removeSubviews(uiComponents) {
        uiComponents.forEach(uiComponent => this.removeSubview(uiComponent));
        return this;
    }
}

export default UIView