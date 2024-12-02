export class UIRect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIRect(this._x, this._y, this._width, this._height);
    }

    setPosition(point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    setSize(size) {
        this.width = size.width;
        this.height = size.height;
        return this;
    }

    setX(x = 0) {
        this.x = x;
        return this;
    }

    set x(x) {
        this._x = x;
        this.applyProxy();
    }

    get x() {
        return this._x;
    }

    setY(y = 0) {
        this.y = y;
        return this;
    }

    set y(y) {
        this._y = y;
        this.applyProxy();
    }

    get y() {
        return this._y;
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

    static get zero() {
        return new UIRect();
    }

}

export default UIRect