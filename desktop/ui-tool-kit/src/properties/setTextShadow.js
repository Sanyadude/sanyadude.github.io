export const setTextShadow = (shadow, uiElement) => {
    if (!shadow || shadow.Blur < 0) {
        uiElement.resetTextShadow();
        return;
    }
    uiElement.setTextShadow(shadow.color.rgba(), shadow.offset.x, shadow.offset.y, shadow.blur);
}

export default setTextShadow