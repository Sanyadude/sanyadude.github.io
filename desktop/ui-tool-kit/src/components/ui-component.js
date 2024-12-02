import { DivElement } from '../../../ui-element-kit/index.js'

const getDefaultConfigs = (constructor) => {
    let currentConstructor = constructor;
    const configs = [];
    do {
        configs.push(currentConstructor.defaultConfig);
        currentConstructor = currentConstructor.prototype.__proto__.constructor;
    } while (currentConstructor.name != 'Object');
    let defaultConfig = {};
    configs.reverse().forEach(config => {
        defaultConfig = Object.assign(defaultConfig, config);
    });
    return defaultConfig;
}

export class UIComponent {
    constructor(config) {
        this._config = Object.assign(getDefaultConfigs(this.constructor), config);
        this._uiElement = null;
        this._init();
    }

    static get defaultConfig() {
        return {};
    }
    
    _initElements(config) {
        this._uiElement = DivElement.create('UIComponent');
        return this;
    }

    _configure(config) {
        return this;
    }

    _init() {
        this._initElements(this._config);
        this._configure(this._config);
        delete this._config;
        return this;
    }

    setConfiguration(uiConfiguration) {
        if (typeof uiConfiguration !== 'object') return;
        for (const property in uiConfiguration) {
            const value = uiConfiguration[property];
            this[property] = value;
        }
    }

    getUIElement() {
        return this._uiElement;
    }

    getUIClientRect() {
        return this._uiElement.getBoundingClientRect();
    }
}

export default UIComponent