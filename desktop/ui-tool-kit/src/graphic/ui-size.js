export class UISize {
    constructor(width = 0, height = 0) {
        this._width = width;
        this._height = height;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UISize(this._width, this._height);
    }

    setWidth(width = 0) {
        this.width = width;
        return this;
    }

    set width(width) {
        this._width = width;
        this.applyProxy();
    }

    get width() {
        return this._width;
    }

    setHeight(height = 0) {
        this.height = height;
        return this;
    }

    set height(height) {
        this._height = height;
        this.applyProxy();
    }

    get height() {
        return this._height;
    }

    static random(widthFrom = 0, widthTo = 0, heightFrom = 0, heightTo = 0) {
        return new UISize(widthFrom + Math.floor(Math.random()*(widthTo - widthFrom)), heightFrom + Math.floor(Math.random()*(heightTo - heightFrom)));
    }
    
    static get zero() {
        return new UISize();
    }

}

export default UISize