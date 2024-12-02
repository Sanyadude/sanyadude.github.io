import { DivElement } from '../../../ui-element-kit/index.js'
import UIView from './ui-view.js'

export class UIControl extends UIView {

    static get defaultConfig() {
        return {
            text: 'UIControl',
            value: false,
            onValueChanged: null
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIControl');
    }

    _configure(config) {
        super._configure(config);
    }

    setStates(states) {
        this.states = states;
    }

    set states(states) {
        if (!states) return;
        this._states = states;
    }

    get states() {
        return this._states;
    }

    setState(state) {
        this.state = state;
    }

    set state(state) {
        if (!state) return;
        this._state = state;
        this.setConfiguration(this._state.getConfiguration());
    }

    get state() {
        return this._state;
    }

    setOnValueChanged(onValueChanged) {
        this.onValueChanged = onValueChanged;
        return this;
    }

    set onValueChanged(onValueChanged) {
        this._uiElement.off('value-changed', this._onValueChanged);
        if (!onValueChanged) return;
        this._onValueChanged = (uiElement, event) => onValueChanged(this._value, this, uiElement, event);
        this._uiElement.on('value-changed', this._onValueChanged);
    }

    get onValueChanged() {
        return this._onValueChanged;
    }

    setValue(value = true, ignoreNextTrigger = false) {
        this._ignoreNextTrigger = ignoreNextTrigger;
        this.value = value;
        return this;
    }

    set value(value) {
        this._value = value;
        if (!this._ignoreNextTrigger) {
            this._uiElement.trigger('value-changed');
        }
        delete this._ignoreNextTrigger;
    }

    get value() {
        return this._value;
    }

}

export default UIControl