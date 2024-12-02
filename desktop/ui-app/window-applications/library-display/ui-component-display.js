import { UIColor, UIFont, UIEdgeSet, UISizeMode, UITextLabel, UITextView, UIView, UIOffset } from '../../../ui-tool-kit/index.js'
import SystemUIFont from '../../config/fonts.js';

const CLASS_NAME_TITLE_FONT = new UIFont(32, 32, 'system-ui');
const CLASS_NAME_FONT = UIFont.fromFamily('monospace');

export class UIComponentDisplay {
    constructor(name, description, uiComponent) {
        this.name = name;
        this.description = description;
        this.uiComponent = uiComponent;
        this._init();
    }

    _init() {
        this.container = new UIView({
            widthMode: UISizeMode.fullSize,
            padding: new UIOffset(10)
        })
        this.title = new UITextLabel({
            widthMode: UISizeMode.fullSize,
            padding: new UIOffset(10),
            paddingEdges: UIEdgeSet.vertical,
            text: this.name,
            font: CLASS_NAME_TITLE_FONT
        })
        this.nameContainer = new UIView({
            widthMode: UISizeMode.fullSize,
            padding: new UIOffset(20),
            borderRadius: 5,
            backgroundColor: new UIColor(.95, .95, .95)
        })
        this.classLabel = new UITextLabel({
            text: `class`,
            font: CLASS_NAME_FONT,
            textColor: new UIColor(.3, .45, .7)
        })
        this.classLabel
            .getUIElement()
            .setWhiteSpacePre()
        this.nameLabel = new UITextLabel({
            text: ` ${this.uiComponent.constructor.name}`,
            font: CLASS_NAME_FONT,
            textColor: new UIColor(.4, .7, .4)
        })
        this.nameLabel
            .getUIElement()
            .setWhiteSpacePre()
        this.descriptionView = new UITextView({
            widthMode: UISizeMode.fullSize,
            text: this.description,
            padding: new UIOffset(20),
            borderRadius: 5,
            backgroundColor: new UIColor(.95, .95, .95),
            font: SystemUIFont.xLarge
        })
        this.componentContainer = new UIView({
            widthMode: UISizeMode.fullSize,
            padding: new UIOffset(20)
        })

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