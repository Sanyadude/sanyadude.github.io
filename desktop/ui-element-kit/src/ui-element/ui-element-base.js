import { getElementComputedPropertyValue } from '../utils/html.js'
import { camelToKebabCase, parameterValidator, idGenerator } from '../utils/utils.js'
import { UI_ELEMENT_CORE_DATA_ATTR, DEFAULT_UNIT } from '../utils/consts.js'
import UIElementProperty from './ui-element-property.js'

/**
 * UIElementBase class is base wrapper for DOM element and contains methods for manipulating it 
 */
export class UIElementBase {
    /**
     * Creates a new UIElementBase object
     * 
     * @param {string} name - The name of the UIElement
     * @param {Element} element - The element that will be wrapped by the UIElement
     */
    constructor(name, element) {
        parameterValidator.type('name', name, 'string');
        parameterValidator.instance('element', element, Element);
        this._id = idGenerator.next();
        this._name = `${name}`;
        //identifier includes name + id - can be used as key 
        //additional property for saving elements in objects as it can be accessed later via elementContainer.myElement1/elementContainer.someElement20
        //better then elementContainer[1]/elementContainer[20] - makes code more readable  
        this._identifier = `${this._name}${this._id}`;
        this._element = element;
        //parent children of element
        this._parent = null;
        this._children = {};
        //properties and events of element
        this._properties = {};
        this._events = {};
        //initialize
        this._init();
    }
    
    _init() {
        this._setElementAttribute(UI_ELEMENT_CORE_DATA_ATTR, this._identifier);
        return this;
    }

    _getElementSelector() {
        return `[${UI_ELEMENT_CORE_DATA_ATTR}="${this._identifier}"]`;
    }

    _getClassSelector() {
        return `.css-${this._identifier}`;
    }

    _getStyleRuleContent() {
        let styleRuleText = '';
        for (const propertyName in this._properties) {
            styleRuleText += `${camelToKebabCase(propertyName)}:${this._properties[propertyName].toStyle()};`;
        }
        return styleRuleText;
    }

    _getStyleRule() {
        return `${this._getElementSelector()}{${this._getStyleRuleContent()}}`;
    }

    //element style
    _getElementComputedPropertyValue(name) {
        return getElementComputedPropertyValue(this._element, name);
    }

    _setElementStyle(name, value) {
        this._element.style.setProperty(name, value);
    }

    _removeElementStyle(name) {
        this._element.style.removeProperty(name)
    }

    _getElementStyle(name) {
        return this._element.style[name];
    }

    /**
     * Sets style property of the element
     * 
     * @param {string} name - The name of the style property
     * @param {string|number} value - The value of the style property
     * 
     * @returns {this} The modified UIElement object
     */
    setElementStyle(name, value) {
        this._setElementStyle(name, value);
        return this;
    }
    
    /**
     * Removes style property from the element
     * 
     * @param {string} name - The name of the style property
     * 
     * @returns {this} The modified UIElement object
     */
    removeElementStyle(name) {
        this._removeElementStyle(name);
        return this;
    }
    
    /**
     * Gets style property value of the element
     * 
     * @param {string} name - The name of the style property
     * 
     * @returns {string} The style property value
     */
    getElementStyle(name) {
        return this._getElementStyle(name);
    }

    //element attribute
    _setElementAttribute(name, value) {
        this._element.setAttribute(name, value);
    }

    _removeElementAttribute(name) {
        this._element.removeAttribute(name);
    }

    _getElementAttribute(name) {
        return this._element.getAttribute(name);
    }

    /**
     * Sets attribute value of the element
     * 
     * @param {string} name - The name of the attribute
     * @param {string|number} value - The value of the attribute
     * 
     * @returns {this} The modified UIElement object
     */
    setElementAttribute(name, value) {
        this._setElementAttribute(name, value);
        return this;
    }

    /**
     * Removes attribute from the element
     * 
     * @param {string} name - The name of the attribute
     * 
     * @returns {this} The modified UIElement object
     */
    removeElementAttribute(name) {
        this._removeElementAttribute(name);
        return this;
    }

    /**
     * Gets attribute value of the element
     * 
     * @param {string} name - The name of the attribute
     * 
     * @returns {string} The atrribute value
     */
    getElementAttribute(name) {
        return this._getElementAttribute(name);
    }
    
    //element class
    _addElementClass(value) {
        this._element.classList.add(value);
    }

    _removeElementClass(value) {
        this._element.classList.remove(value);
    }

    _getElementClass() {
        return this._element.classList.value;
    }
    //ui element property
    _setProperty(property, value) {
        const prop = new UIElementProperty(property).value(value);
        this._properties[property] = prop;
        this._setElementStyle(property, prop.toStyle());
    }

    _setPropertyInUnits(property, value, units = DEFAULT_UNIT) {
        const prop = new UIElementProperty(property).value(value).unit(units);
        this._properties[property] = prop;
        this._setElementStyle(property, prop.toStyle());
    }

    _getProperty(property) {
        return this._properties[property];
    }

    _resetProperty(property) {
        delete this._properties[property];
        this._removeElementStyle(property);
    }
    //element event
    _addElementEventListener(name, listener, options) {
        if (!this._events[name])
            this._events[name] = [];
        const elementListener = (event) => listener.call(this, this, event);
        this._events[name].push({ listener, elementListener });
        this._element.addEventListener(name, elementListener, options);
    }

    _removeElementEventListener(name, listener, options) {
        if (!this._events[name]) return;
        this._events[name] = this._events[name].filter(listenerMap => {
            if (listenerMap.listener !== listener) return true;
            this._element.removeEventListener(name, listenerMap.elementListener, options);
            return false;
        });
    }

    _removeElementEventListeners(name) {
        if (!this._events[name]) return;
        this._events[name].forEach(listenerMap => this._element.removeEventListener(name, listenerMap.elementListener));
        this._events[name] = [];
    }

    _triggerElementEvent(name, options) {
        const eventTrigger = new Event(name);
        if (options) {
            for (const key in options) {
                eventTrigger[key] = options[key];
            }
        }
        this._element.dispatchEvent(eventTrigger);
    }

    /**
     * Adds an event listener to element
     * 
     * @param {string} name - The name of the event to listen for
     * @param {function} listener - The function to be called when the event is triggered
     * @param {object} options - Options object for removing listener
     * 
     * @returns {this} The modified UIElement object
     */
    on(name, listener, options) {
        this._addElementEventListener(name, listener, options);
        return this;
    }

    /**
     * Removes an event listener from element
     * 
     * @param {string} name - The name of the event to remove the listener from
     * @param {function} listener - The function that was originally added to element
     * @param {object} options - Options object for removing listener
     * 
     * @returns {this} The modified UIElement object
     */
    off(name, listener, options) {
        this._removeElementEventListener(name, listener, options);
        return this;
    }

    /**
     * Triggers an event on element
     * 
     * @param {string} name - The name of the event to trigger
     * @param {object} options - Options object for removing listener
     * 
     * @returns {this} The modified UIElement object
     */
    trigger(name, options) {
        this._triggerElementEvent(name, options);
        return this;
    }

    /**
     * Mounts UIElement to html element
     * 
     * @param {Element} element - The UIElement element would be attached as child to this element 
     * 
     * @returns {this} The modified UIElement object
     */
    mount(element) {
        element.appendChild(this._element);
        return this;
    }

    /**
     * Generates array of elements consists of this element and all it's children
     * 
     * @returns {array} - array of element and all it's children
     */
    toElementsArray() {
        const allElements = [];
        allElements.push(this);
        for (const childKey in this._children) {
            const childElement = this._children[childKey];
            const childElementsArray = childElement.toElementsArray();
            childElementsArray.forEach(childElement => allElements.push(childElement));
        }
        return allElements;
    }

    //ui element parent children
    /**
     * Removes element from its parent and removes element
     * 
     * @returns {this} The modified UIElement object
     */
    destroyElement() {
        if (this._parent)
            this._parent.removeChild(this);
        for (const key in this._children) {
            const child = this._children[key];
            child._parent = null;
        }
        this._element = null;
        return this;
    }

    /**
     * Adds uiElement to children list of this uiElement
     * 
     * @param {UIElementBase} uiElement - The child UIElement that should be added
     * 
     * @returns {this} The modified UIElement object
     */
    addChild(uiElement) {
        if (!uiElement) return this;
        if (uiElement._parent)
            uiElement._parent.removeChild(uiElement);
        uiElement._parent = this;
        this._children[uiElement.getId()] = uiElement;
        this._element.appendChild(uiElement.getElement());
        return this;
    }

    /**
     * Removes uiElement from this uiElement children list
     * 
     * @param {UIElementBase} uiElement - The child UIElement that should be removed 
     * 
     * @returns {this} The modified UIElement object
     */
    removeChild(uiElement) {
        if (!this._element.contains(uiElement.getElement())) return this;
        delete this._children[uiElement.getId()];
        this._element.removeChild(uiElement.getElement());
        uiElement._parent = null;
        return this;
    }

    //ui element
    /**
     * Sets property to UIElement, saves it and applies it to element
     * 
     * @param {UIElementProperty} property - The UIElementProperty object with values and units
     * 
     * @returns {this} The modified UIElement object
     */
    setProperty(property) {
        this._properties[property.name] = property;
        this._setElementStyle(property.name, property.toStyle());
        return this;
    }

    /**
     * Gets the id of the UIElement
     * 
     * @returns {number} The id of the UIElement
     */
    getId() {
        return this._id;
    }

    /**
     * Gets the name of the UIElement
     * 
     * @returns {string} The name of the UIElement
     */
    getName() {
        return this._name;
    }

    /**
     * Gets the identifier of the UIElement which consists of name and id
     * 
     * @returns {string} The identifier of the UIElement
     */
    getIdentifier() {
        return this._identifier;
    }

    /**
     * Gets the element of the UIElement
     * 
     * @returns {Element} Element wrapped by UIElement
     */
    getElement() {
        return this._element;
    }
}

export default UIElementBase