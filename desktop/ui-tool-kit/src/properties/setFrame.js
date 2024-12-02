import { UISizeMode } from '../ui-graphic.js'
import setPosition from './setPosition.js'

export const setFrame = (view, uiElement) => {
    if (!view._initialPosition)
        setPosition(view, uiElement)
    if (view.frame && view._widthMode == UISizeMode.frameSize)
        uiElement.setWidth(view.frame.width);
    if (view.frame && view._heightMode == UISizeMode.frameSize)
        uiElement.setHeight(view.frame.height);
}

export default setFrame