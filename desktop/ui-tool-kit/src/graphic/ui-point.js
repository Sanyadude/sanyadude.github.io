export class UIPoint {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIPoint(this._x, this._y);
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

    static random(xFrom = 0, xTo = 0, yFrom = 0, yTo = 0) {
        return new UIPoint(xFrom + Math.floor(Math.random()*(xTo - xFrom)), yFrom + Math.floor(Math.random()*(yTo - yFrom)));
    }

    static get zero() {
        return new UIPoint();
    }

}

export default UIPoint