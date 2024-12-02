import UIElement from '../ui-element/ui-element.js'

export class PathElement extends UIElement {
    static get tag() {
        return 'path';
    }

    setDrawnPath(value) {
        this._setElementAttribute('d', value);
        return this;
    }

    getDrawnPath() {
        return this._getElementAttribute('d');
    }

    resetDrawnPath() {
        this._removeElementAttribute('d');
        return this;
    }

    setFill(value) {
        this._setProperty('fill', value);
        return this;
    }

    getFill() {
        return this._properties['fill']?.toValue()[0];
    }

    resetFill() {
        this._resetProperty('fill');
        return this;
    }

}

export default PathElement