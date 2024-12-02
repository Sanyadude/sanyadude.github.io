import { UIEdge } from '../ui-graphic.js'

export const setBorder = (border, uiElement) => {
    if (!border || !border.width) {
        uiElement.resetBorder();
        return;
    }
    if (border.edges.includes(UIEdge.top))
        uiElement.setBorderTop(border.width, border.color.rgba(), border.style);
    else
        uiElement.resetBorderTop();
    if (border.edges.includes(UIEdge.left))
        uiElement.setBorderLeft(border.width, border.color.rgba(), border.style);
    else
        uiElement.resetBorderLeft();
    if (border.edges.includes(UIEdge.bottom))
        uiElement.setBorderBottom(border.width, border.color.rgba(), border.style);
    else
        uiElement.resetBorderBottom();
    if (border.edges.includes(UIEdge.right))
        uiElement.setBorderRight(border.width, border.color.rgba(), border.style);
    else
        uiElement.resetBorderRight();
}

export default setBorder