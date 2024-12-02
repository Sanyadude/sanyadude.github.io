export class UIImage {
    constructor(title = '', src = '') {
        this._title = title;
        this._src = src;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIImage(this._title, this._src);
    }

    setTitle(title = '') {
        this._title = title;
        return this;
    }

    set title(title) {
        this._title = title;
        this.applyProxy();
    }

    get title() {
        return this._title;
    }

    setSrc(src = '') {
        this._src = src;
        return this;
    }

    set src(src) {
        this._src = src;
        this.applyProxy();
    }

    get src() {
        return this._src;
    }
}

export default UIImage