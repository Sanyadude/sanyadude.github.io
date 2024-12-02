export const setTextColor = (textColor, uiElement) => {
    if (!textColor) {
        uiElement.resetColor();
        return;
    }
    uiElement.setColor(textColor.rgba());
}

export default setTextColor