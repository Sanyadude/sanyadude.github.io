import { UIDisplayMode } from '../ui-graphic.js'

export const setDisplayMode = (view, uiElement) => {
    switch (view._displayMode) {
        case UIDisplayMode.flex:
            uiElement.setDisplayInlineFlex();
            break;
        case UIDisplayMode.default:
            uiElement.setDisplayInlineBlock();
            break;
    }
}

export default setDisplayMode