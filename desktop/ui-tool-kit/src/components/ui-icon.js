import { DivElement, SvgElement, PathElement } from '../../../ui-element-kit/index.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'
import { UIRect, UIFont, UISizeMode} from '../ui-graphic.js'
import UIView from './ui-view.js'

export class UIIcon extends UIView {

    static get defaultConfig() {
        return {
            frame: new UIRect(0, 0, UIFont.DEFAULT_UI_FONT_SIZE, UIFont.DEFAULT_UI_FONT_SIZE),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            iconColor: null,
            svg: null
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIIcon');

        this._svgElement = SvgElement.create('UIIconSvg');
        this._uiElement.addChild(this._svgElement);

        this._pathElement = PathElement.create('UIIconSvgPath');
        this._svgElement.addChild(this._pathElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
        this._svgElement
            .setDisplayInlineBlock()
            .setFullSize()

        this.iconColor = config.iconColor;
        this.svg = config.svg;
    }

    getSvgElement() {
        return this._svgElement;
    }

    setSvg(uiSvg) {
        this.svg = uiSvg;
        return this;
    }

    set svg(uiSvg) {
        this._svgProxy = new UIPropertyProxy(uiSvg?.copy(), this, (propery, context) => {
            if (propery && propery.viewBox) {
                context._svgElement.setViewBox(`${propery.viewBox.x} ${propery.viewBox.y} ${propery.viewBox.width} ${propery.viewBox.height}`);
                context._pathElement.setDrawnPath(propery.path);
            } else {
                context._svgElement.resetViewBox();
                context._pathElement.resetDrawnPath();
            }
        });
        this._svgProxy.apply();
    }

    get svg() {
        return this._svgProxy?.property;
    }

    setIconColor(uiColor) {
        this.iconColor = uiColor;
        return this;
    }

    set iconColor(uiColor) {
        this._iconColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => {
            if (propery)
                context._pathElement.setFill(propery.rgba());
            else
                context._pathElement.resetFill();
        });
        this._iconColorProxy.apply();
    }

    get iconColor() {
        return this._iconColorProxy?.property;
    }
}

export default UIIcon