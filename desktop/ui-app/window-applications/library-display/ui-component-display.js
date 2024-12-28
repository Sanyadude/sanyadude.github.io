import { UIColor, UIFont, UIEdgeSet, UISizeMode, UITextLabel, UITextView, UIView, UIOffset } from '../../../ui-tool-kit/index.js'
import SystemUIFont from '../../config/fonts.js'
import Tokenizer from './tokenizer.js'

const CLASS_NAME_TITLE_FONT = new UIFont(32, 32, 'system-ui');
const CLASS_NAME_FONT = UIFont.fromFamily('monospace');

export class UIComponentDisplay {
    constructor(name, description, uiComponent, code) {
        this.name = name;
        this.description = description;
        this.uiComponent = uiComponent;
        this.code = code;
        this._init();
    }

    _init() {
        this.container = new UIView({
            widthMode: UISizeMode.fullSize,
            heightMode: UISizeMode.default,
            padding: new UIOffset(10)
        })
        this.title = new UITextLabel({
            widthMode: UISizeMode.fullSize,
            heightMode: UISizeMode.default,
            padding: new UIOffset(10),
            paddingEdges: UIEdgeSet.vertical,
            text: this.name,
            font: CLASS_NAME_TITLE_FONT
        })
        this.nameContainer = new UIView({
            widthMode: UISizeMode.fullSize,
            heightMode: UISizeMode.default,
            padding: new UIOffset(20),
            borderRadius: 5,
            backgroundColor: new UIColor(.15, .15, .15)
        })
        this.classLabel = new UITextLabel({
            widthMode: UISizeMode.default,
            heightMode: UISizeMode.default,
            text: `class`,
            font: CLASS_NAME_FONT,
            textColor: new UIColor(.3, .45, .7)
        })
        this.classLabel
            .getUIElement()
            .setWhiteSpacePre()
        this.nameLabel = new UITextLabel({
            widthMode: UISizeMode.default,
            heightMode: UISizeMode.default,
            text: ` ${this.uiComponent.constructor.name}`,
            font: CLASS_NAME_FONT,
            textColor: new UIColor(.4, .7, .4)
        })
        this.nameLabel
            .getUIElement()
            .setWhiteSpacePre()
        this.descriptionView = new UITextView({
            widthMode: UISizeMode.fullSize,
            heightMode: UISizeMode.default,
            text: this.description,
            padding: new UIOffset(20),
            borderRadius: 5,
            backgroundColor: new UIColor(.95, .95, .95),
            font: SystemUIFont.xLarge
        })
        this.componentContainer = new UIView({
            widthMode: UISizeMode.fullSize,
            heightMode: UISizeMode.default,
            padding: new UIOffset(20)
        })
        this.codeContainer = new UIView({
            widthMode: UISizeMode.fullSize,
            heightMode: UISizeMode.default,
            padding: new UIOffset(20),
            borderRadius: 5,
            backgroundColor: new UIColor(.15, .15, .15)
        })
        const tokenizer = new Tokenizer();
        const codeHtml = tokenizer.toHTML(tokenizer.tokenize(this.code));
        this.codeContainer.getUIElement().setHtml(codeHtml);

        this.container.addSubview(this.title);
        this.container.addSubview(this.nameContainer);
        
        this.nameContainer.addSubview(this.classLabel);
        this.nameContainer.addSubview(this.nameLabel);

        this.container.addSubview(this.componentContainer);
        
        this.componentContainer.addSubview(this.uiComponent);

        this.container.addSubview(this.descriptionView);
    }
}

export default UIComponentDisplay