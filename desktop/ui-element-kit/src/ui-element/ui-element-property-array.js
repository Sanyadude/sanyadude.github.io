/**
 * Represents element properties array
 */
export class UIElementPropertyArray {
    /**
     * Creates a new UIElementPropertyArray object
     * 
     * @param {string} name - The name of the UIElementPropertyArray (should be valid css property name)
     * @param {string} separator - The separator string that would separate properties when `toStyle()` called
     */
    constructor(name, separator = ',') {
        this.name = name;
        this._separator = separator;

        this._properties = [];
    }

    /**
     * Adds property to properties array (later used to convert to css style string value)
     * 
     * @example 
     * 
     * new UIElementPropertyArray('box-shadow').property(new UIElementProperty('box-shadow').value(color).value(offsetX).unit('px').value(offsetY).unit('px'))
     * 
     * @param {UIElementProperty} property - The property that will be added to array
     * 
     * @returns {this} The modified UIElementPropertyArray object
     */
    property(property) {
        this._properties.push(property);
        return this;
    }

    /**
     * Converts properties to css style string
     * 
     * @returns {string} The css style string value based on values and units of measure of UIElementProperty array joined using separator
     */
    toStyle() {
        return this._properties.map(property => property.toStyle()).join(this._separator);
    }

    /**
     * Gets value and unit of measure by valueIndex of property at propertyIndex
     * 
     * @param {number} propertyIndex - The index of the property(default value `0`)
     * @param {number} valueIndex - The index of the value(default value `0`)
     * 
     * @returns {array} The css style value(index `0`) and unit(index `1`) of property at propertyIndex
     */
    toValue(propertyIndex = 0, valueIndex = 0) {
        return this._properties[propertyIndex] ? this._properties[propertyIndex].toValue(valueIndex) : ['', ''];
    }

    /**
     * Gets values and units of measure of all saved properties in array
     * 
     * @returns {array} The array of `toValues()` function results of each property
     */
    toValues() {
        return this._properties.map(property => property.toValues());
    }
}

export default UIElementPropertyArray