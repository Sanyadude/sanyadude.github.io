import EventEmitter from '../../../event-emmiter/event-emmiter.js'
import { AudioVolumeWidget } from './audio-volume-widget.js'
import { KeyboardLanguageWidget } from './keyboard-language-widget.js'

const DEFAULT_WIDGETS = [new AudioVolumeWidget(), new KeyboardLanguageWidget()];

const onWidgetControl = (context, payload) => {
    const widgetStatus = context.widgetStatus[payload.name];
    const simulateBackdrop = () => {
        const onMouseDown = (event) => {
            const widgetRect = widgetStatus.widget.container.getUIClientRect();
            const clickInsideWidget = event.clientX >= widgetRect.left && event.clientX <= widgetRect.right 
                && event.clientY >= widgetRect.top && event.clientY <= widgetRect.bottom;
            if (clickInsideWidget) return;
            widgetStatus.opened = false;
            context.desktopSpace.removeComponent(widgetStatus.widget.container);
            EventEmitter.emit(`widget-${widgetStatus.widget.name}-closed`, {});
            document.removeEventListener('mousedown', onMouseDown);
        }
        document.addEventListener('mousedown', onMouseDown);
    }
    switch (payload.action) {
        case 'toggle':
            widgetStatus.opened = !widgetStatus.opened;
            if (widgetStatus.opened) {
                if (payload.coords) {
                    widgetStatus.widget.container.frame.x = typeof payload.coords.x == 'function'
                        ? payload.coords.x(widgetStatus.widget)
                        : payload.coords.x;
                    widgetStatus.widget.container.frame.y = typeof payload.coords.y == 'function'
                        ? payload.coords.y(widgetStatus.widget)
                        : payload.coords.y;
                }
                context.desktopSpace.addComponent(widgetStatus.widget.container);
                EventEmitter.emit(`widget-${widgetStatus.widget.name}-opened`, {});
                simulateBackdrop();
            } else {
                context.desktopSpace.removeComponent(widgetStatus.widget.container);
                EventEmitter.emit(`widget-${widgetStatus.widget.name}-closed`, {});
            }
            break;
        case 'open':
            widgetStatus.opened = true;
            if (payload.coords) {
                widgetStatus.widget.container.frame.x = typeof payload.coords.x == 'function'
                    ? payload.coords.x(widgetStatus.widget)
                    : payload.coords.x;
                widgetStatus.widget.container.frame.y = typeof payload.coords.y == 'function'
                    ? payload.coords.y(widgetStatus.widget)
                    : payload.coords.y;
            }
            context.desktopSpace.addComponent(widgetStatus.widget.container);
            EventEmitter.emit(`widget-${widgetStatus.widget.name}-opened`, {});
            simulateBackdrop();
            break;
        case 'close':
            widgetStatus.opened = false;
            context.desktopSpace.removeComponent(widgetStatus.widget.container);
            EventEmitter.emit(`widget-${widgetStatus.widget.name}-closed`, {});
            break;
    }
}

export class DesktopWidgets {
    constructor(windowDesktopApplication, desktopSpace) {
        this.windowDesktopApplication = windowDesktopApplication;
        this.desktopSpace = desktopSpace;

        this.widgetStatus = {};

        this._init();
    }

    addWidget(widget) {
        this.widgetStatus[widget.name] = { widget: widget, opened: false };
    }

    removeWidget(widget) {
        delete this.widgets[widget.name];
    }

    _init() {
        EventEmitter.subscribe('widget-control', (payload) => {
            onWidgetControl(this, payload);
        });
        DEFAULT_WIDGETS.forEach(widget => this.addWidget(widget));
    }
}

export default DesktopWidgets