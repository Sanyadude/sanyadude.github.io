import { UIEdge } from '../ui-graphic.js'

export const setPadding = (padding, uiElement) => {
    if (!padding || !padding.length) {
        uiElement.resetPadding();
        return;
    }
    if (padding.edges.includes(UIEdge.top))
        uiElement.setPaddingTop(padding.length);
    else
        uiElement.resetPaddingTop();
    if (padding.edges.includes(UIEdge.left))
        uiElement.setPaddingLeft(padding.length);
    else
        uiElement.resetPaddingLeft();
    if (padding.edges.includes(UIEdge.bottom))
        uiElement.setPaddingBottom(padding.length);
    else
        uiElement.resetPaddingBottom();
    if (padding.edges.includes(UIEdge.right))
        uiElement.setPaddingRight(padding.length);
    else
        uiElement.resetPaddingRight();
}

export default setPadding