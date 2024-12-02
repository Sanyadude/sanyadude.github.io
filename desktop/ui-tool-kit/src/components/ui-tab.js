import { DivElement } from '../../../ui-element-kit/index.js'
import UIListItem from './ui-list-item.js'
import { UIColor } from '../ui-graphic.js'

export class UITab extends UIListItem {

    static get defaultConfig() {
        return {
            index: null,
            activeTextColor: UIColor.white,
            activeBackgroundColor: UIColor.black,
            activeBorderColor: UIColor.black,
            inactiveTextColor: UIColor.black,
            inactiveBackgroundColor: UIColor.white,
            inactiveBorderColor: UIColor.white
        }
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UITab');
    }

    _configure(config) {
        super._configure(config);

        this.activeTextColor = config.activeTextColor;
        this.activeBackgroundColor = config.activeBackgroundColor;
        this.activeBorderColor = config.activeBorderColor;
        this.inactiveTextColor = config.inactiveTextColor;
        this.inactiveBackgroundColor = config.inactiveBackgroundColor;
        this.inactiveBorderColor = config.inactiveBorderColor;

        this.active = false;
    }

    setActive(active = true) {
        this.active = active;
        return this;
    }

    set active(active = true) {
        this._active = active;
        if (this._active) {
            this.backgroundColor = this.activeBackgroundColor;
            this.textColor = this.activeTextColor;
            this.border.color = this.activeBorderColor;
        } else {
            this.backgroundColor = this.inactiveBackgroundColor;
            this.textColor = this.inactiveTextColor;
            this.border.color = this.inactiveBorderColor;
        }
    }

    get active() {
        return this._active;
    }

    setActiveTextColor(uiColor) {
        this.activeTextColor = uiColor;
        return this;
    }

    set activeTextColor(uiColor) {
        this._activeTextColor = uiColor ? uiColor.copy() : null;
    }

    get activeTextColor() {
        if (!this._activeTextColor) return null;
        return this._activeTextColor;
    }

    setActiveBackgroundColor(uiColor) {
        this.activeBackgroundColor = uiColor;
        return this;
    }

    set activeBackgroundColor(uiColor) {
        this._activeBackgroundColor = uiColor ? uiColor.copy() : null;
    }

    get activeBackgroundColor() {
        if (!this._activeBackgroundColor) return null;
        return this._activeBackgroundColor;
    }

    setActiveBorderColor(uiColor) {
        this.activeBorderColor = uiColor;
        return this;
    }

    set activeBorderColor(uiColor) {
        this._activeBorderColor = uiColor ? uiColor.copy() : null;
    }

    get activeBorderColor() {
        if (!this._activeBorderColor) return null;
        return this._activeBorderColor;
    }

    setInactiveTextColor(uiColor) {
        this.inactiveTextColor = uiColor;
        return this;
    }

    set inactiveTextColor(uiColor) {
        this._inactiveTextColor = uiColor ? uiColor.copy() : null;
    }

    get inactiveTextColor() {
        if (!this._inactiveTextColor) return null;
        return this._inactiveTextColor;
    }

    setInactiveBackgroundColor(uiColor) {
        this.inactiveBackgroundColor = uiColor;
        return this;
    }

    set inactiveBackgroundColor(uiColor) {
        this._inactiveBackgroundColor = uiColor ? uiColor.copy() : null;
    }

    get inactiveBackgroundColor() {
        if (!this._inactiveBackgroundColor) return null;
        return this._inactiveBackgroundColor;
    }

    setInactiveBorderColor(uiColor) {
        this.inactiveBorderColor = uiColor;
        return this;
    }

    set inactiveBorderColor(uiColor) {
        this._inactiveBorderColor = uiColor ? uiColor.copy() : null;
    }

    get inactiveBorderColor() {
        if (!this._inactiveBorderColor) return null;
        return this._inactiveBorderColor;
    }

    activate() {
        this.active = true;
        return this;
    }

    deactivate() {
        this.active = false;
        return this;
    }
}

export default UITab