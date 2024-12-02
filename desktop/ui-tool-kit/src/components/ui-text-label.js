import { DivElement } from '../../../ui-element-kit/index.js'
import UIView from './ui-view.js'

export class UITextLabel extends UIView {

    static get defaultConfig() {
        return {
            text: 'UITextLabel',
            textTruncate: false
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UITextLabel');
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()
            .setWhiteSpaceNowrap()

        this.text = config.text;
        this.textTruncate = config.textTruncate;
    }

    setTextTruncate(textTruncate = false) {
        this.textTruncate = textTruncate;
        return this;
    }

    set textTruncate(textTruncate) {
        this._textTruncate = textTruncate;
        if (this._textTruncate) {
            this._uiElement
                .setWhiteSpaceNowrap()
                .setTextOverflowEllipsis()
                .setOverflowHidden();
        } else {
            this._uiElement
                .resetWhiteSpace()
                .resetTextOverflow()
                .resetOverflow();
        }
    }

    get textTruncate() {
        return this._textTruncate;
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

export default UITextLabel