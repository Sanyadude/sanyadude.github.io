import { DivElement } from '../../../ui-element-kit/index.js'
import { UIState } from '../ui-graphic.js'
import UIView from './ui-view.js'

const DEFAULT_STATE = Object.freeze({
    normal: new UIState(),
    hovered: new UIState()
})

export class UIButton extends UIView {

    static get defaultConfig() {
        return {
            title: 'UIButton',
            onClick: null,
            states: DEFAULT_STATE
        };
    }

    static get defaultState() {
        return DEFAULT_STATE;
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIButton');
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setCursorPointer()
            .onMouseEnter((uiElement, event) => this.state = this.states.hovered)
            .onMouseLeave((uiElement, event) => this.state = this.states.normal)

        this.title = config.title;

        this.states = config.states;
        this.state = config.states.normal;

        this._onClick = config.onClick;
        this._uiElement.onClick((uiElement, event) => {
            if (!this._onClick) return;
            this._onClick(this, uiElement, event)
        });
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

    setOnClick(onClick) {
        this.onClick = onClick;
        return this;
    }

    set onClick(onClick) {
        if (!onClick) return;
        this._onClick = onClick;
    }

    get onClick() {
        return this._onClick;
    }

    setTitle(title = '') {
        this.title = title;
        return this;
    }

    set title(title) {
        if (this.subViews.length > 0) return;
        this._title = title;
        this._uiElement.setText(title);
    }

    get title() {
        return this._title;
    }

    addSubview(uiComponent) {
        this.title = null;
        super.addSubview(uiComponent);
        return this;
    }

    click() {
        this._uiElement.trigger('click');
        return this;
    }
}

export default UIButton