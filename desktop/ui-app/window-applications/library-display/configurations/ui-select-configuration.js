import { UIColor, UIFont, UIRect, UISizeMode, UIBorder, UIOffset } from '../../../../ui-tool-kit/index.js'

export class UISelectConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(0, 0, 150, 30),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.default,
            backgroundColor: UIColor.white,
            border: new UIBorder(1, new UIColor(.71, .71, .71)),
            borderRadius: 2,
            padding: new UIOffset(6),
            margin: null,
            shadow: null,
            font: UIFont.default,
            textColor: UIColor.black,
            textAlign: null,
            optionsBackgroundColor: UIColor.white,
            optionsBorder: new UIBorder(1, new UIColor(.71, .71, .71)),
            optionsBorderRadius: 2,
            optionHighlightBackgroundColor: new UIColor(.71, .71, .71),
            optionPadding: new UIOffset(6)
        }
    }
}

export default UISelectConfiguration