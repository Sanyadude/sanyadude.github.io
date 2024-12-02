export const setFont = (font, uiElement) => {
    if (!font) {
        uiElement
            .resetFontFamily()
            .resetFontSize()
            .resetLineHeight();
        return;
    }
    uiElement.setFontSize(font.fontSize);
    uiElement.setFontFamily(font.fontFamily);
    if (!font.lineHeight) return;
    uiElement.setLineHeight(font.lineHeight);
}

export default setFont