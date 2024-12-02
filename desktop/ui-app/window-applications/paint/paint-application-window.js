import ApplicationWindow from '../../components/application-components/application-window.js'
import { UIBorder, UIColor, UIRect, UIRenderer, UIRendererContext, UISizeMode, UITextLabel, UIView } from '../../../ui-tool-kit/index.js'
import { SystemUIFont } from '../../config/fonts.js'

const PAINT_DEFAULT_SPREAD = 1;
const PAINT_DEFAULT_MIN_SPREAD = 1;
const CONFIG_PANEL_COLOR_CONTAINER_HEIGHT = 25;
const CONFIG_PANEL_CURRENT_STATE_CONTAINER_HEIGHT = 25;
const CONFIG_PANEL_HEIGHT = CONFIG_PANEL_COLOR_CONTAINER_HEIGHT + CONFIG_PANEL_CURRENT_STATE_CONTAINER_HEIGHT;
const CONFIG_PANEL_COLOR_CONTAINER_COLOR_BORDER_WIDTH = 1;
const CONFIG_FONT = SystemUIFont.defaultWith(CONFIG_PANEL_CURRENT_STATE_CONTAINER_HEIGHT);
const CONFIG_COLORS = [
    new UIColor(0, 0, 0),               // Black
    new UIColor(1, 1, 1),               // White
    new UIColor(1, 0, 0),               // Red
    new UIColor(0, 0, 1),               // Blue
    new UIColor(0, 1, 0),               // Green
    new UIColor(1, 1, 0),               // Yellow
    new UIColor(0.647, 0.165, 0.165),   // Brown
    new UIColor(1, 0.647, 0),           // Orange
    new UIColor(1, 0.753, 0.796),       // Pink
    new UIColor(0.502, 0, 0.502),       // Purple
    new UIColor(0.502, 0.502, 0.502),   // Gray
    new UIColor(0.678, 0.847, 0.902),   // Light Blue
    new UIColor(0.565, 0.933, 0.565),   // Light Green
    new UIColor(1, 1, 0.878),           // Light Yellow
    new UIColor(0.871, 0.722, 0.529),   // Light Brown
    new UIColor(1, 0.855, 0.725),       // Light Orange
    new UIColor(1, 0.714, 0.757),       // Light Pink
    new UIColor(0.867, 0.627, 0.867),   // Light Purple
    new UIColor(0.663, 0.663, 0.663),   // Dark Gray
    new UIColor(0, 1, 1)                // Cyan
];
const PAINT_DEFAULT_COLOR = CONFIG_COLORS[0];

const fillColorsConfig = (context) => {
    CONFIG_COLORS.forEach(color => {
        const colorView = new UIView({
            frame: new UIRect(0, 0, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            border: new UIBorder(CONFIG_PANEL_COLOR_CONTAINER_COLOR_BORDER_WIDTH, UIColor.black),
            backgroundColor: color
        })
        colorView
            .getUIElement()
            .setCursorPointer()
            .onMouseUp(() => context.setColor(color))
        context.configColorContainer.addSubview(colorView);
    })
}

const imageDataUrlSaveToImage = (dataUrl, fileName) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
}

const moveFromToByStep = (xFrom, yFrom, xTo, yTo, stepCallback) => {
    const xDiff = xFrom - xTo;
    const yDiff = yFrom - yTo;

    if (xDiff == 0 && yDiff == 0) {
        stepCallback(xFrom, yFrom);
        return;
    }
    
    const xModifier = xDiff < 0 ? 1 : -1;
    const yModifier = yDiff < 0 ? 1 : -1;

    const xDiffAbs = Math.abs(xDiff);
    const yDiffAbs = Math.abs(yDiff);
    const xDiffIsLarger = xDiffAbs > yDiffAbs;

    const longerEdgeLength = Math.max(xDiffAbs, yDiffAbs);
    const shorterEdgeLength = Math.min(xDiffAbs, yDiffAbs);
    const slope = (shorterEdgeLength === 0 || longerEdgeLength === 0) ? 0 : (shorterEdgeLength / longerEdgeLength);

    let shorterEdgeIncrease;
    for (let i = 1; i <= longerEdgeLength; i++) {
        shorterEdgeIncrease = Math.round(i * slope);
        let yIncrease, xIncrease;
        if (xDiffIsLarger) {
            xIncrease = i;
            yIncrease = shorterEdgeIncrease;
        } else {
            yIncrease = i;
            xIncrease = shorterEdgeIncrease;
        }
        const currentX = xFrom + (xIncrease * xModifier);
        const currentY = yFrom + (yIncrease * yModifier);
        stepCallback(currentX, currentY);
    }
}

const spread = (context, x, y, config) => {
    const width = 1;
    const height = 1;
    if (config.spread <= PAINT_DEFAULT_MIN_SPREAD) {
        context.fillRect(x, y, width, height);
        return;
    }
    if (config.spread >= 5) {
        context.beginPath();
        context.arc(x, y, config.spread, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        return;
    }
    for (let deltaX = -config.spread; deltaX <= config.spread; deltaX++) {
        for (let deltaY = -config.spread; deltaY <= config.spread; deltaY++) {
            if (config.spread - 1 < Math.sqrt(deltaY * deltaY + deltaX * deltaX)) continue;
            context.fillRect(x + deltaX, y + deltaY, width, height);
        }
    }
}
const drawBetweenCoords = (context, prevCoords, currentCoords, config) => {
    context.fillStyle = config.color.rgb();
    moveFromToByStep(prevCoords.x, prevCoords.y, currentCoords.x, currentCoords.y, (x, y) => spread(context, x, y, config))
}

const resize = (context) => {
    context.container.frame = new UIRect(0, 0, context.window.body.frame.width, context.window.body.frame.height);
    context.configContainer.frame = new UIRect(0, 0, context.window.body.frame.width, CONFIG_PANEL_HEIGHT);
    context.configColorContainer.frame = new UIRect(0, 0, context.window.body.frame.width, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT)
    context.configCurrentStateContainer.frame = new UIRect(0, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT, context.window.body.frame.width, CONFIG_PANEL_CURRENT_STATE_CONTAINER_HEIGHT);
    context.renderer.frame = new UIRect(0, CONFIG_PANEL_HEIGHT, context.window.body.frame.width, context.window.body.frame.height - CONFIG_PANEL_HEIGHT);
}

export class PaintApplicationWindow extends ApplicationWindow {
    _init() {
        super._init();
        this._config = {
            color: PAINT_DEFAULT_COLOR,
            spread: PAINT_DEFAULT_SPREAD
        }
        this._mouseMoving = false;
        this._prevMouseCoords = false;

        this.container = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, this.window.body.frame.height),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })

        this.configContainer = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, CONFIG_PANEL_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.configColorContainer = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.configColorContainer
            .getUIElement()
            .setTextWrapNowrap()
        this.configCurrentStateContainer = new UIView({
            frame: new UIRect(0, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT, this.window.body.frame.width, CONFIG_PANEL_CURRENT_STATE_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })
        this.configCurrentStateColorName = new UITextLabel({
            text: 'Color:',
            font: CONFIG_FONT
        })
        this.configCurrentStateColorName
            .getUIElement()
            .setVerticalAlignTop()
        this.configCurrentStateColor = new UIView({
            frame: new UIRect(0, 0, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT, CONFIG_PANEL_COLOR_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            backgroundColor: PAINT_DEFAULT_COLOR,
            border: new UIBorder(CONFIG_PANEL_COLOR_CONTAINER_COLOR_BORDER_WIDTH, UIColor.black)
        })
        this.configCurrentStateSpread = new UITextLabel({
            text: `Spread:${PAINT_DEFAULT_SPREAD}`,
            font: CONFIG_FONT
        })
        this.configCurrentStateSpread
            .getUIElement()
            .setVerticalAlignTop()
        this.configContainer
            .getUIElement()
            .setUserSelectNone()

        this.renderer = new UIRenderer({
            frame: new UIRect(0, CONFIG_PANEL_HEIGHT, this.window.body.frame.width, this.window.body.frame.height - CONFIG_PANEL_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            contextType: UIRendererContext.context2d
        });

        this.renderer
            .getUIElement()
            .onMouseDown((uiElement, event) => {
                this._mouseMoving = true;
                this._prevMouseCoords = {
                    x: event.offsetX,
                    y: event.offsetY
                };
                drawBetweenCoords(this.renderer._context, this._prevMouseCoords, this._prevMouseCoords, this._config);
            })
            .onMouseMove((uiElement, event) => {
                if (!this._mouseMoving) return;
                const currentCoords = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                drawBetweenCoords(this.renderer._context, this._prevMouseCoords, currentCoords, this._config);
                this._prevMouseCoords = currentCoords;
            })
            .onMouseUp((uiElement, event) => {
                this._mouseMoving = false;
                this._prevMouseCoords = false;
            })
            .onMouseLeave((uiElement, event) => {
                this._mouseMoving = false;
                this._prevMouseCoords = false;
            })
            .onWheel((uiElement, event) => {
                event.wheelDelta > 0 ? this.spreadIncrease() : this.spreadDecrease();
            })

        this.configCurrentStateContainer.addSubview(this.configCurrentStateColorName);
        this.configCurrentStateContainer.addSubview(this.configCurrentStateColor);
        this.configCurrentStateContainer.addSubview(this.configCurrentStateSpread);
        this.configContainer.addSubview(this.configColorContainer);
        this.configContainer.addSubview(this.configCurrentStateContainer);
        this.container.addSubview(this.configContainer);
        this.container.addSubview(this.renderer);
        this.window.setBodyContent(this.container);

        this.window.onResize = () => {
            resize(this);
        }
        this.window.onMaximize = () => {
            resize(this);
        }
        this.window.onMaximizeRestore = () => {
            resize(this);
        }

        fillColorsConfig(this);
    }

    setColor(uiColor) {
        if (!uiColor) return;
        this._config.color = uiColor;
        this.configCurrentStateColor.backgroundColor = uiColor;
    }

    setSpread(spread) {
        if (!spread || isNaN(spread)) return;
        this._config.spread = spread;
        this.configCurrentStateSpread.text = `Spread:${spread}`;
    }

    spreadIncrease() {
        this.setSpread(this._config.spread + 1);
    }

    spreadDecrease() {
        if (this._config.spread <= PAINT_DEFAULT_MIN_SPREAD) return;
        this.setSpread(this._config.spread - 1);
    }

    saveImg() {
        const imageData = this.renderer._canvasElement.getElement().toDataURL('image/png');
        imageDataUrlSaveToImage(imageData, `${this.appName}_${new Date().getTime()}`);
    }

    clear() {
        this.renderer.clear();
    }
}

export default PaintApplicationWindow