import { DivElement } from '../../../ui-element-kit/index.js'
import { UIDisplayMode } from '../ui-graphic.js'
import UIView from './ui-view.js'

export class UIListView extends UIView {

    static get defaultConfig() {
        return {
            isVertical: false
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIListView');
    }

    _configure(config) {
        super._configure(config);

        this.isVertical = config.isVertical;
    }

    setIsVertical(isVertical = false) {
        this.isVertical = isVertical;
        return this;
    }

    set isVertical(isVertical) {
        this._isVertical = isVertical;
        if (this._isVertical)
            this.displayMode = UIDisplayMode.default
        else
            this.displayMode = UIDisplayMode.flex
    }

    get isVertical() {
        return this._isVertical;
    }

    addSubview(uiComponent) {
        super.addSubview(uiComponent);
        uiComponent.index = this.subViews.length - 1;
        return this;
    }
}

export default UIListView