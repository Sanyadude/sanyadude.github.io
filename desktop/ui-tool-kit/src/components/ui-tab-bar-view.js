import { DivElement } from '../../../ui-element-kit/index.js'
import UIListView from './ui-list-view.js'

export class UITabBarView extends UIListView {

    static get defaultConfig() {
        return {}
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UITabBarView');
    }

    _configure(config) {
        super._configure(config);

        this.active = null;
    }

    addSubview(uiComponent) {
        super.addSubview(uiComponent);
        const uiElement = uiComponent.getUIElement();
        uiElement.onClick(() => this.activate(uiComponent.index))
        if (!this.active)
            this.activate(0);
        return this;
    }

    activate(index) {
        if (!this.subViews[index]) return;
        if (this.active !== null)
            this.subViews[this.active].deactivate();
        this.subViews[index].activate();
        this.active = index;
    }
}

export default UITabBarView