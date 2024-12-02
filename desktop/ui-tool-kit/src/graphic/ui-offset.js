import UIEdgeSet from './ui-edge-set.js'

export const DEFAULT_UI_OFFSET_LENGTH = 1;
export const DEFAULT_UI_OFFSET_EDGES = UIEdgeSet.all;

export class UIOffset {
    constructor(length = UIOffset.DEFAULT_UI_OFFSET_LENGTH, edges = UIOffset.DEFAULT_UI_OFFSET_EDGES) {
        this._length = length;
        this._edges = edges;
    }

    applyProxy() {
        if (!this.proxyApply) return;
        this.proxyApply();
    }

    copy() {
        return new UIOffset(this._length, this._edges);
    }

    setLenght(length = UIOffset.DEFAULT_UI_OFFSET_LENGTH) {
        this.length = length;
        return this;
    }

    set length(length) {
        this._length = length;
        this.applyProxy();
    }

    get length() {
        return this._length;
    }

    setEdges(edges = UIOffset.DEFAULT_UI_OFFSET_EDGES) {
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

    static get DEFAULT_UI_OFFSET_LENGTH() {
        return DEFAULT_UI_OFFSET_LENGTH;
    }

    static get DEFAULT_UI_OFFSET_EDGES() {
        return DEFAULT_UI_OFFSET_EDGES;
    }

    static get default() {
        return new UIOffset();
    }

    static get none() {
        return new UIOffset(0);
    }

}

export default UIOffset