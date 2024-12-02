import UIElement from '../ui-element/ui-element.js'

export class CanvasElement extends UIElement {
    static get tag() {
        return 'canvas';
    }

    _init() {
        super._init();
        this._context = null;
    }

    getContextByType(contextType) {
        const context = this._element.getContext(contextType);
        if (!context) return null;
        this._context = context;
        return this._context;
    }

    getContext() {
        return this._context;
    }

    getContext2d() {
        return this.getContextByType('2d');
    }

    getContextWebGL() {
        return this.getContextByType('webgl');
    }

    getContextWebGL2() {
        return this.getContextByType('webgl2');
    }

    getContextBitmapRenderer() {
        return this.getContextByType('bitmaprenderer');
    }
}

export default CanvasElement