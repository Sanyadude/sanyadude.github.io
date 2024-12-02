import UIPropertyProxy from './ui-property-proxy.js'

export class UISvg {
    constructor(viewBox, path = '') {
        this.viewBox = viewBox;
        this._path = path;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UISvg(this.viewBox, this._path);
    }

    setViewBox(uiRect) {
        this.viewBox = uiRect;
        return this;
    }

    set viewBox(uiRect) {
        this._viewBoxProxy = new UIPropertyProxy(uiRect?.copy(), this, () => this.applyProxy());
        this._viewBoxProxy.apply();
    }

    get viewBox() {
        return this._viewBoxProxy?.property;
    }

    setPath(path = '') {
        this._path = path;
        return this;
    }

    set path(path) {
        this._path = path;
        this.applyProxy();
    }

    get path() {
        return this._path;
    }

}

export default UISvg