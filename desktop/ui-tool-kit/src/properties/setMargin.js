import { UIEdge } from '../ui-graphic.js'

export const setMargin = (margin, uiElement) => {
    if (!margin || !margin.length) {
        uiElement.resetMargin();
        return;
    }
    if (margin.edges.includes(UIEdge.top))
        uiElement.setMarginTop(margin.length);
    else
        uiElement.resetMarginTop();
    if (margin.edges.includes(UIEdge.left))
        uiElement.setMarginLeft(margin.length);
    else
        uiElement.resetMarginLeft();
    if (margin.edges.includes(UIEdge.bottom))
        uiElement.setMarginBottom(margin.length);
    else
        uiElement.resetMarginBottom();
    if (margin.edges.includes(UIEdge.right))
        uiElement.setMarginRight(margin.length);
    else
        uiElement.resetMarginRight();
}

export default setMargin