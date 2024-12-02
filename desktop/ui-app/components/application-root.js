import EventEmitter from '../../event-emmiter/event-emmiter.js'
import { DivElement, StyleElement } from '../../ui-element-kit/index.js'
import { DESKTOP_MIN_WIDTH } from '../config/desktop-config.js'

export class ApplicationRoot {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.rootUIElement = DivElement.create('RootElement', this.rootElement);
        this.rootStyle = StyleElement.create('RootStyle');

        this.width = null;
        this.height = null;

        this._init();
    }

    getRootElementSize() {
        return { 
            width: this.rootElement.clientWidth >= DESKTOP_MIN_WIDTH 
                ? this.rootElement.clientWidth 
                : DESKTOP_MIN_WIDTH, 
            height: this.rootElement.clientHeight 
        };
    }

    _init() {
        this.rootUIElement.setFullSize().setPositionRelative().setOverflowHidden().addChild(this.rootStyle);
        this.rootStyle
            .addCssRuleDeclaration('body', 'margin', '0')
            .addCssRuleDeclaration('body', 'width', '100vw')
            .addCssRuleDeclaration('body', 'height', '100vh')
            .updateCss()

        window.addEventListener('resize', () => {
            const rootElementSize = this.getRootElementSize();
            this.width = rootElementSize.width;
            this.height = rootElementSize.height;
            EventEmitter.emit('desktop-resize', rootElementSize);
        });

        const rootElementSize = this.getRootElementSize();
        this.width = rootElementSize.width;
        this.height = rootElementSize.height;
    }

    addComponent(uiComponent) {
        this.rootUIElement.addChild(uiComponent.getUIElement());
    }

    removeComponent(uiComponent) {
        this.rootUIElement.removeChild(uiComponent.getUIElement());
    }

    generateStyles() {
        this.appStyle = StyleElement.create('AppStyle');
        this.rootUIElement.addChild(this.appStyle);
        const elementsArray = this.rootUIElement.toElementsArray();
        let appStyles = '';
        elementsArray.forEach(element => {
            appStyles += element._getStyleRule();
            element._removeElementAttribute('style');
        })
        this.appStyle.setText(appStyles);
    }

}

export default ApplicationRoot