import { UIColor, UIFont, UIRect, UIEdgeSet, UISizeMode, UIBorder, UIOffset } from '../../../../ui-tool-kit/index.js'

export class UIStepperConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(),
            widthMode: UISizeMode.default,
            heightMode: UISizeMode.default,
            backgroundColor: null,
            border: new UIBorder(1, new UIColor(.06, .52, .98)),
            borderRadius: 2,
            padding: null,
            margin: null,
            shadow: null,
            font: new UIFont(24, 28, 'monospace'),
            textColor: new UIColor(.06, .52, .98),
            textAlign: null,
            innerPadding: new UIOffset(10, UIEdgeSet.horizontal)
        }
    }
}

export default UIStepperConfiguration