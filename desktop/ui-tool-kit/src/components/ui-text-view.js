import { DivElement } from '../../../ui-element-kit/index.js'
import { UITextFormat } from '../ui-graphic.js'
import UIView from './ui-view.js'

export class UITextView extends UIView {

    static get defaultConfig() {
        return {
            text: 'UITextView',
            textFormat: UITextFormat.default
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UITextView');
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setWhiteSpacePre()

        this.text = config.text;
        this.textFormat = config.textFormat;
    }

    setTextFormat(textFormat = UITextFormat.default) {
        this.textFormat = textFormat;
        return this;
    }

    set textFormat(textFormat) {
        this._textFormat = textFormat;
        if (textFormat == UITextFormat.default) {
            this._uiElement.resetWhiteSpace();
        } else if (textFormat == UITextFormat.preserved) {
            this._uiElement.setWhiteSpacePre();
        }
    }

    get textFormat() {
        return this._textFormat;
    }

    setText(text = '') {
        this.text = text;
        return this;
    }

    set text(text) {
        this._text = text;
        this._uiElement.setText(text);
    }

    get text() {
        return this._text;
    }

}

export default UITextView