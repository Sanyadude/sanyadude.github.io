export const getDefaultRootElement = () => document.body;

export const getElementComputedPropertyValue = (element, name) => window.getComputedStyle(element).getPropertyValue(name);

export const createElement = (tag = 'div') => {
    if (['svg', 'path'].includes(tag)) return document.createElementNS('http://www.w3.org/2000/svg', tag);
    return document.createElement(tag);
}

export const addGlobalEventListener = (type, listener) => document.addEventListener(type, listener);
export const removeGlobalEventListener = (type, listener) => document.removeEventListener(type, listener);

export const Html = {
    getDefaultRootElement,
    getElementComputedPropertyValue,
    createElement,
    addGlobalEventListener,
    removeGlobalEventListener
}

export default Html