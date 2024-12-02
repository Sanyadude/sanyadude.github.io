import { UIColor, UIFont, UIRect, UISizeMode, UIBorder, UIOffset } from '../../../../ui-tool-kit/index.js'

export class UITextFieldConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(),
            widthMode: UISizeMode.default,
            heightMode: UISizeMode.default,
            backgroundColor: null,
            border: new UIBorder(1, new UIColor(.71, .71, .71)),
            borderRadius: 2,
            padding: new UIOffset(6),
            margin: null,
            shadow: null,
            font: UIFont.default,
            textColor: UIColor.black,
            textAlign: null
        }
    }
}

export default UITextFieldConfiguration