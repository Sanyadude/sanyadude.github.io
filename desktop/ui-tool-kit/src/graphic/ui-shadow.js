import UIColor from './ui-color.js'
import UIPoint from './ui-point.js'
import UIPropertyProxy from './ui-property-proxy.js'

export class UIShadow {
    constructor(color, offset = UIPoint.zero, blur = 0, spread = 0) {
        this.color = color;
        this.offset = offset;
        this._blur = blur;
        this._spread = spread;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIShadow(this.color, this.offset, this._blur, this._spread);
    }

    setColor(uiColor) {
        this.color = uiColor;
        return this;
    }

    set color(uiColor) {
        this._colorProxy = new UIPropertyProxy(uiColor?.copy(), this, () => this.applyProxy());
        this._colorProxy.apply();
    }

    get color() {
        return this._colorProxy?.property;
    }

    setOffset(uiPoint) {
        this.offset = uiPoint;
        return this;
    }

    set offset(uiPoint) {
        this._offsetProxy = new UIPropertyProxy(uiPoint?.copy(), this, () => this.applyProxy());
        this._offsetProxy.apply();
    }

    get offset() {
        return this._offsetProxy?.property;
    }

    setBlur(blur = 0) {
        this.blur = blur;
        return this;
    }

    set blur(blur) {
        this._blur = blur;
        this.applyProxy();
    }

    get blur() {
        return this._blur;
    }

    setSpread(spread = 0) {
        this.spread = spread;
        return this;
    }

    set spread(spread) {
        this._spread = spread;
        this.applyProxy();
    }

    get spread() {
        return this._spread;
    }

    static get none() {
        return new UIShadow(UIColor.transparent, UIPoint.zero, -1, 0);
    }

}

export default UIShadow