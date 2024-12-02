const getFloatSafe = (number) => {
    if (typeof number !== 'number') return 0;
    if (number > 1) return 1;
    if (number < 0) return 0;
    return number;
}

export class UIColor {
    constructor(red = 0, green = 0, blue = 0, alpha = 1) {
        this._red = getFloatSafe(red);
        this._green = getFloatSafe(green);
        this._blue = getFloatSafe(blue);
        this._alpha = getFloatSafe(alpha);
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIColor(this._red, this._green, this._blue, this._alpha);
    }

    setRed(red = 0) {
        this.red = red;
        return this;
    }

    set red(red) {
        this._red = getFloatSafe(red);
        this.applyProxy();
    }

    get red() {
        return this._red;
    }

    setGreen(green = 0) {
        this.green = green;
        return this;
    }

    set green(green) {
        this._green = getFloatSafe(green);
        this.applyProxy();
    }

    get green() {
        return this._green;
    }

    setBlue(blue = 0) {
        this.blue = blue;
        return this;
    }

    set blue(blue) {
        this._blue = getFloatSafe(blue);
        this.applyProxy();
    }

    get blue() {
        return this._blue;
    }

    setAlpha(alpha = 1) {
        this.alpha = alpha;
        return this;
    }

    set alpha(alpha) {
        this._alpha = getFloatSafe(alpha);
        this.applyProxy();
    }

    get alpha() {
        return this._alpha;
    }

    rgba() {
        return `rgba(${UIColor.floatToInt(this._red)},${UIColor.floatToInt(this._green)},${UIColor.floatToInt(this._blue)},${this._alpha})`;
    }

    rgb() {
        return `rgb(${UIColor.floatToInt(this._red)},${UIColor.floatToInt(this._green)},${UIColor.floatToInt(this._blue)})`;
    }

    hex() {
        return `#${UIColor.floatToHex(this._red)}${UIColor.floatToHex(this._green)}${UIColor.floatToHex(this._blue)}`;
    }

    static intToFloat(number = 0) {
        return number / 255;
    }

    static floatToInt(number = 0) {
        return Math.floor(number * 255);
    }

    static hexToFloat(number = '00') {
        const hex = parseInt(number, 16);
        return isNaN(hex) ? 0 : hex / 255;
    }

    static floatToHex(number = 0) {
        const integer = UIColor.floatToInt(number);
        return `${integer < 16 ? '0' : ''}${integer.toString(16)}`;
    }

    static intToHex(number = 0) {
        return `${number < 16 ? '0' : ''}${number.toString(16)}`;
    }

    static hexToInt(number = '00') {
        const hex = parseInt(number, 16);
        return isNaN(hex) ? 0 : hex;
    }

    static get black() {
        return new UIColor(0, 0, 0);
    }

    static get grey() {
        return new UIColor(.5, .5, .5);
    }

    static get white() {
        return new UIColor(1, 1, 1);
    }

    static get red() {
        return new UIColor(1, 0, 0);
    }

    static get green() {
        return new UIColor(0, 1, 0);
    }

    static get blue() {
        return new UIColor(0, 0, 1);
    }

    static get transparent() {
        return new UIColor(0, 0, 0, 0);
    }

    static get random() {
        return new UIColor(Math.random(), Math.random(), Math.random());
    }

    static get randomAlpha() {
        return new UIColor(Math.random(), Math.random(), Math.random(), Math.random());
    }

}

export default UIColor