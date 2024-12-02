import { UITextAlign } from '../ui-graphic.js'

export const setTextAlign = (textAlign, uiElement) => {
    switch (textAlign) {
        case UITextAlign.left:
            uiElement.setTextLeft();
            break;
        case UITextAlign.right:
            uiElement.setTextRight();
            break;
        case UITextAlign.center:
            uiElement.setTextCenter();
            break;
        case UITextAlign.default:
            uiElement.resetTextAlign();
            break;
    }
}

export default setTextAlign