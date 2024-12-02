import ApplicationWindow from '../../components/application-components/application-window.js'
import { UIColor, UIImage, UIImageView, UIRect, UIEdgeSet, UISize, UISizeMode, UIView, UIOffset, UIIcon, UITextLabel, UITextAlign } from '../../../ui-tool-kit/index.js'
import { APP_ROOT_PATH } from '../../config/config.js'
import { WINDOW_RESIZABLE_MIN_HEIGHT } from '../../config/desktop-config.js'
import { SystemUIFont } from '../../config/fonts.js'
import { SvgSet } from '../../config/svg-set.js'

const GALLERY_APP_PATH = `${APP_ROOT_PATH}/window-applications/gallery`;
const GALLERY_PATH = `${GALLERY_APP_PATH}/gallery`;
const GALLERY_ID = 1;
const GALLERY_UI_IMAGES = [];
const GALLERY_ZOOM = 0.25;

const PREV_NEXT_HIGHLIGHT_COLOR = new UIColor(1, 1, 1, 0.2);
const PREV_NEXT_WIDTH = 100;
const WINDOW_BACKGROUND_COLOR = new UIColor(.1, .1, .1);
const WINDOW_ACTION_ICON_HIGHLIGHT_COLOR = new UIColor(.2, .2, .2);
const WINDOW_TEXT_COLOR = UIColor.white;

const INFORMATION_BAR_HEIGHT = 40;
const ZOOM_BUTTON_SIZE = 40;
const ZOOM_IN_ICON_SVG = SvgSet.magnifyingGlassPlus;
const ZOOM_OUT_ICON_SVG = SvgSet.magnifyingGlassMinus;

const resize = (context) => {
    context.container.frame = new UIRect(0, 0, context.window.body.frame.width, context.window.body.frame.height);
    context.imageView.frame = new UIRect(0, 0, context.window.body.frame.width, context.window.body.frame.height - INFORMATION_BAR_HEIGHT);
    context.prevView.frame.height = context.window.body.frame.height;
    context.nextView.frame.height = context.window.body.frame.height;
    context.informationBar.frame.width = context.window.body.frame.width;
}

const getZoomTranslateCoords = (context, x, y, zoomRate) => {
    const imageRect = context.imageView.getUIClientRect();
    const imageRectCenterX = imageRect.x + imageRect.width / 2;
    const imageRectCenterY = imageRect.y + imageRect.height / 2;

    const containerRect = context.container.getUIClientRect();
    const containerRectCenterX = containerRect.x + containerRect.width / 2;
    const containerRectCenterY = containerRect.y + containerRect.height / 2;

    const translateX = x - (containerRectCenterX - imageRectCenterX + x) * zoomRate;
    const translateY = y - (containerRectCenterY - imageRectCenterY + y) * zoomRate;
    return {
        x: translateX,
        y: translateY + INFORMATION_BAR_HEIGHT/2
    }
}

export class GalleryApplicationWindow extends ApplicationWindow {
    getWindowConfig() {
        return Object.assign(super.getWindowConfig(), {
            minSize: new UISize(500, WINDOW_RESIZABLE_MIN_HEIGHT)
        })
    }

    _init() {
        super._init();

        this.container = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, this.window.body.frame.height),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        })

        this.container
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
                const galleryId = this.galleryId + 1;
                this.setGallery(galleryId, []);
                Object.values(files).forEach(file => {
                    if (!file.type.startsWith('image/')) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.setGallery(galleryId, [...this.gallery, new UIImage(file.name, e.target.result)]);
                    };
                    reader.readAsDataURL(file);
                })
            })

        this.prevView = new UIView({
            frame: new UIRect(0, 0, PREV_NEXT_WIDTH, this.window.body.frame.height),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });
        this.prevView
            .getUIElement()
            .onClick((uiElement, event) => this.prevImage())
            .onMouseEnter(() => this.prevView.backgroundColor = PREV_NEXT_HIGHLIGHT_COLOR)
            .onMouseLeave(() => this.prevView.backgroundColor = null)

        this.nextView = new UIView({
            frame: new UIRect(0, 0, PREV_NEXT_WIDTH, this.window.body.frame.height),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            anchor: UIEdgeSet.topRight
        });
        this.nextView
            .getUIElement()
            .onClick((uiElement, event) => this.nextImage())
            .onMouseEnter(() => this.nextView.backgroundColor = PREV_NEXT_HIGHLIGHT_COLOR)
            .onMouseLeave(() => this.nextView.backgroundColor = null)

        this.imageView = new UIImageView({
            frame: new UIRect(0, 0, this.window.body.frame.width, this.window.body.frame.height - INFORMATION_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            image: new UIImage()
        });
        this.imageView
            .getImgElement()
            .setObjectFitContain()
            .onDragStart((uiElement, event) => {
                event.preventDefault();
                event.stopPropagation();
            });

        this.container
            .getUIElement()
            .onWheel((uiElement, event) => {
                if (!event.ctrlKey) return;
                event.preventDefault();
                const rect = uiElement.getBoundingClientRect();
                const x = event.clientX - (rect.x + rect.width / 2);
                const y = event.clientY - (rect.y + rect.height / 2);
                if (event.wheelDelta > 0) {
                    this.zoomIn(x, y);
                } else {
                    this.zoomOut(x, y);
                }
            });

        this.informationBar = new UIView({
            frame: new UIRect(0, 0, this.window.body.frame.width, INFORMATION_BAR_HEIGHT),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false,
            backgroundColor: WINDOW_BACKGROUND_COLOR,
            anchor: UIEdgeSet.bottomLeft
        });
        this.zoomValueView = new UIView({
            frame: new UIRect(ZOOM_BUTTON_SIZE * 2, 0, ZOOM_BUTTON_SIZE * 2, ZOOM_BUTTON_SIZE),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });
        this.zoomValueLabel = new UITextLabel({
            frame: new UIRect(0, 0, ZOOM_BUTTON_SIZE * 2, ZOOM_BUTTON_SIZE),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            textColor: WINDOW_TEXT_COLOR,
            initialPosition: false,
            font: SystemUIFont.defaultWith(ZOOM_BUTTON_SIZE),
            textAlign: UITextAlign.center,
            text: `-`
        });
        this.zoomInView = new UIView({
            frame: new UIRect(0, 0, ZOOM_BUTTON_SIZE, ZOOM_BUTTON_SIZE),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });
        this.zoomInIcon = new UIIcon({
            frame: new UIRect(0, 0, ZOOM_BUTTON_SIZE, ZOOM_BUTTON_SIZE),
            svg: ZOOM_IN_ICON_SVG,
            iconColor: WINDOW_TEXT_COLOR,
            padding: new UIOffset(12)
        });
        this.zoomInView
            .getUIElement()
            .setCursorPointer()
            .setUserSelectNone()
            .onMouseEnter((uiElement, event) => this.zoomInView.backgroundColor = PREV_NEXT_HIGHLIGHT_COLOR)
            .onMouseLeave(() => this.zoomInView.backgroundColor = null)
            .onClick((uiElement, event) => this.zoomIn())

        this.zoomOutView = new UIView({
            frame: new UIRect(ZOOM_BUTTON_SIZE, 0, ZOOM_BUTTON_SIZE, ZOOM_BUTTON_SIZE),
            widthMode: UISizeMode.frameSize,
            heightMode: UISizeMode.frameSize,
            initialPosition: false
        });
        this.zoomOutIcon = new UIIcon({
            frame: new UIRect(0, 0, ZOOM_BUTTON_SIZE, ZOOM_BUTTON_SIZE),
            svg: ZOOM_OUT_ICON_SVG,
            iconColor: WINDOW_TEXT_COLOR,
            padding: new UIOffset(12)
        });
        this.zoomOutView
            .getUIElement()
            .setCursorPointer()
            .setUserSelectNone()
            .onMouseEnter((uiElement, event) => this.zoomOutView.backgroundColor = PREV_NEXT_HIGHLIGHT_COLOR)
            .onMouseLeave(() => this.zoomOutView.backgroundColor = null)
            .onClick((uiElement, event) => this.zoomOut())

        this.window.container.backgroundColor = WINDOW_BACKGROUND_COLOR;
        this.window.container.border.color = WINDOW_BACKGROUND_COLOR;
        this.window.headerTextLabel.textColor = WINDOW_TEXT_COLOR;
        this.window.restoreIcon.iconColor = WINDOW_TEXT_COLOR;
        this.window.minimizeIcon.iconColor = WINDOW_TEXT_COLOR;
        this.window.maximizeIcon.iconColor = WINDOW_TEXT_COLOR;
        this.window.closeIcon.iconColor = WINDOW_TEXT_COLOR;

        this.window.minimizeIconContainer
            .getUIElement()
            .onMouseEnter(() => this.window.minimizeIconContainer.backgroundColor = WINDOW_ACTION_ICON_HIGHLIGHT_COLOR)
        this.window.maximizeIconContainer
            .getUIElement()
            .onMouseEnter(() => this.window.maximizeIconContainer.backgroundColor = WINDOW_ACTION_ICON_HIGHLIGHT_COLOR)
        this.window.restoreIconContainer
            .getUIElement()
            .onMouseEnter(() => this.window.restoreIconContainer.backgroundColor = WINDOW_ACTION_ICON_HIGHLIGHT_COLOR)
        this.window.closeIconContainer
            .getUIElement()
            .onMouseLeave(() => {
                this.window.closeIcon.iconColor = WINDOW_TEXT_COLOR;
            })

        this.container.addSubviews([this.imageView, this.prevView, this.nextView, this.informationBar]);
        this.informationBar.addSubviews([this.zoomOutView, this.zoomInView, this.zoomValueView]);
        this.zoomInView.addSubview(this.zoomInIcon);
        this.zoomOutView.addSubview(this.zoomOutIcon);
        this.zoomValueView.addSubview(this.zoomValueLabel);
        this.window.setBodyContent(this.container);

        this.window.onActivate = () => {
            this.window.container.border.color = WINDOW_BACKGROUND_COLOR;
        }

        this.window.onResize = () => {
            resize(this);
        }
        this.window.onMaximize = () => {
            resize(this);
        }
        this.window.onMaximizeRestore = () => {
            resize(this);
        }

        this.setGallery(GALLERY_ID, GALLERY_UI_IMAGES);
    }

    setGallery(galleryId, images) {
        this.galleryId = galleryId;
        this.gallery = images;
        this.galleryCurrentIndex = images.length > 0 ? 0 : -1;
        this.setCurrentGalleryImage();
    }

    setCurrentGalleryImage() {
        if (this.galleryCurrentIndex < 0) return;
        const currentImage = this.gallery[this.galleryCurrentIndex];
        if (!currentImage) {
            this.imageView.image = null;
            this.window.headerTextLabel.text = this.appName;
            this.task.label.text = this.appName;
            return;
        }
        this.imageView.image = this.gallery[this.galleryCurrentIndex];
        this.window.headerTextLabel.text = this.imageView.image.title;
        this.task.label.text = this.imageView.image.title;
        this.imageView.getUIElement().resetTransform();
        this.galleryZoom = 1;
        this.zoomValueLabel.setText(`${this.galleryZoom * 100}%`);
        this.galleryTranslate = { x: 0, y: 0 };
    }

    nextImage() {
        if (this.galleryCurrentIndex + 1 > this.gallery.length - 1) return;
        this.galleryCurrentIndex++;
        this.setCurrentGalleryImage();
    }

    prevImage() {
        if (this.galleryCurrentIndex <= 0) return;
        this.galleryCurrentIndex--;
        this.setCurrentGalleryImage();
    }

    zoomIn(x = 0, y = 0, zoom = GALLERY_ZOOM) {
        const newZoom = this.galleryZoom + zoom;
        const zoomRate = newZoom / this.galleryZoom;
        this.galleryTranslate = getZoomTranslateCoords(this, x, y, zoomRate);
        this.galleryZoom = newZoom;
        this.zoomValueLabel.setText(`${this.galleryZoom * 100}%`);
        this.imageView.getUIElement()
            .setTransformTranslate(this.galleryTranslate.x, this.galleryTranslate.y)
            .addTransformScale(this.galleryZoom, this.galleryZoom);
    }

    zoomOut(x = 0, y = 0, zoom = GALLERY_ZOOM) {
        if (this.galleryZoom - zoom < GALLERY_ZOOM) return;
        const newZoom = this.galleryZoom - zoom;
        const zoomRate = newZoom / this.galleryZoom;
        this.galleryTranslate = getZoomTranslateCoords(this, x, y, zoomRate);
        this.galleryZoom = newZoom;
        this.zoomValueLabel.setText(`${this.galleryZoom * 100}%`);
        this.imageView.getUIElement()
            .setTransformTranslate(this.galleryTranslate.x, this.galleryTranslate.y)
            .addTransformScale(this.galleryZoom, this.galleryZoom);
    }

}

export default GalleryApplicationWindow