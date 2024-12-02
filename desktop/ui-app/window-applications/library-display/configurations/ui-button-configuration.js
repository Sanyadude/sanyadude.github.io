import { UIColor, UIFont, UIRect, UISizeMode, UIState, UIBorder, UIOffset } from '../../../../ui-tool-kit/index.js'

export class UIButtonConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(),
            widthMode: UISizeMode.default,
            heightMode: UISizeMode.default,
            backgroundColor: null,
            border: new UIBorder(1, new UIColor(.06, .52, .98)),
            borderRadius: 2,
            padding: new UIOffset(6),
            margin: null,
            shadow: null,
            font: UIFont.default,
            textColor: new UIColor(.06, .52, .98),
            textAlign: null,
            states: {
                normal: new UIState({
                    backgroundColor: null
                }),
                hovered: new UIState({
                    backgroundColor: new UIColor(.06, .52, .98, .1)
                })
            }
        }
    }
}

export default UIButtonConfiguration