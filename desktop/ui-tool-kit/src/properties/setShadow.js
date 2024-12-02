export const setShadow = (shadow, uiElement) => {
    if (!shadow || shadow.blur < 0) {
        uiElement.resetBoxShadow();
        return;
    }
    uiElement.setBoxShadow(shadow.color.rgba(), shadow.offset.x, shadow.offset.y, shadow.blur, shadow.spread);
}

export default setShadow