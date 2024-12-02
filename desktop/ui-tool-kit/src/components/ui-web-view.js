import { DivElement, IFrameElement } from '../../../ui-element-kit/index.js'
import UIView from './ui-view.js'

export class UIWebView extends UIView {

    static get defaultConfig() {
        return {
            url: ''
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIWebView');

        this._iframeElement = IFrameElement.create('UIWebViewIFrame');
        this._uiElement.addChild(this._iframeElement);
    }

    getIFrameElement() {
        return this._iframeElement;
    }

    _configure(config) {
        super._configure(config);

        this._iframeElement
            .setDisplayInlineBlock()
            .setVerticalAlignMiddle()
            .setFullSize()
            .setBorder(0)

        this.url = config.url;
    }

    setUrl(url = '') {
        this.url = url;
        return this;
    }

    set url(url) {
        this._url = url;
        this._iframeElement.setSrc(url);
    }

    get url() {
        return this._url;
    }

    reload() {
        this.url = this._url;
        return this;
    }
}

export default UIWebView