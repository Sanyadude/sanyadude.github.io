import { UIEdge } from '../ui-graphic.js'

export const setPosition = (view, uiElement) => {
    if (!view.frame || !view._anchor) {
        uiElement.resetInset();
        return;
    };
    if (view._anchor.includes(UIEdge.left))
        uiElement.setLeft(view.frame.x);
    else
        uiElement.resetLeft();
    if (view._anchor.includes(UIEdge.right))
        uiElement.setRight(view.frame.x);
    else
        uiElement.resetRight();
    if (view._anchor.includes(UIEdge.top))
        uiElement.setTop(view.frame.y);
    else
        uiElement.resetTop();
    if (view._anchor.includes(UIEdge.bottom))
        uiElement.setBottom(view.frame.y);
    else
        uiElement.resetBottom();
}

export default setPosition