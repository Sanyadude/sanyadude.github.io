import DesktopBackground from './desktop-background.js'
import DesktopSpace from './desktop-space.js'

export class Desktop {
    constructor(windowDesktopApplication) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.desktopBackground = new DesktopBackground(windowDesktopApplication);
        this.desktopSpace = new DesktopSpace(windowDesktopApplication);

        this._init();
    }

    _init() {
        this.windowDesktopApplication.applicationRoot.addComponent(this.desktopBackground.background);
        this.windowDesktopApplication.applicationRoot.addComponent(this.desktopSpace.desktopContainer);
    }

    createShortcut(config) {
        return this.desktopSpace.createShortcut(config);
    }

    addShortcut(shortcut) {
        this.desktopSpace.addShortcut(shortcut);
    }

    removeShortcut(shortcut) {
        this.desktopSpace.removeShortcut(shortcut);
    }

    addWindow(window) {
        this.desktopSpace.addWindow(window);
    }

    removeWindow(window) {
        this.desktopSpace.removeWindow(window);
    }

    addWidget(widget) {
        this.desktopSpace.addWidget(widget);
    }

    removeWidget(widget) {
        this.desktopSpace.removeWidget(widget);
    }

}

export default Desktop