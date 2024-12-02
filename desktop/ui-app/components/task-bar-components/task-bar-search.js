import { UIBorder, UIIcon, UIOffset, UIRect, UISizeMode, UITextField, UITextLabel, UIView } from '../../../ui-tool-kit/index.js'
import { TASK_BAR_START_ICON_WIDTH, TASK_BAR_SEARCH_BAR_BACKGROUND_COLOR, TASK_BAR_SEARCH_BAR_BORDER_COLOR, TASK_BAR_SEARCH_BAR_BORDER_WIDTH, TASK_BAR_SEARCH_BAR_ICON_COLOR, TASK_BAR_SEARCH_BAR_ICON_PADDING, TASK_BAR_SEARCH_BAR_ICON_SVG, TASK_BAR_SEARCH_BAR_ICON_WIDTH, TASK_BAR_SEARCH_BAR_ICON_HEIGHT, TASK_BAR_SEARCH_BAR_TEXT_FIELD_WIDTH, TASK_BAR_SEARCH_BAR_TEXT_FIELD_HEIGHT, TASK_BAR_SEARCH_BAR_CONTAINER_HEIGHT, TASK_BAR_SEARCH_BAR_CONTAINER_WIDTH, TASK_BAR_SEARCH_BAR_HOVER_BACKGROUND_COLOR, TASK_BAR_SEARCH_BAR_HOVER_BORDER_WIDTH, TASK_BAR_SEARCH_BAR_HOVER_BORDER_COLOR, TASK_BAR_SEARCH_BAR_PLACEHOLDER_TEXT_COLOR, TASK_BAR_SEARCH_BAR_TEXT_FIELD_PADDING } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'

const onMouseEnter = (context) => {
    context.searchContainer.backgroundColor = TASK_BAR_SEARCH_BAR_HOVER_BACKGROUND_COLOR;
    context.searchContainer.border.width = TASK_BAR_SEARCH_BAR_HOVER_BORDER_WIDTH;
}

const onMouseLeave = (context) => {
    if (context.searchFocused) return;
    context.searchContainer.backgroundColor = TASK_BAR_SEARCH_BAR_BACKGROUND_COLOR;
    context.searchContainer.border.width = TASK_BAR_SEARCH_BAR_BORDER_WIDTH;
}

const onFocus = (context) => {
    context.searchFocused = true;
    context.searchContainer.backgroundColor = TASK_BAR_SEARCH_BAR_HOVER_BACKGROUND_COLOR;
    context.searchContainer.border.width = TASK_BAR_SEARCH_BAR_HOVER_BORDER_WIDTH;
    context.searchContainer.border.color = TASK_BAR_SEARCH_BAR_HOVER_BORDER_COLOR;
}

const onBlur = (context) => {
    context.searchFocused = false;
    context.searchContainer.backgroundColor = TASK_BAR_SEARCH_BAR_BACKGROUND_COLOR;
    context.searchContainer.border.width = TASK_BAR_SEARCH_BAR_BORDER_WIDTH;
    context.searchContainer.border.color = TASK_BAR_SEARCH_BAR_BORDER_COLOR;
}

export class TaskBarSearch {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;

        this._init();
    }

    _init() {
        this.searchFocused = false;

        this.searchContainer = new UIView({
            frame: new UIRect(TASK_BAR_START_ICON_WIDTH, 0, TASK_BAR_SEARCH_BAR_CONTAINER_WIDTH, TASK_BAR_SEARCH_BAR_CONTAINER_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            backgroundColor: TASK_BAR_SEARCH_BAR_BACKGROUND_COLOR,
            border: new UIBorder(TASK_BAR_SEARCH_BAR_BORDER_WIDTH, TASK_BAR_SEARCH_BAR_BORDER_COLOR)
        })
        this.searchIcon = new UIIcon({
            frame: new UIRect(TASK_BAR_START_ICON_WIDTH, 0, TASK_BAR_SEARCH_BAR_ICON_WIDTH, TASK_BAR_SEARCH_BAR_ICON_HEIGHT),
            initialPosition: false,
            padding: new UIOffset(TASK_BAR_SEARCH_BAR_ICON_PADDING),
            iconColor: TASK_BAR_SEARCH_BAR_ICON_COLOR,
            svg: TASK_BAR_SEARCH_BAR_ICON_SVG
        })
        this.searchPlaceholder = new UITextLabel({
            frame: new UIRect(TASK_BAR_START_ICON_WIDTH + TASK_BAR_SEARCH_BAR_ICON_WIDTH, 0, TASK_BAR_SEARCH_BAR_TEXT_FIELD_WIDTH, TASK_BAR_SEARCH_BAR_TEXT_FIELD_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textColor: TASK_BAR_SEARCH_BAR_PLACEHOLDER_TEXT_COLOR,
            text: 'Type here to search',
            font: SystemUIFont.largeWith(TASK_BAR_SEARCH_BAR_TEXT_FIELD_HEIGHT).setFontSize(15)
        })
        this.searchTextField = new UITextField({
            frame: new UIRect(TASK_BAR_START_ICON_WIDTH + TASK_BAR_SEARCH_BAR_ICON_WIDTH, 0, TASK_BAR_SEARCH_BAR_TEXT_FIELD_WIDTH, TASK_BAR_SEARCH_BAR_TEXT_FIELD_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: TASK_BAR_SEARCH_BAR_TEXT_FIELD_PADDING,
            font: SystemUIFont.large,
            onValueChanged: (value) => {
                if (value) {
                    this.searchPlaceholder.hide();
                } else {
                    this.searchPlaceholder.show();
                }
            }
        })
        
        this.searchIcon
            .getSvgElement()
            .setTransformScale(-1, 1)

        this.searchIcon
            .getUIElement()
            .setCursorText()
            .onClick((uiElement, event) => {
                this.searchTextField.getTextFieldInputElement().getElement().focus();
            })
            .onMouseEnter((uiElement, event) => onMouseEnter(this))
            .onMouseLeave((uiElement, event) => onMouseLeave(this))

        this.searchTextField
            .getUIElement()
            .onMouseEnter((uiElement, event) => onMouseEnter(this))
            .onMouseLeave((uiElement, event) => onMouseLeave(this))

        this.searchTextField
            .getTextFieldInputElement()
            .onFocus((uiElement, event) => onFocus(this))
            .onBlur((uiElement, event) => onBlur(this))
    }

}

export default TaskBarSearch