import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { UIColor, UIImageView, UIRect, UISizeMode, UITextAlign, UITextEditView, UITextLabel, UIView } from '../../../ui-tool-kit/index.js'
import { SHORTCUT_ARROW_HEIGHT, SHORTCUT_ARROW_IMAGE, SHORTCUT_ARROW_WIDTH, SHORTCUT_ARROW_X, SHORTCUT_ARROW_Y, SHORTCUT_BORDER, SHORTCUT_DEFAULT_IMAGE, SHORTCUT_DEFAULT_NAME, SHORTCUT_HEIGHT, SHORTCUT_ICON_HEIGHT, SHORTCUT_ICON_PADDING, SHORTCUT_ICON_WIDTH, SHORTCUT_LABEL_HEIGHT, SHORTCUT_LABEL_LINEHEIGHT, SHORTCUT_LABEL_MAX_SYMBOLS, SHORTCUT_LABEL_TEXT_SHADOW, SHORTCUT_LABEL_TEXT_COLOR, SHORTCUT_WIDTH, SHORTCUT_SELECTED_BACKGROUND_COLOR, SHORTCUT_BACKGROUND_COLOR, SHORTCUT_BORDER_COLOR, SHORTCUT_SELECTED_BORDER_COLOR, SHORTCUT_NAME_EDIT_BORDER, SHORTCUT_NAME_EDIT_PADDING, SHORTCUT_NAME_EDIT_WIDTH, SHORTCUT_NAME_EDIT_HEIGHT, SHORTCUT_NAME_EDIT_X, SHORTCUT_NAME_EDIT_Y, SHORTCUT_LABEL_WIDTH, SHORTCUT_NAME_EDIT_PADDING_WIDTH, DOUBLE_CLICK_DELAY_MILLISECONDS } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'
import { KEYBOARD_BUTTONS_NAME_CODE_MAP } from '../../config/keyboard-buttons.js'

const getLabelText = (context, textLength) => {
    if (context.selected) return context.name;
    return context.name.length <= textLength
        ? context.name
        : context.name.slice(0, textLength - 3) + '...';
}

const onNameEditValueChanged = (context) => {
    context.nameEdit.frame.height = context.nameEdit.getTextEditViewTextareaElement().getElement().scrollHeight + 2 * SHORTCUT_NAME_EDIT_PADDING_WIDTH;
}

const startNameEditing = (context) => {
    if (context._nameEditing) return;
    context.nameEdit.show();
    context.label.hide();
    context.nameEdit.setValue(context.name, true);
    context.nameEdit.getTextEditViewTextareaElement().getElement().focus();
    context.nameEdit.selectText();
    context._nameEditing = true;
    onNameEditValueChanged(context);
}

const endNameEditing = (context) => {
    if (!context._nameEditing) return;
    context.nameEdit.hide();
    context.label.show();
    context.changeName(context.nameEdit.value);
    context._nameEditing = false;
}

const onDoubleClick = (context) => {
    if (context._nameEditing) return;
    context.deselect();
    endNameEditing(context);
    context.onDoubleClick();
}

const START_MOVING_THRESHOLD = 5;

const onMouseDown = (context, uiElement, event) => {
    const nowTimestamp = new Date().getTime();
    const lastTimestamp = context._lastMouseDownTimestamp;
    context._lastMouseDownTimestamp = nowTimestamp;
    if (nowTimestamp - lastTimestamp < DOUBLE_CLICK_DELAY_MILLISECONDS && !context._nameEditing) {
        onDoubleClick(context);
        return;
    }
    context._dragged = {
        startFrame: context.container.frame.copy(),
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
        deltaX: context.container.getUIElement().getOffsetLeft(),
        deltaY: context.container.getUIElement().getOffsetTop()
    };
    const onMove = (event) => {
        event.preventDefault();
        if (!context._dragged || context._nameEditing) return;
        const newX = event.clientX - context._dragged.startX + context._dragged.deltaX;
        const newY = event.clientY - context._dragged.startY + context._dragged.deltaY;
        if (!context._dragged.moved
            && (Math.abs(newX - context._dragged.startFrame.x) < START_MOVING_THRESHOLD
                || Math.abs(newY - context._dragged.startFrame.y) < START_MOVING_THRESHOLD)) return;
        context._dragged.moved = true;
        context.container.frame.x = newX;
        context.container.frame.y = newY;
        EventEmitter.emit('shortcut-drag', { shortcut: context, event });
    }
    const onMouseUp = (event) => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onMouseUp);
        const isMoved = context._dragged.moved;
        context._dragged = false;
        EventEmitter.emit('shortcut-drag-end', { shortcut: context, event });
        if (isMoved) {
            context.select();
            EventEmitter.emit('shortcut-selected', { shortcut: context, event });
        } else {
            if (!context.selected) {
                context.select();
                EventEmitter.emit('shortcut-selected', { shortcut: context, event });
            } else if (context._clickTargetLabel) {
                startNameEditing(context);
            } else if (context._nameEditing) { 
                endNameEditing(context);
            } else {
                context.deselect();
                EventEmitter.emit('shortcut-deselected', { shortcut: context, event });
            }
        }
        context._clickTargetLabel = false;
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
    EventEmitter.emit('shortcut-drag-start', { shortcut: context, event });
}

export class UIDesktopShortcut {
    constructor(config) {
        const defaultConfig = {
            name: SHORTCUT_DEFAULT_NAME,
            iconImage: SHORTCUT_DEFAULT_IMAGE,
            shortcutArrow: true,
            action: null
        };
        const mergedConfig = Object.assign(defaultConfig, config);
        this._config = mergedConfig || {};
        this._init(mergedConfig);
    }

    _init() {
        this._configure();
        delete this._config;
        return this;
    }

    _configure() {
        this._lastMouseDownTimestamp = 0;
        this._clickTargetLabel = false;
        this._nameEditing = false;

        this.selected = false;
        this.name = this._config.name;

        this.container = new UIView({
            frame: new UIRect(0, 0, SHORTCUT_WIDTH, SHORTCUT_HEIGHT),
            widthMode: UISizeMode.frameSize,
            initialPosition: false,
            border: SHORTCUT_BORDER
        })
        this.icon = new UIImageView({
            image: this._config.iconImage,
            frame: new UIRect(0, 0, SHORTCUT_ICON_WIDTH, SHORTCUT_ICON_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            padding: SHORTCUT_ICON_PADDING
        });
        this.label = new UITextLabel({
            frame: new UIRect(0, 0, SHORTCUT_LABEL_WIDTH, SHORTCUT_LABEL_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            textAlign: UITextAlign.center,
            text: getLabelText(this, SHORTCUT_LABEL_MAX_SYMBOLS),
            font: SystemUIFont.defaultWith(SHORTCUT_LABEL_LINEHEIGHT),
            textColor: SHORTCUT_LABEL_TEXT_COLOR,
            textShadow: SHORTCUT_LABEL_TEXT_SHADOW
        });
        this.nameEdit = new UITextEditView({
            frame: new UIRect(SHORTCUT_NAME_EDIT_X, SHORTCUT_NAME_EDIT_Y, SHORTCUT_NAME_EDIT_WIDTH, SHORTCUT_NAME_EDIT_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            textAlign: UITextAlign.center,
            backgroundColor: UIColor.white,
            font: SystemUIFont.defaultWith(SHORTCUT_LABEL_LINEHEIGHT),
            padding: SHORTCUT_NAME_EDIT_PADDING,
            border: SHORTCUT_NAME_EDIT_BORDER,
            clipToFrame: true,
            isHidden: true,
            zIndex: 1,
            onValueChanged: (value) => onNameEditValueChanged(this)
        });
        this.container.addSubviews([this.icon, this.label, this.nameEdit]);

        if (this._config.shortcutArrow) {
            this.iconArrow = new UIImageView({
                frame: new UIRect(SHORTCUT_ARROW_X, SHORTCUT_ARROW_Y, SHORTCUT_ARROW_WIDTH, SHORTCUT_ARROW_HEIGHT),
                widthMode: UISizeMode.frameSize,
                heightMode: UISizeMode.frameSize,
                initialPosition: false,
                image: SHORTCUT_ARROW_IMAGE
            });
            this.iconArrow
                .getUIElement()
                .onMouseDown((uiElement, event) => event.preventDefault());
            this.container.addSubview(this.iconArrow);
        }

        this.icon
            .getUIElement()
            .onMouseDown((uiElement, event) => event.preventDefault());
        this.container
            .getUIElement()
            .setVerticalAlignTop()
            .setCursorDefault()
            .setUserSelectNone()
            .onMouseDown((uiElement, event) => onMouseDown(this, uiElement, event))
            .onClick((uiElement, event) => event.stopPropagation())

        this.label
            .getUIElement()
            .setVerticalAlignTop()
            .setWordBreakBreakWord()
            .resetWhiteSpace()
            .onMouseDown((uiElement, event) => {
                this._clickTargetLabel = true;
            })
        this.nameEdit
            .getTextEditViewTextareaElement()
            .setOverflowHidden()
            .onBlur((uiElement, event) => {
                endNameEditing(this);
            })
            .onMouseDown((uiElement, event) => {
                this._clickTargetLabel = true;
            })
            .onKeyDown((uiElement, event) => {
                if (event.keyCode != KEYBOARD_BUTTONS_NAME_CODE_MAP.ENTER) return;
                event.preventDefault();
                endNameEditing(this);
            })

        if (this._config.action)
            this.onDoubleClick = this._config.action;
    }

    onDoubleClick() { }

    changeName(name) {
        this.name = name;
        this.label.text = getLabelText(this, SHORTCUT_LABEL_MAX_SYMBOLS);
    }

    select() {
        this.selected = true;
        this.container.backgroundColor = SHORTCUT_SELECTED_BACKGROUND_COLOR;
        this.container.border.color = SHORTCUT_SELECTED_BORDER_COLOR;
        this.container.zIndex = 1;
        this.label.text = getLabelText(this, SHORTCUT_LABEL_MAX_SYMBOLS);
        this.label.heightMode = UISizeMode.default;
    }

    deselect() {
        this.selected = false;
        this.container.backgroundColor = SHORTCUT_BACKGROUND_COLOR;
        this.container.border.color = SHORTCUT_BORDER_COLOR;
        this.container.zIndex = null;
        this.label.text = getLabelText(this, SHORTCUT_LABEL_MAX_SYMBOLS);
        this.label.heightMode = UISizeMode.frameSize;
    }
}

export default UIDesktopShortcut