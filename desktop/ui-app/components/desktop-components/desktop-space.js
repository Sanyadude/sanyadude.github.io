import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import UIDesktopShortcut from './ui-desktop-shortcut.js'
import { UIRect, UISizeMode, UIView } from '../../../ui-tool-kit/index.js'
import { SHORTCUT_DEFAULT_NAME, SHORTCUT_GAP, SHORTCUT_HEIGHT, SHORTCUT_INITIAL_COORD, SHORTCUT_WIDTH, TASK_BAR_HEIGHT } from '../../config/desktop-config.js'
import DesktopWindowMaximizePlaceholder from './desktop-window-placeholder.js'
import DesktopWidgets from '../widget-components/desktop-widgets.js'

const getShortcutFreeSpace = (context) => {
    if (context.shortcuts.length == 0) return { x: SHORTCUT_INITIAL_COORD, y: SHORTCUT_INITIAL_COORD };
    const containerFrame = context.desktopContainer.frame;
    const gridXLength = Math.floor(containerFrame.width / (SHORTCUT_WIDTH + SHORTCUT_GAP));
    const gridYLength = Math.floor(containerFrame.height / (SHORTCUT_HEIGHT + SHORTCUT_GAP));
    const grid = Array.from({ length: gridXLength }, () => Array(gridYLength).fill(false));
    context.shortcuts.forEach(shortcut => {
        const shortcutRect = shortcut.container.getUIClientRect();
        let shortcutX = Math.floor(shortcutRect.x / (SHORTCUT_WIDTH + SHORTCUT_GAP));
        let shortcutY = Math.floor(shortcutRect.y / (SHORTCUT_HEIGHT + SHORTCUT_GAP));
        grid[shortcutX][shortcutY] = true;
    })
    for (let x = 0; x < gridXLength; x++) {
        for (let y = 0; y < gridYLength; y++) {
            if (grid[x][y]) continue;
            return { x: SHORTCUT_INITIAL_COORD + x * (SHORTCUT_WIDTH + SHORTCUT_GAP), y: SHORTCUT_INITIAL_COORD + y * (SHORTCUT_HEIGHT + SHORTCUT_GAP) };
        }
    }
    return { x: SHORTCUT_INITIAL_COORD, y: SHORTCUT_INITIAL_COORD };
}

const getShortcutUniqueName = (name, context) => {
    if (context.shortcuts.length == 0) return name;
    let uniqueName = name;
    let counter = 1;
    const shortcutNamesMap = {};
    context.shortcuts.forEach(shortcut => {
        shortcutNamesMap[shortcut.name] = true;
    })
    while (shortcutNamesMap[uniqueName]) {
        uniqueName = `${name} (${counter})`;
        counter++;
    }
    return uniqueName;
}

export class DesktopSpace {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.desktopWindowMaximizePlaceholder = new DesktopWindowMaximizePlaceholder(windowDesktopApplication, this);
        this.desktopWidgets = new DesktopWidgets(windowDesktopApplication, this);
        this.shortcuts = [];

        this._init();
    }

    _init() {
        this.desktopContainer = new UIView({
            frame: new UIRect(0, 0, this.windowDesktopApplication.width, this.windowDesktopApplication.height - TASK_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            zIndex: 1
        });

        this.desktopContainer
            .getUIElement()
            .onDragOver((uiElement, event) => {
                event.preventDefault();
                event.stopPropagation();
            })
            .onDragEnter((uiElement, event) => {
                event.preventDefault();
                event.stopPropagation();
            })
            .onDragLeave((uiElement, event) => {
                event.preventDefault();
                event.stopPropagation();
            })
            .onDrop((uiElement, event) => {
                event.preventDefault();
                event.stopPropagation();
                const files = event.dataTransfer.files;
                if (files.length == 0) return;
                EventEmitter.emit('desktop-space-drop-files', { files: files });
            })
            .onClick((uiElement, event) => this.shortcuts.forEach(shortcut => shortcut.deselect()))

        EventEmitter.subscribe('desktop-resize', (payload) => {
            this.desktopContainer.frame = new UIRect(0, 0, payload.width, payload.height - TASK_BAR_HEIGHT);
        });
        EventEmitter.subscribe('shortcut-selected', (payload) => {
            this.shortcuts.forEach(shortcut => {
                if (shortcut === payload.shortcut) return;
                shortcut.deselect();
            })
        });
        EventEmitter.subscribe('application-window-activated', (payload) => {
            this.shortcuts.forEach(shortcut => shortcut.deselect());
        });
    }

    createShortcut(config) {
        config = config || {};
        config.name = getShortcutUniqueName(config.name || SHORTCUT_DEFAULT_NAME, this);
        return new UIDesktopShortcut(config);
    }

    addShortcut(shortcut) {
        if (!shortcut) return;
        this.desktopContainer.addSubview(shortcut.container);
        const coords = getShortcutFreeSpace(this);
        shortcut.container.frame.x = coords.x;
        shortcut.container.frame.y = coords.y;
        this.shortcuts.push(shortcut);
    }

    removeShortcut(shortcut) {
        if (!shortcut) return;
        this.desktopContainer.removeSubview(shortcut.container);
        this.shortcuts = this.shortcuts.filter(x => x != shortcut);
    }

    addWindow(window) {
        if (!window) return;
        this.addComponent(window.container);
    }

    removeWindow(window) {
        if (!window) return;
        this.removeComponent(window.container);
    }

    addWidget(widget) {
        if (!widget) return;
        this.addComponent(widget.container);
    }

    removeWidget(widget) {
        if (!widget) return;
        this.removeComponent(widget.container);
    }

    addComponent(component) {
        if (!component) return;
        this.desktopContainer.addSubview(component);
    }

    removeComponent(component) {
        if (!component) return;
        this.desktopContainer.removeSubview(component);
    }

    addComponents(components) {
        this.desktopContainer.addSubviews(components);
    }

    removeComponents(components) {
        this.desktopContainer.removeSubviews(components);
    }

}

export default DesktopSpace