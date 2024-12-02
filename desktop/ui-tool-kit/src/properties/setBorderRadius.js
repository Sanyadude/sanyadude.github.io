export const setBorderRadius = (borderRadius, uiElement) => {
    if (!borderRadius) {
        uiElement.resetBorderRadius();
        return;
    }
    uiElement.setBorderRadius(borderRadius);
}

export default setBorderRadius