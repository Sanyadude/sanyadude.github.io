import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import UIWidget from './ui-widget.js'
import { UIRect, UISizeMode, UITextAlign, UITextLabel, UIView } from '../../../ui-tool-kit/index.js'
import { WIDGET_KEYBOARD_LANGUAGE_ITEM_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_HEIGHT, WIDGET_KEYBOARD_LANGUAGE_PADDING, WIDGET_KEYBOARD_LANGUAGE_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_SHORT_NAME_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_SHORT_NAME_HEIGHT, WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_HEIGHT, WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_X, WIDGET_KEYBOARD_LANGUAGE_ITEM_SHORT_NAME_PADDING, TASK_BAR_HOVER_BACKGROUND_COLOR, WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_PADDING, WIDGET_KEYBOARD_LANGUAGE_ITEM_SELECTED_BACKGROUND_COLOR } from '../../config/desktop-config.js'
import SystemUIFont from '../../config/fonts.js'

const createLanguagesContainers = (context, payload) => {
    context.keyboardLanguages = [];
    payload.languages.forEach((language, index) => {
        const keyboardLanguage = new KeyboardLanguage(language, index);
        context.keyboardLanguages.push(keyboardLanguage);
        context.languagesContainer.addSubview(keyboardLanguage.container);
    });
    context.languagesContainer.frame.height = payload.languages.length * WIDGET_KEYBOARD_LANGUAGE_ITEM_HEIGHT;
    context.container.frame.height = context.languagesContainer.frame.height + WIDGET_KEYBOARD_LANGUAGE_PADDING * 2;
}

const selectLanguage = (context, payload) => {
    context.keyboardLanguages.forEach((keyboardLanguage) => {
        if (keyboardLanguage.language.name == payload.language.name) {
            keyboardLanguage.select();
        } else {
            keyboardLanguage.deselect();
        }
    })
}

class KeyboardLanguage {
    constructor(language, index) {
        this.language = language;
        this.index = index;
        this.selected = false;

        this._init();
    }

    _init() {
        this.container = new UIView({
            frame: new UIRect(0, this.index * WIDGET_KEYBOARD_LANGUAGE_ITEM_HEIGHT, WIDGET_KEYBOARD_LANGUAGE_ITEM_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });
        this.shortName = new UITextLabel({
            frame: new UIRect(0, 0, WIDGET_KEYBOARD_LANGUAGE_ITEM_SHORT_NAME_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_SHORT_NAME_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: WIDGET_KEYBOARD_LANGUAGE_ITEM_SHORT_NAME_PADDING,
            textAlign: UITextAlign.center,
            font: SystemUIFont.xLarge,
            text: this.language.name3Self.toUpperCase()
        });
        this.description = new UITextLabel({
            frame: new UIRect(WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_X, 0, WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_WIDTH, WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            padding: WIDGET_KEYBOARD_LANGUAGE_ITEM_DESCRIPTION_PADDING,
            font: SystemUIFont.xLarge,
            text: this.language.name
        });

        this.shortName
            .getUIElement()
            .setFontWeight(500)

        this.container
            .getUIElement()
            .setCursorDefault()
            .setUserSelectNone()
            .onMouseEnter((uiElement, event) => {
                if (this.selected) return;
                this.container.backgroundColor = TASK_BAR_HOVER_BACKGROUND_COLOR;
            })
            .onMouseLeave((uiElement, event) => {
                this.container.backgroundColor = this.selected 
                    ? WIDGET_KEYBOARD_LANGUAGE_ITEM_SELECTED_BACKGROUND_COLOR
                    : null;
            })
            .onClick((uiElement, event) => {
                if (this.selected) return;
                EventEmitter.emit('system-keyboard-language-change', { language: this.language.name2 });
            })

        this.container.addSubviews([this.shortName, this.description]);
    }

    select() {
        this.selected = true;
        this.container.backgroundColor = WIDGET_KEYBOARD_LANGUAGE_ITEM_SELECTED_BACKGROUND_COLOR;
    }

    deselect() {
        this.selected = false;
        this.container.backgroundColor = null;
    }
}

export class KeyboardLanguageWidget extends UIWidget {
    constructor() {
        super('keyboard-language', { frame: new UIRect(0, 0, WIDGET_KEYBOARD_LANGUAGE_WIDTH, WIDGET_KEYBOARD_LANGUAGE_PADDING * 2) });
    }

    _configure() {
        super._configure();

        this.languagesContainer = new UIView({
            frame: new UIRect(0, WIDGET_KEYBOARD_LANGUAGE_PADDING, WIDGET_KEYBOARD_LANGUAGE_WIDTH, 0),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });

        this.container.addSubview(this.languagesContainer);

        EventEmitter.subscribe('system-keyboard-language-set-changed', (payload) => {
            createLanguagesContainers(this, payload);
        });

        EventEmitter.subscribe('system-keyboard-language-changed', (payload) => {
            selectLanguage(this, payload);
        });
    }
}

export default KeyboardLanguageWidget