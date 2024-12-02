import { DivElement } from '../../../ui-element-kit/index.js'
import UIView from './ui-view.js'
import { UIRect, UIFont, UISizeMode, UIColor, UIBorder } from '../ui-graphic.js'
import { setBackgroundColor, setBorderRadius, setBorder } from '../ui-properties.js'
import UIPropertyProxy from '../graphic/ui-property-proxy.js'

const PROGRESS_BORDER_WIDTH = UIFont.DEFAULT_UI_FONT_SIZE / 8;
const PROGRESS_WIDTH = UIFont.DEFAULT_UI_FONT_SIZE * 8;
const PROGRESS_HEIGHT = UIFont.DEFAULT_UI_FONT_SIZE;

export class UIProgress extends UIView {

    static get defaultConfig() {
        return {
            frame: new UIRect(0, 0, PROGRESS_WIDTH, PROGRESS_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            trackBackgroundColor: null,
            trackBorder: new UIBorder(PROGRESS_BORDER_WIDTH, UIColor.black),
            trackBorderRadius: 0,
            trackFillBackgroundColor: UIColor.black,
            progress: 0,
            onProgress: null
        };
    }

    _initElements(config) {
        this._uiElement = DivElement.create('UIProgress');

        this._progressTrackElement = DivElement.create('UIProgressTrack');
        this._uiElement.addChild(this._progressTrackElement);

        this._progressTrackFillElement = DivElement.create('UIProgressTrackFill');
        this._progressTrackElement.addChild(this._progressTrackFillElement);
    }

    _configure(config) {
        super._configure(config);

        this._uiElement
            .setVerticalAlignMiddle()

        this._progressTrackElement
            .setBoxSizingBorderBox()
            .setFullSize()
            .setOverflowHidden()
        this._progressTrackFillElement
            .setFullHeight()
            .setWidthPercentage(0)

        this.trackBackgroundColor = config.trackBackgroundColor;
        this.trackBorder = config.trackBorder;
        this.trackBorderRadius = config.trackBorderRadius;

        this.trackFillBackgroundColor = config.trackFillBackgroundColor;

        this.progress = config.progress;
        this._onProgress = config.onProgress;
        this._progressTrackFillElement.on('progress', (uiElement, event) => {
            if (!this._onProgress) return;
            this._onProgress(this._progress, this, uiElement, event)
        });
    }

    setOnProgress(onProgress) {
        this.onProgress = onProgress;
        return this;
    }

    set onProgress(onProgress) {
        if (!onProgress) return;
        this._onProgress = onProgress;
    }

    get onProgress() {
        return this._onProgress;
    }

    setProgress(progress = 0) {
        this.progress = progress;
        return this;
    }

    set progress(progress = 0) {
        this._progress = Math.min(Math.max(progress, 0), 100);
        this._progressTrackFillElement.setWidthPercentage(this._progress).trigger('progress');
    }

    get progress() {
        return this._progress;
    }

    //track
    setTrackBackgroundColor(uiColor) {
        this.trackBackgroundColor = uiColor;
        return this;
    }

    set trackBackgroundColor(uiColor) {
        this._trackBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._progressTrackElement));
        this._trackBackgroundColorProxy.apply();
    }

    get trackBackgroundColor() {
        return this._trackBackgroundColorProxy?.property;
    }

    setTrackBorder(uiBorder = UIBorder.default) {
        this.trackBorder = uiBorder;
        return this;
    }

    set trackBorder(uiBorder) {
        this._trackBorderProxy = new UIPropertyProxy(uiBorder?.copy(), this, (propery, context) => setBorder(propery, context._progressTrackElement));
        this._trackBorderProxy.apply();
    }

    get trackBorder() {
        return this._trackBorderProxy?.property;
    }

    setTrackBorderRadius(trackBorderRadius = 0) {
        this.trackBorderRadius = trackBorderRadius;
        return this;
    }

    set trackBorderRadius(trackBorderRadius) {
        this._trackBorderRadius = trackBorderRadius;
        setBorderRadius(this._trackBorderRadius, this._progressTrackElement);
    }

    get trackBorderRadius() {
        return this._trackBorderRadius;
    }

    setTrackFillBackgroundColor(uiColor = UIColor.black) {
        this.trackFillBackgroundColor = uiColor;
        return this;
    }

    set trackFillBackgroundColor(uiColor) {
        this._trackFillBackgroundColorProxy = new UIPropertyProxy(uiColor?.copy(), this, (propery, context) => setBackgroundColor(propery, context._progressTrackFillElement));
        this._trackFillBackgroundColorProxy.apply();
    }

    get trackFillBackgroundColor() {
        return this._trackFillBackgroundColorProxy?.property;
    }

}

export default UIProgress