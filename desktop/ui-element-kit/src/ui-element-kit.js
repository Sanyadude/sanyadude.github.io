import Utils from './utils/utils.js'
export { Utils } from './utils/utils.js'
import Html from './utils/html.js'
export { Html } from './utils/html.js'

import UIElements from './ui-elements.js'
export { UIElements } from './ui-elements.js'
import { UIElementFactory, createUIElementFactory } from './ui-element-factory.js'
export { UIElementFactory, createUIElementFactory } from './ui-element-factory.js'
import { UIElementApplication, createUIElementApplication } from './ui-element-application.js'
export { UIElementApplication, createUIElementApplication } from './ui-element-application.js'

export {
    UIElement,
    AElement,
    PElement,
    DivElement,
    SpanElement,
    CanvasElement,
    ImgElement,
    InputElement,
    TextAreaElement,
    ButtonElement,
    SvgElement,
    PathElement,
    IFrameElement,
    StyleElement
} from './ui-elements.js'

export const UIElementKit = {
    Utils,
    Html,
    UIElements,
    UIElementFactory,
    UIElementApplication,
    createUIElementFactory,
    createUIElementApplication
}

export default UIElementKit