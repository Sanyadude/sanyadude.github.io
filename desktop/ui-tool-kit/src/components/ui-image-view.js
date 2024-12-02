import { DivElement, ImgElement } from '../../../ui-element-kit/index.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'
import { UIDisplayMode } from '../ui-graphic.js'
import UIView from './ui-view.js'

export class UIImageView extends UIView {

    static get defaultConfig() {
        return {
            image: null,
            displayMode: UIDisplayMode.flex
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIImageView');

        this._imgElement = ImgElement.create('UIImageViewImg');
        this._uiElement.addChild(this._imgElement);
    }

    _configure(config) {
        super._configure(config);
        
        this._imgElement
            .setDisplayInlineBlock()
            .setVerticalAlignMiddle()
            .setFullSize()

        this.image = config.image;
    }

    getImgElement() {
        return this._imgElement;
    }

    setImage(uiImage) {
        this.image = uiImage;
        return this;
    }

    set image(uiImage) {
        this._imageProxy = new UIPropertyProxy(uiImage?.copy(), this, (propery, context) => {
            if (propery) 
                context._imgElement.setSrc(propery.src).setAlt(propery.title);
            else
                context._imgElement.resetSrc().resetAlt();
        });
        this._imageProxy.apply();
    }

    get image() {
        return this._imageProxy?.property;
    }

}
export default UIImageView