import { DivElement } from '../../../ui-element-kit/index.js'
import UIView from './ui-view.js'

export class UIListItem extends UIView {

    static get defaultConfig() {
        return {
            index: null
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIListItem');
    }

    _configure(config) {
        super._configure(config);

        this.index = config.index;

        this._uiElement
            .setDisplayBlock()
    }
}

export default UIListItem