import { UIColor, UIPoint, UIRect, UISizeMode, UIState, UIShadow, UIBorder } from '../../../../ui-tool-kit/index.js'

export class UIToggleConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(0, 0, 44, 30),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: UIColor.white,
            border: new UIBorder(1, new UIColor(.71, .71, .71)),
            borderRadius: 15,
            padding: null,
            margin: null,
            shadow: null,
            font: null,
            textColor: null,
            textAlign: null,
            thumbFrame: new UIRect(0, 0, 26, 26),
            thumbBackgroundColor: UIColor.white,
            thumbBorder: new UIBorder(1, new UIColor(.71, .71, .71)),
            thumbBorderRadius: 15,
            thumbShadow: new UIShadow(UIColor.black, new UIPoint(0, 2), 8, -6),
            states: {
                on: new UIState({
                    backgroundColor: new UIColor(.25, .81, .31),
                    border: new UIBorder(1, new UIColor(.25, .81, .31)),
                    thumbBackgroundColor: UIColor.white,
                    thumbBorder: new UIBorder(1, new UIColor(.25, .81, .31)),
                }),
                off: new UIState({
                    backgroundColor: UIColor.white,
                    border: new UIBorder(1, new UIColor(.71, .71, .71)),
                    thumbBackgroundColor: UIColor.white,
                    thumbBorder: new UIBorder(1, new UIColor(.71, .71, .71)),
                })
            }
        }
    }
}

export default UIToggleConfiguration