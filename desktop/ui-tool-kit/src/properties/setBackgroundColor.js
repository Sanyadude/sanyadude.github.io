export const setBackgroundColor = (backgroundColor, uiElement) => {
    if (!backgroundColor) {
        uiElement.resetBackgroundColor();
        return;
    }
    uiElement.setBackgroundColor(backgroundColor.rgba());
}

export default setBackgroundColor