import Html from './utils/html.js'
import Utils from './utils/utils.js'
import UIElementFactory from './ui-element-factory.js'

const parameterValidator = Utils.getParameterValidator();

/**
 * UIElementApplication class is for managing UIElements on the page. 
 * It uses root element for containing all other elements that registered in this element application
 */
export class UIElementApplication {
    constructor(config) {
        this._config = Object.assign({
            rootElement: Html.getDefaultRootElement()
        }, config);
        parameterValidator.instance('rootElement', this._config.rootElement, Element);
        this._uiElementFactory = UIElementFactory.createUIElementFactory(this._config.factory);
        this._rootUIElement = this._uiElementFactory.createFromElement(this._config.rootElement, 'RootUIElement');
        this._uiElements = { [this._rootUIElement.getId()]: this._rootUIElement };
    }

    getRootUIElement() {
        return this._rootUIElement;
    }

    getUIElementFactory() {
        return this._uiElementFactory;
    }

    getUIElementById(id) {
        return this._uiElements[id];
    }

    getUIElementByIdentifier(identifier) {
        for (const id in this._uiElements) {
            const uiElement = this._uiElements[id];
            if (uiElement.getIdentifier() == identifier) return uiElement;
        }
        return null;
    }

    register(uiElement, parent) {
        this._uiElements[uiElement.getId()] = uiElement;
        parent = parent || this._rootUIElement;
        if (!parent) return this;
        parent.addChild(uiElement);
        return this;
    }

    destroy(uiElement) {
        delete this._uiElements[uiElement.getId()];
        uiElement.destroyElement();
        return this;
    }

}

export const createUIElementApplication = (config) => new UIElementApplication(config);

export default {
    UIElementApplication,
    createUIElementApplication
}