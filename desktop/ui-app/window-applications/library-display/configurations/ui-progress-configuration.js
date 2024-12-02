import { UIColor, UIRect, UISizeMode } from '../../../../ui-tool-kit/index.js'

export class UIProgressConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(0, 0, 150, 4),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: null,
            border: null,
            borderRadius: 0,
            padding: null,
            margin: null,
            shadow: null,
            font: null,
            textColor: null,
            textAlign: null,
            trackBackgroundColor: new UIColor(.71, .71, .71),
            trackBorder: null,
            trackBorderRadius: 2,
            trackFillBackgroundColor: new UIColor(.06, .52, .98)
        }
    }
}

export default UIProgressConfiguration