import Html from './utils/html.js'
import UIElements from './ui-elements.js'

/**
 * UIElementFactory class is responsible for creation of UIElements objects
 */
export class UIElementFactory {
    constructor(config) {
        this._config = Object.assign({
            defaultElementName: 'DefaultElementName',
            defaultElementType: UIElements.DivElement
        }, config);
        this._supportedElements = {
            [UIElements.AElement.tag]: UIElements.AElement,
            [UIElements.PElement.tag]: UIElements.PElement,
            [UIElements.DivElement.tag]: UIElements.DivElement,
            [UIElements.SpanElement.tag]: UIElements.SpanElement,
            [UIElements.CanvasElement.tag]: UIElements.CanvasElement,
            [UIElements.ImgElement.tag]: UIElements.ImgElement,
            [UIElements.InputElement.tag]: UIElements.InputElement,
            [UIElements.TextAreaElement.tag]: UIElements.TextAreaElement,
            [UIElements.ButtonElement.tag]: UIElements.ButtonElement,
            [UIElements.IFrameElement.tag]: UIElements.IFrameElement,
            [UIElements.SvgElement.tag]: UIElements.SvgElement,
            [UIElements.PathElement.tag]: UIElements.PathElement
        };
        this._defaultElementType = this._config.defaultElementType;
    }

    create(type, name, element) {
        name = name || this._config.defaultElementName;
        const UIElementType = type || this._defaultElementType;
        const uiElement = UIElementType.create(name, element);
        return uiElement;
    }
    
    createFromElement(element, name) {
        const type = this._supportedElements[element.localName]
            || this._defaultElementType;
        name = name || this._config.defaultElementName;
        return this.create(type, name, element);
    }

    createFromTagName(tag, name) {
        const element = Html.createElement(tag);
        return this.createFromElement(element, name);
    }

    createA(name, element) {
        return this.create(UIElements.AElement, name, element);
    }

    createP(name, element) {
        return this.create(UIElements.PElement, name, element);
    }

    createDiv(name, element) {
        return this.create(UIElements.DivElement, name, element);
    }

    createSpan(name, element) {
        return this.create(UIElements.SpanElement, name, element);
    }

    createCanvas(name, element) {
        return this.create(UIElements.CanvasElement, name, element);
    }

    createImg(name, element) {
        return this.create(UIElements.ImgElement, name, element);
    }

    createInput(name, element) {
        return this.create(UIElements.InputElement, name, element);
    }

    createTextarea(name, element) {
        return this.create(UIElements.TextAreaElement, name, element);
    }

    createIFrame(name, element) {
        return this.create(UIElements.IFrameElement, name, element);
    }

    createSvg(name, element) {
        return this.create(UIElements.SvgElement, name, element);
    }

    createPath(name, element) {
        return this.create(UIElements.PathElement, name, element);
    }

    createStyle(name, element) {
        return this.create(UIElements.StyleElement, name, element);
    }

}

export const createUIElementFactory = (config) => new UIElementFactory(config);

export default {
    UIElementFactory,
    createUIElementFactory
}