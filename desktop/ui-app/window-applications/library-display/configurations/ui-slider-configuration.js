import { UIColor, UIPoint, UIRect, UIEdgeSet, UISizeMode, UIShadow, UIBorder, UIOffset } from '../../../../ui-tool-kit/index.js'

export class UISliderConfiguration {
    static get IOS() {
        return {
            frame: new UIRect(0, 0, 150, 24),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: null,
            border: null,
            borderRadius: 0,
            padding: new UIOffset(10, UIEdgeSet.vertical),
            margin: null,
            shadow: null,
            font: null,
            textColor: null,
            textAlign: null,
            trackBackgroundColor: new UIColor(.71, .71, .71),
            trackBorder: null,
            trackBorderRadius: 2,
            trackFillBackgroundColor: new UIColor(.06, .52, .98),
            thumbFrame: new UIRect(0, 0, 24, 24),
            thumbBackgroundColor: UIColor.white,
            thumbBorder: new UIBorder(1, new UIColor(.9, .9, .9)),
            thumbBorderRadius: 12,
            thumbShadow: new UIShadow(UIColor.black, new UIPoint(0, 2), 8, -6)
        }
    }
}

export default UISliderConfiguration