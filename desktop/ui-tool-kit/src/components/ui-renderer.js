import { DivElement, CanvasElement } from '../../../ui-element-kit/index.js'
import UIView from './ui-view.js'
import { UIRendererContext, UISizeMode } from '../ui-graphic.js'
import { setFrame } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

const setCanvasWidth = (view) => {
    const width = view.frame.width - (view.border ? view.border.width * 2 : 0);
    view._canvasElement.setElementAttribute('width', width);
}

const setCanvasHeight = (view) => {
    const height = view.frame.height - (view.border ? view.border.width * 2 : 0);
    view._canvasElement.setElementAttribute('height', height);
}

const getCanvasImageData = (view) => {
    return view._context?.getImageData(0, 0, view._canvasElement.getElement().width, view._canvasElement.getElement().height);
}

const setCanvasImageData = (view, imageData) => {
    view._context?.putImageData(imageData, 0, 0);
}

const resizeCanvas = (view) => {
    const canvasImageData = getCanvasImageData(view);
    setCanvasWidth(view);
    setCanvasHeight(view);
    setCanvasImageData(view, canvasImageData);
}

export class UIRenderer extends UIView {

    static get defaultConfig() {
        return {
            contextType: UIRendererContext.context2d
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIRenderer');

        this._canvasElement = CanvasElement.create('UIRendererCanvas');
        this._uiElement.addChild(this._canvasElement);
    }

    _configure(config) {
        super._configure(config);

        this._canvasElement
            .setDisplayInlineBlock()
            .setVerticalAlignMiddle()

        this._context = this._canvasElement.getContextByType(config.contextType);
    }

    getCanvasElement() {
        return this._canvasElement;
    }

    get context() {
        return this._context;
    }

    set frame(uiRect) {
        this._frameProxy = new UIPropertyProxy(uiRect?.copy(), this, (propery, context) => {
            setFrame(context, context._uiElement);
            resizeCanvas(context);
        });
        this._frameProxy.apply();
    }

    get frame() {
        return super.frame;
    }

    set widthMode(widthMode) {
        this._widthMode = widthMode;
        switch (widthMode) {
            case UISizeMode.fullSize:
                this._uiElement.setFullWidth();
                break;
            case UISizeMode.frameSize:
                this._uiElement.setWidth(this.frame.width);
                break;
            case UISizeMode.default:
                this._uiElement.resetWidth();
                break;
        }
        resizeCanvas(this);
    }

    get widthMode() {
        return this._widthMode;
    }

    set heightMode(heightMode) {
        this._heightMode = heightMode;
        switch (heightMode) {
            case UISizeMode.fullSize:
                this._uiElement.setFullHeight();
                break;
            case UISizeMode.frameSize:
                this._uiElement.setHeight(this.frame.height);
                break;
            case UISizeMode.default:
                this._uiElement.resetHeight();
                break;
        }
        resizeCanvas(this);
    }

    get heightMode() {
        return this._heightMode;
    }

    set border(uiBorder) {
        super.border = uiBorder;
        resizeCanvas(this);
    }

    get border() {
        return super.border;
    }

    clear() {
        setCanvasWidth(this);
        setCanvasHeight(this);
    }

}
export default UIRenderer