import UIPropertyProxy from './ui-property-proxy.js'
import UIBorderStyle from './ui-border-style.js'
import UIColor from './ui-color.js'
import UIEdgeSet from './ui-edge-set.js'

export const DEFAULT_UI_BORDER_WIDTH = 1;
export const DEFAULT_UI_BORDER_COLOR = UIColor.black;
export const DEFAULT_UI_BORDER_EDGES = UIEdgeSet.all;
export const DEFAULT_UI_BORDER_STYLE = UIBorderStyle.solid;

export class UIBorder {
    constructor(width = UIBorder.DEFAULT_UI_BORDER_WIDTH, color = UIBorder.DEFAULT_UI_BORDER_COLOR, edges = UIBorder.DEFAULT_UI_BORDER_EDGES, style = UIBorder.DEFAULT_UI_BORDER_STYLE) {
        this._width = width;
        this.color = color;
        this._edges = edges;
        this._style = style;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIBorder(this._width, this.color, this._edges, this._style);
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

    setColor(uiColor = UIBorder.DEFAULT_UI_BORDER_COLOR) {
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

    setEdges(edges = UIBorder.DEFAULT_UI_BORDER_EDGES) {
        this.edges = edges;
        return this;
    }

    set edges(edges) {
        this._edges = edges;
        this.applyProxy();
    }

    get edges() {
        return this._edges;
    }

    setStyle(style = UIBorder.DEFAULT_UI_BORDER_STYLE) {
        this.style = style;
        return this;
    }

    set style(style) {
        this._style = style;
    }

    get style() {
        return this._style;
    }

    static get DEFAULT_UI_BORDER_WIDTH() {
        return DEFAULT_UI_BORDER_WIDTH;
    }

    static get DEFAULT_UI_BORDER_COLOR() {
        return DEFAULT_UI_BORDER_COLOR;
    }

    static get DEFAULT_UI_BORDER_EDGES() {
        return DEFAULT_UI_BORDER_EDGES;
    }

    static get DEFAULT_UI_BORDER_STYLE() {
        return DEFAULT_UI_BORDER_STYLE;
    }

    static get default() {
        return new UIBorder();
    }

    static get none() {
        return new UIBorder(0, UIColor.transparent);
    }

}

export default UIBorder