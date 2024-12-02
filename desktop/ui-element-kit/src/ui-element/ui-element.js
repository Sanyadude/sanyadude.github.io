import { UI_ELEMENT_DEFAULT_NAME, UI_ELEMENT_DEFAULT_TAG, DEFAULT_BORDER_STYLE, DEFAULT_COLOR, DEFAULT_TIME_UNIT, DEFAULT_TRANSITION_FUNCTION, DEFAULT_UNIT } from '../utils/consts.js'
import { createElement } from '../utils/html.js'
import { camelToKebabCase } from '../utils/utils.js'
import UIElementBase from './ui-element-base.js'
import UIElementProperty from './ui-element-property.js'
import UIElementPropertyArray from './ui-element-property-array.js'

/**
 * UIElement class extends UIElementBase and contains methods for updating specific properties, adding specific event listeners etc.
 */
export class UIElement extends UIElementBase {
    /**
     * Creates a new UIElement object with provided name and element
     * 
     * @param {string} name - The name of the UIElement. If no name provided "UIElement" (see `UI_ELEMENT_DEFAULT_NAME` constant) will be used
     * @param {Element} element - The element that will be wrapped by the UIElement. If no element provided then element is created using UIElement tag name
     * 
     * @returns {UIElement} new UIElement object 
     */
    static create(name = UI_ELEMENT_DEFAULT_NAME, element = this.createElement()) {
        return new this(name, element);
    }

    /**
     * Creates a new UIElement object with element of provided tag and with provided name
     * 
     * @param {string} tag - The tag name will be used to create html element for UIElement
     * @param {string} name - The name of the UIElement. If no name provided "UIElement" (see `UI_ELEMENT_DEFAULT_NAME` constant) will be used
     * 
     * @returns {UIElement} new UIElement object 
     */
    static createFromTag(tag, name = UI_ELEMENT_DEFAULT_NAME) {
        return new this(name, createElement(tag));
    }

    /**
     * Creates a new html element using UIElement tag name
     * 
     * @returns {Element} html element
     */
    static createElement() {
        return createElement(this.tag);
    }

    /**
     * Returns UIElement class default tag name (if not overwritten by derived class see `UI_ELEMENT_DEFAULT_TAG` constant)
     * 
     * @returns {string} html element tag name
     */
    static get tag() {
        return UI_ELEMENT_DEFAULT_TAG;
    }

    _init() {
        super._init();
        this._hidden = false;
        this._text = null;
        this._html = null;
    }

    _getStyleRuleContent() {
        let styleRuleText = '';
        for (const propertyName in this._properties) {
            if (propertyName == 'display') {
                styleRuleText += `${camelToKebabCase(propertyName)}:${this._hidden ? 'none' : this._properties[propertyName].toStyle()};`;
                continue;
            }
            styleRuleText += `${camelToKebabCase(propertyName)}:${this._properties[propertyName].toStyle()};`;
        }
        return styleRuleText;
    }
    //offset
    getOffsetTop() {
        return this._element.offsetTop;
    }

    getOffsetLeft() {
        return this._element.offsetLeft;
    }

    getOffsetWidth() {
        return this._element.offsetWidth;
    }

    getOffsetHeight() {
        return this._element.offsetHeight;
    }
    //bounding client rect
    getBoundingClientRect() {
        return this._element.getBoundingClientRect();
    }

    getClientX() {
        return this._element.getBoundingClientRect().x;
    }

    getClientY() {
        return this._element.getBoundingClientRect().y;
    }

    getClientLeft() {
        return this._element.getBoundingClientRect().left;
    }

    getClientRight() {
        return this._element.getBoundingClientRect().right;
    }

    getClientTop() {
        return this._element.getBoundingClientRect().top;
    }

    getClientBottom() {
        return this._element.getBoundingClientRect().bottom;
    }

    getClientWidth() {
        return this._element.getBoundingClientRect().width;
    }

    getClientHeight() {
        return this._element.getBoundingClientRect().height;
    }
    //events
    onClick(listener, options) {
        this._addElementEventListener('click', listener, options);
        return this;
    }

    offClick(listener, options) {
        this._removeElementEventListener('click', listener, options);
        return this;
    }

    onDoubleClick(listener, options) {
        this._addElementEventListener('dblclick', listener, options);
        return this;
    }

    offDoubleClick(listener, options) {
        this._removeElementEventListener('dblclick', listener, options);
        return this;
    }

    onContextMenu(listener, options) {
        this._addElementEventListener('contextmenu', listener, options);
        return this;
    }

    offContextMenu(listener, options) {
        this._removeElementEventListener('contextmenu', listener, options);
        return this;
    }

    onFocus(listener, options) {
        this._addElementEventListener('focus', listener, options);
        return this;
    }

    offFocus(listener, options) {
        this._removeElementEventListener('focus', listener, options);
        return this;
    }

    onBlur(listener, options) {
        this._addElementEventListener('blur', listener, options);
        return this;
    }

    offBlur(listener, options) {
        this._removeElementEventListener('blur', listener, options);
        return this;
    }

    onMouseOver(listener, options) {
        this._addElementEventListener('mouseover', listener, options);
        return this;
    }

    offMouseOver(listener, options) {
        this._removeElementEventListener('mouseover', listener, options);
        return this;
    }

    onMouseOut(listener, options) {
        this._addElementEventListener('mouseout', listener, options);
        return this;
    }

    offMouseOut(listener, options) {
        this._removeElementEventListener('mouseout', listener, options);
        return this;
    }

    onMouseEnter(listener, options) {
        this._addElementEventListener('mouseenter', listener, options);
        return this;
    }

    offMouseEnter(listener, options) {
        this._removeElementEventListener('mouseenter', listener, options);
        return this;
    }

    onMouseLeave(listener, options) {
        this._addElementEventListener('mouseleave', listener, options);
        return this;
    }

    offMouseLeave(listener, options) {
        this._removeElementEventListener('mouseleave', listener, options);
        return this;
    }

    onMouseDown(listener, options) {
        this._addElementEventListener('mousedown', listener, options);
        return this;
    }

    offMouseDown(listener, options) {
        this._removeElementEventListener('mousedown', listener, options);
        return this;
    }

    onMouseUp(listener, options) {
        this._addElementEventListener('mouseup', listener, options);
        return this;
    }

    offMouseUp(listener, options) {
        this._removeElementEventListener('mouseup', listener, options);
        return this;
    }

    onMouseMove(listener, options) {
        this._addElementEventListener('mousemove', listener, options);
        return this;
    }

    offMouseMove(listener, options) {
        this._removeElementEventListener('mousemove', listener, options);
        return this;
    }

    onKeyDown(listener, options) {
        this._addElementEventListener('keydown', listener, options);
        return this;
    }

    offKeyDown(listener, options) {
        this._removeElementEventListener('keydown', listener, options);
        return this;
    }

    onKeyUp(listener, options) {
        this._addElementEventListener('keyup', listener, options);
        return this;
    }

    offKeyUp(listener, options) {
        this._removeElementEventListener('keyup', listener, options);
        return this;
    }

    onKeyPress(listener, options) {
        this._addElementEventListener('keypress', listener, options);
        return this;
    }

    offKeyPress(listener, options) {
        this._removeElementEventListener('keypress', listener, options);
        return this;
    }

    onTouchStart(listener, options) {
        this._addElementEventListener('touchstart', listener, options);
        return this;
    }

    offTouchStart(listener, options) {
        this._removeElementEventListener('touchstart', listener, options);
        return this;
    }

    onTouchEnd(listener, options) {
        this._addElementEventListener('touchend', listener, options);
        return this;
    }

    offTouchEnd(listener, options) {
        this._removeElementEventListener('touchend', listener, options);
        return this;
    }

    onTouchMove(listener, options) {
        this._addElementEventListener('touchmove', listener, options);
        return this;
    }

    offTouchMove(listener, options) {
        this._removeElementEventListener('touchmove', listener, options);
        return this;
    }

    onCopy(listener, options) {
        this._addElementEventListener('copy', listener, options);
        return this;
    }

    offCopy(listener, options) {
        this._removeElementEventListener('copy', listener, options);
        return this;
    }

    onCut(listener, options) {
        this._addElementEventListener('cut', listener, options);
        return this;
    }

    offCut(listener, options) {
        this._removeElementEventListener('cut', listener, options);
        return this;
    }

    onPaste(listener, options) {
        this._addElementEventListener('paste', listener, options);
        return this;
    }

    offPaste(listener, options) {
        this._removeElementEventListener('paste', listener, options);
        return this;
    }

    onWheel(listener, options) {
        this._addElementEventListener('wheel', listener, options);
        return this;
    }

    offWheel(listener, options) {
        this._removeElementEventListener('wheel', listener, options);
        return this;
    }

    onScroll(listener, options) {
        this._addElementEventListener('scroll', listener, options);
        return this;
    }

    offScroll(listener, options) {
        this._removeElementEventListener('scroll', listener, options);
        return this;
    }

    onDrag(listener, options) {
        this._addElementEventListener('drag', listener, options);
        return this;
    }

    offDrag(listener, options) {
        this._removeElementEventListener('drag', listener, options);
        return this;
    }

    onDrop(listener, options) {
        this._addElementEventListener('drop', listener, options);
        return this;
    }

    offDrop(listener, options) {
        this._removeElementEventListener('drop', listener, options);
        return this;
    }

    onDragStart(listener, options) {
        this._addElementEventListener('dragstart', listener, options);
        return this;
    }

    offDragStart(listener, options) {
        this._removeElementEventListener('dragstart', listener, options);
        return this;
    }

    onDragEnd(listener, options) {
        this._addElementEventListener('dragend', listener, options);
        return this;
    }

    offDragEnd(listener, options) {
        this._removeElementEventListener('dragend', listener, options);
        return this;
    }

    onDragEnter(listener, options) {
        this._addElementEventListener('dragenter', listener, options);
        return this;
    }

    offDragEnter(listener, options) {
        this._removeElementEventListener('dragenter', listener, options);
        return this;
    }

    onDragLeave(listener, options) {
        this._addElementEventListener('dragleave', listener, options);
        return this;
    }

    offDragLeave(listener, options) {
        this._removeElementEventListener('dragleave', listener, options);
        return this;
    }

    onDragOver(listener, options) {
        this._addElementEventListener('dragover', listener, options);
        return this;
    }

    offDragOver(listener, options) {
        this._removeElementEventListener('dragover', listener, options);
        return this;
    }
    //html
    _canSetHtml() {
        return Object.values(this._children).length === 0 && !this._text;
    }

    setHtml(html) {
        if (!this._canSetHtml()) return this;
        this._html = html;
        this._element.innerHTML = html;
        return this;
    }

    getHtml() {
        return this._html;
    }
    //text
    _canSetText() {
        return !this._element.childNodes[0]
            || (this._element.childNodes[0] && this._element.childNodes[0].nodeType === Node.TEXT_NODE);
    }

    setText(value) {
        if (!this._canSetText()) return this;
        this._text = value;
        this._element.textContent = value;
        return this;
    }

    getText() {
        return this._text;
    }
    //box sizing
    setBoxSizing(value) {
        this._setProperty('box-sizing', value);
        return this;
    }

    setBoxSizingBorderBox() {
        return this.setBoxSizing('border-box');
    }

    getBoxSizing() {
        return this._properties['box-sizing']?.toValue()[0];
    }

    resetBoxSizing() {
        this._resetProperty('box-sizing');
        return this;
    }
    //opacity
    setOpacity(value) {
        this._setProperty('opacity', value);
        return this;
    }

    getOpacity() {
        return this._properties['opacity']?.toValue()[0];
    }

    resetOpacity() {
        this._resetProperty('opacity');
        return this;
    }
    //hidden
    hide() {
        this._hidden = true;
        this._setElementStyle('display', 'none');
        return this;
    }

    show() {
        this._hidden = false;
        const displayValue = this.getDisplay();
        if (displayValue) {
            this._setElementStyle('display', displayValue);
            return this;
        }
        this._removeElementStyle('display');
        return this;
    }

    isHidden() {
        return this._hidden;
    }
    //display
    setDisplay(value) {
        const prop = new UIElementProperty('display').value(value);
        this._properties['display'] = prop;
        if (this._hidden) return this;
        this._setElementStyle('display', prop.toStyle());
        return this;
    }

    setDisplayInlineBlock() {
        return this.setDisplay('inline-block');;
    }

    setDisplayBlock() {
        return this.setDisplay('block');
    }

    setDisplayFlex() {
        return this.setDisplay('flex');
    }

    setDisplayInlineFlex() {
        return this.setDisplay('inline-flex');
    }

    getDisplay() {
        return this._properties['display']?.toValue()[0];
    }

    resetDisplay() {
        this._resetProperty('display');
        return this;
    }
    //flex-direction
    setFlexDirection(value) {
        this._setProperty('flex-direction', value);
        return this;
    }

    setFlexDirectionRow() {
        return this.setFlexDirection('row');
    }

    setFlexDirectionColumn() {
        return this.setFlexDirection('column');
    }

    getFlexDirection() {
        return this._properties['flex-direction']?.toValue()[0];
    }

    resetFlexDirection() {
        this._resetProperty('flex-direction');
        return this;
    }
    //flex-wrap
    setFlexWrap(value) {
        this._setProperty('flex-wrap', value);
        return this;
    }

    setFlexWrapWrap() {
        return this.setFlexWrap('wrap');
    }

    setFlexWrapNoWrap() {
        return this.setFlexWrap('nowrap');
    }

    getFlexWrap() {
        return this._properties['flex-wrap']?.toValue()[0];
    }

    resetFlexWrap() {
        this._resetProperty('flex-wrap');
        return this;
    }
    //flex-grow
    setFlexGrow(value) {
        this._setProperty('flex-grow', value);
        return this;
    }

    getFlexGrow() {
        return this._properties['flex-grow']?.toValue()[0];
    }

    resetFlexGrow() {
        this._resetProperty('flex-grow');
        return this;
    }
    //flex-shrink
    setFlexShrink(value) {
        this._setProperty('flex-shrink', value);
        return this;
    }

    getFlexShrink() {
        return this._properties['flex-shrink']?.toValue()[0];
    }

    resetFlexShrink() {
        this._resetProperty('flex-shrink');
        return this;
    }
    //flex-basis
    setFlexBasis(value, units) {
        this._setPropertyInUnits('flex-basis', value, units);
        return this;
    }

    setFlexBasisAuto() {
        return this.setFlexBasis('auto');
    }

    getFlexBasis() {
        return {
            value: this._properties['flex-basis']?.toValue()[0],
            units: this._properties['flex-basis']?.toValue()[1]
        };
    }

    resetFlexBasis() {
        this._resetProperty('flex-basis');
        return this;
    }
    //justify-content
    setJustifyContent(value) {
        this._setProperty('justify-content', value);
        return this;
    }

    setJustifyContentStart() {
        return this.setJustifyContent('start');
    }

    setJustifyContentCenter() {
        return this.setJustifyContent('center');
    }

    setJustifyContentEnd() {
        return this.setJustifyContent('end');
    }

    setJustifyContentSpaceBetween() {
        return this.setJustifyContent('space-between');
    }

    setJustifyContentSpaceAround() {
        return this.setJustifyContent('space-around');
    }

    setJustifyContentSpaceEvenly() {
        return this.setJustifyContent('space-evenly');
    }

    getJustifyContent() {
        return this._properties['justify-content']?.toValue()[0];
    }

    resetJustifyContent() {
        this._resetProperty('justify-content');
        return this;
    }
    //justify-items
    setJustifyItems(value) {
        this._setProperty('justify-items', value);
        return this;
    }

    setJustifyItemsStart() {
        return this.setJustifyItems('start');
    }

    setJustifyItemsCenter() {
        return this.setJustifyItems('center');
    }

    setJustifyItemsEnd() {
        return this.setJustifyItems('end');
    }

    setJustifyItemsStretch() {
        return this.setJustifyItems('stretch');
    }

    getJustifyItems() {
        return this._properties['justify-items']?.toValue()[0];
    }

    resetJustifyItems() {
        this._resetProperty('justify-items');
        return this;
    }
    //justify-self
    setJustifySelf(value) {
        this._setProperty('justify-self', value);
        return this;
    }

    setJustifySelfStart() {
        return this.setJustifySelf('start');
    }

    setJustifySelfCenter() {
        return this.setJustifySelf('center');
    }

    setJustifySelfEnd() {
        return this.setJustifySelf('end');
    }

    setJustifySelfStretch() {
        return this.setJustifySelf('stretch');
    }

    getJustifySelf() {
        return this._properties['justify-self']?.toValue()[0];
    }

    resetJustifySelf() {
        this._resetProperty('justify-self');
        return this;
    }
    //align-content
    setAlignContent(value) {
        this._setProperty('align-content', value);
        return this;
    }

    setAlignContentStart() {
        return this.setAlignContent('start');
    }

    setAlignContentCenter() {
        return this.setAlignContent('center');
    }

    setAlignContentEnd() {
        return this.setAlignContent('end');
    }

    setAlignContentStretch() {
        return this.setAlignContent('stretch');
    }

    getAlignContent() {
        return this._properties['align-content']?.toValue()[0];
    }

    resetAlignContent() {
        this._resetProperty('align-content');
        return this;
    }
    //align-items
    setAlignItems(value) {
        this._setProperty('align-items', value);
        return this;
    }

    setAlignItemsStart() {
        return this.setAlignItems('start');
    }

    setAlignItemsCenter() {
        return this.setAlignItems('center');
    }

    setAlignItemsEnd() {
        return this.setAlignItems('end');
    }

    setAlignItemsStretch() {
        return this.setAlignItems('stretch');
    }

    getAlignItems() {
        return this._properties['align-items']?.toValue()[0];
    }

    resetAlignItems() {
        this._resetProperty('align-items');
        return this;
    }
    //align-self
    setAlignSelf(value) {
        this._setProperty('align-self', value);
        return this;
    }

    setAlignSelfStart() {
        return this.setAlignSelf('start');
    }

    setAlignSelfCenter() {
        return this.setAlignSelf('center');
    }

    setAlignSelfEnd() {
        return this.setAlignSelf('end');
    }

    setAlignSelfStretch() {
        return this.setAlignSelf('stretch');
    }

    getAlignSelf() {
        return this._properties['align-self']?.toValue()[0];
    }

    resetAlignSelf() {
        this._resetProperty('align-self');
        return this;
    }
    //float
    setFloat(value) {
        this._setProperty('float', value);
        return this;
    }

    setFloatLeft() {
        return this.setFloat('left');
    }

    setFloatRight() {
        return this.setFloat('right');
    }

    getFloat() {
        return this._properties['float']?.toValue()[0];
    }

    resetFloat() {
        this._resetProperty('float');
        return this;
    }
    //position
    setPosition(value) {
        this._setProperty('position', value);
        return this;
    }

    setPositionInitial() {
        return this.setPosition('initial');
    }

    setPositionAbsolute() {
        return this.setPosition('absolute');
    }

    setPositionRelative() {
        return this.setPosition('relative');
    }

    getPosition() {
        return this._properties['position']?.toValue()[0];
    }

    resetPosition() {
        this._resetProperty('position');
        return this;
    }
    //left right top bottom
    setLeft(value, units) {
        this._setPropertyInUnits('left', value, units);
        return this;
    }

    getLeft() {
        return {
            value: this._properties['left']?.toValue()[0],
            units: this._properties['left']?.toValue()[1]
        };
    }

    resetLeft() {
        this._resetProperty('left');
        return this;
    }

    setRight(value, units) {
        this._setPropertyInUnits('right', value, units);
        return this;
    }

    getRight() {
        return {
            value: this._properties['right']?.toValue()[0],
            units: this._properties['right']?.toValue()[1]
        };
    }

    resetRight() {
        this._resetProperty('right');
        return this;
    }

    setTop(value, units) {
        this._setPropertyInUnits('top', value, units);
        return this;
    }

    getTop() {
        return {
            value: this._properties['top']?.toValue()[0],
            units: this._properties['top']?.toValue()[1]
        };
    }

    resetTop() {
        this._resetProperty('top');
        return this;
    }

    setBottom(value, units) {
        this._setPropertyInUnits('bottom', value, units);
        return this;
    }

    getBottom() {
        return {
            value: this._properties['bottom']?.toValue()[0],
            units: this._properties['bottom']?.toValue()[1]
        };
    }

    resetBottom() {
        this._resetProperty('bottom');
        return this;
    }

    setTopLeft(top, left, units) {
        this.setTop(top, units);
        this.setLeft(left, units);
        return this;
    }

    setInset(top = 0, right = 0, bottom = 0, left = 0, units) {
        this.setTop(top, units);
        this.setRight(right, units);
        this.setBottom(bottom, units);
        this.setLeft(left, units);
        return this;
    }

    getInset() {
        return {
            top: this.getTop(),
            right: this.getRight(),
            bottom: this.getBottom(),
            left: this.getLeft()
        };
    }

    resetInset() {
        this.resetTop();
        this.resetRight();
        this.resetBottom();
        this.resetLeft();
        return this;
    }
    //width
    setWidth(value, units) {
        this._setPropertyInUnits('width', value, units);
        return this;
    }

    setWidthAuto() {
        return this.setWidth('auto', '');
    }

    setWidthPercentage(value) {
        return this.setWidth(value, '%');
    }

    setFullWidth() {
        return this.setWidthPercentage(100);
    }

    getWidth() {
        return {
            value: this._properties['width']?.toValue()[0],
            units: this._properties['width']?.toValue()[1]
        };
    }

    resetWidth() {
        this._resetProperty('width');
        return this;
    }

    setMaxWidth(value, units) {
        this._setPropertyInUnits('max-width', value, units);
        return this;
    }

    getMaxWidth() {
        return {
            value: this._properties['max-width']?.toValue()[0],
            units: this._properties['max-width']?.toValue()[1]
        };
    }

    resetMaxWidth() {
        this._resetProperty('max-width');
        return this;
    }

    setMinWidth(value, units) {
        this._setPropertyInUnits('min-width', value, units);
        return this;
    }

    getMinWidth() {
        return {
            value: this._properties['min-width']?.toValue()[0],
            units: this._properties['min-width']?.toValue()[1]
        };
    }

    resetMinWidth() {
        this._resetProperty('min-width');
        return this;
    }
    //height
    setHeight(value, units) {
        this._setPropertyInUnits('height', value, units);
        return this;
    }

    setHeightAuto() {
        return this.setHeight('auto', '');
    }

    setHeightPercentage(value) {
        return this.setHeight(value, '%');
    }

    setFullHeight() {
        return this.setHeightPercentage(100);
    }

    getHeight() {
        return {
            value: this._properties['height']?.toValue()[0],
            units: this._properties['height']?.toValue()[1]
        };
    }

    resetHeight() {
        this._resetProperty('height');
        return this;
    }

    setMaxHeight(value, units) {
        this._setPropertyInUnits('max-height', value, units);
        return this;
    }

    getMaxHeight() {
        return {
            value: this._properties['max-height']?.toValue()[0],
            units: this._properties['max-height']?.toValue()[1]
        };
    }

    resetMaxHeight() {
        this._resetProperty('max-height');
        return this;
    }

    setMinHeight(value, units) {
        this._setPropertyInUnits('min-height', value, units);
        return this;
    }

    getMinHeight() {
        return {
            value: this._properties['min-height']?.toValue()[0],
            units: this._properties['min-height']?.toValue()[1]
        };
    }

    resetMinHeight() {
        this._resetProperty('min-height');
        return this;
    }
    //size
    setSize(width, height, units) {
        this.setWidth(width, units);
        this.setHeight(height, units);
        return this;
    }

    setFullSize() {
        return this.setFullWidth().setFullHeight();
    }

    getSize() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    }
    //margin/padding
    setMarginTop(value, units) {
        this._setPropertyInUnits('margin-top', value, units);
        return this;
    }

    getMarginTop() {
        return {
            value: this._properties['margin-top']?.toValue()[0],
            units: this._properties['margin-top']?.toValue()[1]
        };
    }

    resetMarginTop() {
        this._resetProperty('margin-top');
        return this;
    }

    setMarginRight(value, units) {
        this._setPropertyInUnits('margin-right', value, units);
        return this;
    }

    getMarginRight() {
        return {
            value: this._properties['margin-right']?.toValue()[0],
            units: this._properties['margin-right']?.toValue()[1]
        };
    }

    resetMarginRight() {
        this._resetProperty('margin-right');
        return this;
    }

    setMarginBottom(value, units) {
        this._setPropertyInUnits('margin-bottom', value, units);
        return this;
    }

    getMarginBottom() {
        return {
            value: this._properties['margin-bottom']?.toValue()[0],
            units: this._properties['margin-bottom']?.toValue()[1]
        };
    }

    resetMarginBottom() {
        this._resetProperty('margin-bottom');
        return this;
    }

    setMarginLeft(value, units) {
        this._setPropertyInUnits('margin-left', value, units);
        return this;
    }

    getMarginLeft() {
        return {
            value: this._properties['margin-left']?.toValue()[0],
            units: this._properties['margin-left']?.toValue()[1]
        };
    }

    resetMarginLeft() {
        this._resetProperty('margin-left');
        return this;
    }

    setMargins(top = 0, right = 0, bottom = 0, left = 0, units) {
        if (top)
            this.setMarginTop(top, units);
        if (right)
            this.setMarginRight(right, units);
        if (bottom)
            this.setMarginBottom(bottom, units);
        if (left)
            this.setMarginLeft(left, units);
        return this;
    }

    setMargin(value, units) {
        this.setMarginTop(value, units);
        this.setMarginRight(value, units);
        this.setMarginBottom(value, units);
        this.setMarginLeft(value, units);
        return this;
    }

    getMargin() {
        return {
            top: this.getMarginTop(),
            right: this.getMarginRight(),
            bottom: this.getMarginBottom(),
            left: this.getMarginLeft()
        }
    }

    resetMargin() {
        this.resetMarginTop();
        this.resetMarginRight();
        this.resetMarginBottom();
        this.resetMarginLeft();
        return this;
    }

    setPaddingTop(value, units) {
        this._setPropertyInUnits('padding-top', value, units);
        return this;
    }

    getPaddingTop() {
        return {
            value: this._properties['padding-top']?.toValue()[0],
            units: this._properties['padding-top']?.toValue()[1]
        };
    }

    resetPaddingTop() {
        this._resetProperty('padding-top');
        return this;
    }

    setPaddingRight(value, units) {
        this._setPropertyInUnits('padding-right', value, units);
        return this;
    }

    getPaddingRight() {
        return {
            value: this._properties['padding-right']?.toValue()[0],
            units: this._properties['padding-right']?.toValue()[1]
        };
    }

    resetPaddingRight() {
        this._resetProperty('padding-right');
        return this;
    }

    setPaddingBottom(value, units) {
        this._setPropertyInUnits('padding-bottom', value, units);
        return this;
    }

    getPaddingBottom() {
        return {
            value: this._properties['padding-bottom']?.toValue()[0],
            units: this._properties['padding-bottom']?.toValue()[1]
        };
    }

    resetPaddingBottom() {
        this._resetProperty('padding-bottom');
        return this;
    }

    setPaddingLeft(value, units) {
        this._setPropertyInUnits('padding-left', value, units);
        return this;
    }

    getPaddingLeft() {
        return {
            value: this._properties['padding-left']?.toValue()[0],
            units: this._properties['padding-left']?.toValue()[1]
        };
    }

    resetPaddingLeft() {
        this._resetProperty('padding-left');
        return this;
    }

    setPaddings(top = 0, right = 0, bottom = 0, left = 0, units) {
        if (top)
            this.setPaddingTop(top, units);
        if (right)
            this.setPaddingRight(right, units);
        if (bottom)
            this.setPaddingBottom(bottom, units);
        if (left)
            this.setPaddingLeft(left, units);
        return this;
    }

    setPadding(value, units) {
        this.setPaddingTop(value, units);
        this.setPaddingRight(value, units);
        this.setPaddingBottom(value, units);
        this.setPaddingLeft(value, units);
        return this;
    }

    getPadding() {
        return {
            top: this.getPaddingTop(),
            right: this.getPaddingRight(),
            bottom: this.getPaddingBottom(),
            left: this.getPaddingLeft()
        }
    }

    resetPadding() {
        this.resetPaddingTop();
        this.resetPaddingRight();
        this.resetPaddingBottom();
        this.resetPaddingLeft();
        return this;
    }
    //background-color
    setBackgroundColor(value) {
        this._setProperty('background-color', value);
        return this;
    }

    getBackgroundColor() {
        return this._properties['background-color']?.toValue()[0];
    }

    resetBackgroundColor() {
        this._resetProperty('background-color');
        return this;
    }
    //background-image
    setBackgroundImage(value) {
        this._setProperty('background-image', value);
        return this;
    }

    getBackgroundImage() {
        return this._properties['background-image']?.toValue()[0];
    }

    resetBackgroundImage() {
        this._resetProperty('background-image');
        return this;
    }
    //background-repeat
    setBackgroundRepeat(value) {
        this._setProperty('background-repeat', value);
        return this;
    }

    getBackgroundRepeat() {
        return this._properties['background-repeat']?.toValue()[0];
    }

    resetBackgroundRepeat() {
        this._resetProperty('background-repeat');
        return this;
    }
    //background-position
    setBackgroundPosition(value) {
        this._setProperty('background-position', value);
        return this;
    }

    getBackgroundPosition() {
        return this._properties['background-position']?.toValue()[0];
    }

    resetBackgroundPosition() {
        this._resetProperty('background-position');
        return this;
    }
    //background-size
    setBackgroundSize(value) {
        this._setProperty('background-size', value);
        return this;
    }

    getBackgroundSize() {
        return this._properties['background-size']?.toValue()[0];
    }

    resetBackgroundSize() {
        this._resetProperty('background-size');
        return this;
    }
    //color
    setColor(value) {
        this._setProperty('color', value);
        return this;
    }

    getColor() {
        return this._properties['color']?.toValue()[0];
    }

    resetColor() {
        this._resetProperty('color');
        return this;
    }
    //text-decoration
    setTextDecoration(value) {
        this._setProperty('text-decoration', value);
        return this;
    }

    setTextDecorationLineThrough() {
        return this.setTextDecoration('line-through');
    }

    setTextDecorationUnderline() {
        return this.setTextDecoration('underline');
    }

    setTextDecorationOverline() {
        return this.setTextDecoration('overline');
    }

    getTextDecoration() {
        return this._properties['text-decoration']?.toValue()[0];
    }

    resetTextDecoration() {
        this._resetProperty('text-decoration');
        return this;
    }
    //text-transform
    setTextTransform(value) {
        this._setProperty('text-transform', value);
        return this;
    }

    setTextTransformCapitalize() {
        return this.setTextTransform('capitalize');
    }

    setTextTransformLowercase() {
        return this.setTextTransform('lowercase');
    }

    setTextTransformUppercase() {
        return this.setTextTransform('uppercase');
    }

    getTextTransform() {
        return this._properties['text-transform']?.toValue()[0];
    }

    resetTextTransform() {
        this._resetProperty('text-transform');
        return this;
    }
    //text-align
    setTextAlign(value) {
        this._setProperty('text-align', value);
        return this;
    }

    setTextLeft() {
        return this.setTextAlign('left');
    }

    setTextRight() {
        return this.setTextAlign('right');
    }

    setTextCenter() {
        return this.setTextAlign('center');
    }

    getTextAlign() {
        return this._properties['text-align']?.toValue()[0];
    }

    resetTextAlign() {
        this._resetProperty('text-align');
        return this;
    }
    //font-family
    setFontFamily(value) {
        this._setProperty('font-family', value);
        return this;
    }

    getFontFamily() {
        return this._properties['font-family']?.toValue()[0];
    }

    resetFontFamily() {
        this._resetProperty('font-family');
        return this;
    }
    //font-weight
    setFontWeight(value) {
        this._setProperty('font-weight', value);
        return this;
    }

    getFontWeight() {
        return this._properties['font-weight']?.toValue()[0];
    }

    resetFontWeight() {
        this._resetProperty('font-weight');
        return this;
    }
    //font-size
    setFontSize(value, units) {
        this._setPropertyInUnits('font-size', value, units);
        return this;
    }

    getFontSize() {
        return {
            value: this._properties['font-size']?.toValue()[0],
            units: this._properties['font-size']?.toValue()[1]
        };
    }

    resetFontSize() {
        this._resetProperty('font-size');
        return this;
    }
    //font-style
    setFontStyle(value) {
        this._setProperty('font-style', value);
        return this;
    }

    getFontStyle() {
        return this._properties['font-style']?.toValue()[0];
    }

    resetFontStyle() {
        this._resetProperty('font-style');
        return this;
    }
    //line-height
    setLineHeight(value, units) {
        this._setPropertyInUnits('line-height', value, units);
        return this;
    }

    getLineHeight() {
        return {
            value: this._properties['line-height']?.toValue()[0],
            units: this._properties['line-height']?.toValue()[1]
        };
    }

    resetLineHeight() {
        this._resetProperty('line-height');
        return this;
    }
    //text-overflow
    setTextOverflow(value) {
        this._setProperty('text-overflow', value);
        return this;
    }

    setTextOverflowEllipsis() {
        return this.setTextOverflow('ellipsis');
    }

    getTextOverflow() {
        return this._properties['text-overflow']?.toValue()[0];
    }

    resetTextOverflow() {
        this._resetProperty('text-overflow');
        return this;
    }
    //text-wrap
    setTextWrap(value) {
        this._setProperty('text-wrap', value);
        return this;
    }

    setTextWrapNowrap() {
        return this.setTextWrap('nowrap');
    }

    setTextWrapBalance() {
        return this.setTextWrap('balance');
    }

    getTextWrap() {
        return this._properties['text-wrap']?.toValue()[0];
    }

    resetTextWrap() {
        this._resetProperty('text-wrap');
        return this;
    }
    //borders
    _setBorderEdge(edge, value, color = DEFAULT_COLOR, style = DEFAULT_BORDER_STYLE, units = DEFAULT_UNIT) {
        const prop = new UIElementProperty(`border-${edge}`)
            .value(value).unit(units)
            .value(color)
            .value(style);
        this.setProperty(prop);
    }

    _getBorderEdge(edge) {
        const values = this._properties[`border-${edge}`]?.toValues();
        return {
            value: values?.[0][0],
            units: values?.[0][1],
            color: values?.[1][0],
            style: values?.[2][0]
        }
    }
    //border-top
    setBorderTop(value, color, style, units) {
        this._setBorderEdge('top', value, color, style, units);
        return this;
    }

    getBorderTop() {
        return this._getBorderEdge('top');
    }

    resetBorderTop() {
        this._resetProperty('border-top');
        return this;
    }
    //border-right
    setBorderRight(value, color, style, units) {
        this._setBorderEdge('right', value, color, style, units);
        return this;
    }

    getBorderRight() {
        return this._getBorderEdge('right');
    }

    resetBorderRight() {
        this._resetProperty('border-right');
        return this;
    }
    //border-bottom
    setBorderBottom(value, color, style, units) {
        this._setBorderEdge('bottom', value, color, style, units);
        return this;
    }

    getBorderBottom() {
        return this._getBorderEdge('bottom');
    }

    resetBorderBottom() {
        this._resetProperty('border-bottom');
        return this;
    }
    //border-left
    setBorderLeft(value, color, style, units) {
        this._setBorderEdge('left', value, color, style, units);
        return this;
    }

    getBorderLeft() {
        return this._getBorderEdge('left');
    }

    resetBorderLeft() {
        this._resetProperty('border-left');
        return this;
    }
    //border
    setBorders(top = 0, right = 0, bottom = 0, left = 0, color, style, units) {
        if (top)
            this.setBorderTop(top, color, style, units);
        if (right)
            this.setBorderRight(right, color, style, units);
        if (bottom)
            this.setBorderBottom(bottom, color, style, units);
        if (left)
            this.setBorderLeft(left, color, style, units);
        return this;
    }

    setBorder(value, color, style, units) {
        this.setBorderLeft(value, color, style, units);
        this.setBorderRight(value, color, style, units);
        this.setBorderTop(value, color, style, units);
        this.setBorderBottom(value, color, style, units);
        return this;
    }

    getBorder() {
        return {
            top: this.getBorderTop(),
            right: this.getBorderRight(),
            bottom: this.getBorderBottom(),
            left: this.getBorderLeft(),
        }
    }

    resetBorder() {
        this.resetBorderTop();
        this.resetBorderRight();
        this.resetBorderBottom();
        this.resetBorderLeft();
        return this;
    }
    //border-radius
    setBorderRadiusCorners(topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0, units = DEFAULT_UNIT) {
        const prop = new UIElementProperty('border-radius')
            .value(topLeft).unit(units)
            .value(topRight).unit(units)
            .value(bottomRight).unit(units)
            .value(bottomLeft).unit(units);
        this.setProperty(prop);
        return this;
    }

    setBorderRadius(value, units) {
        return this.setBorderRadiusCorners(value, value, value, value, units);
    }

    getBorderRadius() {
        const values = this._properties['border-radius']?.toValues();
        return {
            topLeft: values?.[0][0],
            topRight: values?.[1][0],
            bottomRight: values?.[2][0],
            bottomLeft: values?.[3][0]
        }
    }

    resetBorderRadius() {
        this._resetProperty('border-radius');
        return this;
    }
    //vertical-align
    setVerticalAlign(value) {
        this._setProperty('vertical-align', value);
        return this;
    }

    setVerticalAlignTop() {
        return this.setVerticalAlign('top');
    }

    setVerticalAlignBottom() {
        return this.setVerticalAlign('bottom');
    }

    setVerticalAlignMiddle() {
        return this.setVerticalAlign('middle');
    }

    getVerticalAlign() {
        return this._properties['vertical-align']?.toValue()[0];
    }

    resetVerticalAlign() {
        this._resetProperty('vertical-align');
        return this;
    }
    //cursor
    setCursor(value) {
        this._setProperty('cursor', value);
        return this;
    }

    setCursorDefault() {
        return this.setCursor('default');
    }

    setCursorPointer() {
        return this.setCursor('pointer');
    }

    setCursorText() {
        return this.setCursor('text');
    }

    setCursorEastWestResize() {
        return this.setCursor('ew-resize');
    }

    setCursorNorthEastSouthWestResize() {
        return this.setCursor('nesw-resize');
    }

    setCursorNorthSouthResize() {
        return this.setCursor('ns-resize');
    }

    setCursorNorthWestSouthEastResize() {
        return this.setCursor('nwse-resize');
    }

    getCursor() {
        return this._properties['cursor']?.toValue()[0];
    }

    resetCursor() {
        this._resetProperty('cursor');
        return this;
    }
    //transition
    addTransition(property, duration = 0, timingFunction = DEFAULT_TRANSITION_FUNCTION, delay = 0, behavior = '', units = DEFAULT_TIME_UNIT) {
        const props = this._properties['transition'] || new UIElementPropertyArray('transition');
        props.property(new UIElementProperty('transition')
            .value(property)
            .value(duration).unit(units)
            .value(timingFunction)
            .value(delay).unit(units)
            .value(behavior));
        this.setProperty(props);
        return this;
    }

    addTransitionAll(duration, timingFunction, delay, behavior, units) {
        return this.addTransition('all', duration, timingFunction, delay, behavior, units);
    }

    setTransition(property, duration = 0, timingFunction = DEFAULT_TRANSITION_FUNCTION, delay = 0, behavior = '', units = DEFAULT_TIME_UNIT) {
        const props = new UIElementPropertyArray('transition')
            .property(new UIElementProperty('transition')
                .value(property)
                .value(duration).unit(units)
                .value(timingFunction)
                .value(delay).unit(units)
                .value(behavior));
        this.setProperty(props);
        return this;
    }

    setTransitionAll(duration, timingFunction, delay, behavior, units) {
        return this.setTransition('all', duration, timingFunction, delay, behavior, units);
    }

    getTransition() {
        const values = this._properties['transition']?.toValues();
        return values
            ? values.map(propertiesValues => ({
                property: propertiesValues?.[0][0],
                duration: propertiesValues?.[1][0],
                durationUnits: propertiesValues?.[1][1],
                timingFunction: propertiesValues?.[2][0],
                delay: propertiesValues?.[3][0],
                delayUnits: propertiesValues?.[3][1],
                behavior: propertiesValues?.[4][0]
            }))
            : [];
    }

    resetTransition() {
        this._resetProperty('transition');
        return this;
    }
    //overflow
    setOverflow(value) {
        this._setProperty('overflow', value);
        return this;
    }

    setOverflowAuto() {
        return this.setOverflow('auto');
    }

    setOverflowHidden() {
        return this.setOverflow('hidden');
    }

    getOverflow() {
        return this._properties['overflow']?.toValue()[0];
    }

    resetOverflow() {
        this._resetProperty('overflow');
        return this;
    }
    //z-index
    setZIndex(value) {
        this._setProperty('z-index', value);
        return this;
    }

    getZIndex() {
        return this._properties['z-index']?.toValue()[0];
    }

    resetZIndex() {
        this._resetProperty('z-index');
        return this;
    }
    //user-select
    setUserSelect(value) {
        this._setProperty('user-select', value);
        return this;
    }

    setUserSelectNone() {
        return this.setUserSelect('none');
    }

    getUserSelect() {
        return this._properties['user-select']?.toValue()[0];
    }

    resetUserSelect() {
        this._resetProperty('user-select');
        return this;
    }
    //box-shadow
    addBoxShadow(color = DEFAULT_COLOR, offsetX = 0, offsetY = 0, blurRadius = 0, spreadRadius = 0, units = DEFAULT_UNIT) {
        const props = this._properties['box-shadow'] || new UIElementPropertyArray('box-shadow');
        props.property(new UIElementProperty('box-shadow')
            .value('')
            .value(color)
            .value(offsetX).unit(units)
            .value(offsetY).unit(units)
            .value(blurRadius).unit(units)
            .value(spreadRadius).unit(units));
        this.setProperty(props);
        return this;
    }

    addInsetBoxShadow(color = DEFAULT_COLOR, offsetX = 0, offsetY = 0, blurRadius = 0, spreadRadius = 0, units = DEFAULT_UNIT) {
        const props = this._properties['box-shadow'] || new UIElementPropertyArray('box-shadow');
        props.property(new UIElementProperty('box-shadow')
            .value('inset')
            .value(color)
            .value(offsetX).unit(units)
            .value(offsetY).unit(units)
            .value(blurRadius).unit(units)
            .value(spreadRadius).unit(units));
        this.setProperty(props);
        return this;
    }

    addBoxShadowCentered(color, blurRadius, spreadRadius, units) {
        return this.addBoxShadow(color, 0, 0, blurRadius, spreadRadius, units);
    }

    addBoxShadowCenteredNoSpread(color, blurRadius, units) {
        return this.addBoxShadow(color, 0, 0, blurRadius, 0, units);
    }

    setBoxShadow(color, offsetX, offsetY, blurRadius, spreadRadius, units) {
        this.resetBoxShadow();
        return this.addBoxShadow(color, offsetX, offsetY, blurRadius, spreadRadius, units);
    }

    setInsetBoxShadow(color, offsetX, offsetY, blurRadius, spreadRadius, units) {
        this.resetBoxShadow();
        return this.addInsetBoxShadow(color, offsetX, offsetY, blurRadius, spreadRadius, units);
    }

    setBoxShadowCentered(color, blurRadius, spreadRadius, units) {
        return this.setBoxShadow(color, 0, 0, blurRadius, spreadRadius, units);
    }

    setBoxShadowCenteredNoSpread(color, blurRadius, units) {
        return this.setBoxShadow(color, 0, 0, blurRadius, 0, units);
    }

    getBoxShadow() {
        const values = this._properties['box-shadow']?.toValues();
        return values
            ? values.map(propertiesValues => ({
                inset: propertiesValues?.[0][0],
                color: propertiesValues?.[1][0],
                offsetX: propertiesValues?.[2][0],
                offsetXUnits: propertiesValues?.[2][1],
                offsetY: propertiesValues?.[3][0],
                offsetYUnits: propertiesValues?.[3][1],
                blurRadius: propertiesValues?.[4][0],
                blurRadiusUnits: propertiesValues?.[4][1],
                spreadRadius: propertiesValues?.[5][0],
                spreadRadiusUnits: propertiesValues?.[5][1]
            }))
            : [];
    }

    resetBoxShadow() {
        this._resetProperty('box-shadow');
        return this;
    }
    //text-shadow
    setTextShadow(color = DEFAULT_COLOR, offsetX = 0, offsetY = 0, blurRadius = 0, units = DEFAULT_UNIT) {
        const prop = new UIElementProperty('text-shadow')
            .value(color)
            .value(offsetX).unit(units)
            .value(offsetY).unit(units)
            .value(blurRadius).unit(units);
        this.setProperty(prop);
        return this;
    }

    setTextShadowCentered(color, blurRadius, units) {
        return this.setTextShadow(color, 0, 0, blurRadius, units);
    }

    getTextShadow() {
        const values = this._properties['text-shadow']?.toValues();
        return {
            color: values?.[0][0],
            offsetX: values?.[1][0],
            offsetXUnits: values?.[1][1],
            offsetY: values?.[2][0],
            offsetYUnits: values?.[2][1],
            blurRadius: values?.[3][0],
            blurRadiusUnits: values?.[3][1]
        }
    }

    resetTextShadow() {
        this._resetProperty('text-shadow');
        return this;
    }
    //outline
    setOutline(value) {
        this._setProperty('outline', value);
        return this;
    }

    setOutlineNone() {
        return this.setOutline('none');
    }

    getOutline() {
        return this._properties['outline']?.toValue()[0];
    }

    resetOutline() {
        this._resetProperty('outline');
        return this;
    }
    //white-space
    setWhiteSpace(value) {
        this._setProperty('white-space', value);
        return this;
    }

    setWhiteSpaceNowrap() {
        return this.setWhiteSpace('nowrap');
    }

    setWhiteSpacePre() {
        return this.setWhiteSpace('pre');
    }

    getWhiteSpace() {
        return this._properties['white-space']?.toValue()[0];
    }

    resetWhiteSpace() {
        this._resetProperty('white-space');
        return this;
    }
    //word-break
    setWordBreak(value) {
        this._setProperty('word-break', value);
        return this;
    }

    setWordBreakBreakAll() {
        return this.setWordBreak('break-all');
    }

    setWordBreakBreakWord() {
        return this.setWordBreak('break-word');
    }

    getWordBreak() {
        return this._properties['word-break']?.toValue()[0];
    }

    resetWordBreak() {
        this._resetProperty('word-break');
        return this;
    }
    //word-spacing
    setWordSpacing(value, units) {
        this._setPropertyInUnits('word-spacing', value, units);
        return this;
    }

    getWordSpacing() {
        return {
            value: this._properties['word-spacing']?.toValue()[0],
            units: this._properties['word-spacing']?.toValue()[1]
        };
    }

    resetWordSpacing() {
        this._resetProperty('word-spacing');
        return this;
    }
    //letter-spacing
    setLetterSpacing(value, units) {
        this._setPropertyInUnits('letter-spacing', value, units);
        return this;
    }

    getLetterSpacing() {
        return {
            value: this._properties['letter-spacing']?.toValue()[0],
            units: this._properties['letter-spacing']?.toValue()[1]
        };
    }

    resetLetterSpacing() {
        this._resetProperty('letter-spacing');
        return this;
    }
    //object-fit
    setObjectFit(value) {
        this._setProperty('object-fit', value);
        return this;
    }

    setObjectFitContain() {
        return this.setObjectFit('contain');
    }

    setObjectFitCover() {
        return this.setObjectFit('cover');
    }

    setObjectFitFill() {
        return this.setObjectFit('fill');
    }

    getObjectFit() {
        return this._properties['object-fit']?.toValue()[0];
    }

    resetObjectFit() {
        this._resetProperty('object-fit');
        return this;
    }
    //object-position
    setObjectPosition(valueX = 0, valueY = 0, units = DEFAULT_UNIT) {
        const prop = new UIElementProperty('object-position')
            .value(valueX).unit(units)
            .value(valueY).unit(units);
        this.setProperty(prop);
        return this;
    }

    setObjectPositionString(valueX = 'center', valueY = 'center') {
        return this.setObjectPosition(valueX, valueY, '');
    }

    getObjectPosition() {
        const values = this._properties['object-position']?.toValues();
        return {
            xValue: values?.[0][0],
            xUnit: values?.[0][1],
            yValue: values?.[1][0],
            yUnit: values?.[1][1],
        }
    }

    resetObjectPosition() {
        this._resetProperty('object-position');
        return this;
    }
    //transform
    addTransform(transformation) {
        const props = this._properties['transform'] || new UIElementPropertyArray('transform', ' ');
        props.property(new UIElementProperty('transform')
            .value(transformation));
        this.setProperty(props);
        return this;
    }

    setTransform(transformation) {
        this.resetTransform();
        return this.addTransform(transformation);
    }

    addTransformRotate(deg = 0) {
        return this.addTransform(`rotate(${deg}deg)`);
    }

    setTransformRotate(deg = 0) {
        this.resetTransform();
        return this.addTransformRotate(deg);
    }

    addTransformTranslate(x = 0, y = 0, units = DEFAULT_UNIT) {
        return this.addTransform(`translate(${x}${units}, ${y}${units})`);
    }

    setTransformTranslate(x, y) {
        this.resetTransform();
        return this.addTransformTranslate(x, y);
    }

    addTransformScale(scaleX = 1, scaleY = 1) {
        return this.addTransform(`scale(${scaleX}, ${scaleY})`);
    }

    setTransformScale(scaleX, scaleY) {
        this.resetTransform();
        return this.addTransformScale(scaleX, scaleY);
    }

    addTransformSkew(degX = 0, degY = 0) {
        return this.addTransform(`skew(${degX}deg, ${degY}deg)`);
    }

    setTransformSkew(degX, degY) {
        this.resetTransform();
        return this.addTransformSkew(degX, degY);
    }

    addTransformSkewX(deg = 0) {
        return this.addTransform(`skewX(${deg}deg)`);
    }

    setTransformSkewX(deg) {
        this.resetTransform();
        return this.addTransformSkewX(deg);
    }

    addTransformSkewY(deg = 0) {
        return this.addTransform(`skewY(${deg}deg)`);
    }

    setTransformSkewY(deg) {
        this.resetTransform();
        return this.addTransformSkewY(deg);
    }

    addTransformPerspective(perspective = 'none') {
        return this.addTransform(`perspective(${perspective})`);
    }

    setTransformPerspective(perspective) {
        this.resetTransform();
        return this.addTransformPerspective(perspective);
    }

    addTransformMatrix(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        return this.addTransform(`matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`);
    }

    setTransformMatrix(a, b, c, d, tx, ty) {
        this.resetTransform();
        return this.addTransformMatrix(a, b, c, d, tx, ty);
    }

    addTransformMatrix3d(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4) {
        return this.addTransform(`matrix3d(${a1}, ${a2}, ${a3}, ${a4}, ${b1}, ${b2}, ${b3}, ${b4}, ${c1}, ${c2}, ${c3}, ${c4}, ${d1}, ${d2}, ${d3}, ${d4})`);
    }

    setTransformMatrix3d(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4) {
        this.resetTransform();
        return this.addTransformMatrix3d(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4);
    }

    getTransform() {
        const values = this._properties['transform']?.toValues();
        return values
            ? values.map(propertyValues => {
                const transformName = propertyValues?.[0][0];
                const match = transformName.match(/^(\w+)\((.+)\)$/);
                if (match) {
                    const name = match[1];
                    const params = match[2].split(',').map(param => {
                        const value = parseFloat(param);
                        if (isNaN(value)) return param;
                        const unit = param.trim().replace(value, '').trim();
                        return [value, unit];
                    });
                    return { name, params };
                }
                return { name: transformName, params: [] };
            })
            : [];
    }

    resetTransform() {
        this._resetProperty('transform');
        return this;
    }
}

export default UIElement