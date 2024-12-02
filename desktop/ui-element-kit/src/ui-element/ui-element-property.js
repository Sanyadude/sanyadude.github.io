/**
 * Represents element property, contains values and units of measure of style property in arrays and can convert it to css style string value
 */
export class UIElementProperty {
    /**
     * Creates a new UIElementProperty object
     * 
     * @param {string} name - The name of the UIElementProperty (should be valid css property name)
     */
    constructor(name) {
        this.name = name;

        this._values = [];
        this._units = [];
    }

    /**
     * Adds value to values list (later used to convert to css style string value)
     * Sets default unit of measure for this value as empty string (for values that don't have units of measure)
     * 
     * @example 
     * 
     * new UIElementProperty('width').value('auto')
     * 
     * new UIElementProperty('width').value(100).unit('%')
     * 
     * @param {number|string} value - The value of the style property
     * 
     * @returns {this} The modified UIElementProperty object
     */
    value(value) {
        this._values.push(value);
        const index = this._values.length - 1;
        this._units[index] = '';
        return this;
    }

    /**
     * Adds unit to units list (later used to convert to css style string value)
     * Should be called after `value()` method to update units of measure of that value
     * 
     * @example 
     * 
     * new UIElementProperty('font-size').value(1).unit('em')
     * 
     * @param {string} unit - The unit of measure of the previously set style property
     * 
     * @returns {this} The modified UIElementProperty object
     */
    unit(unit) {
        const index = this._values.length - 1;
        if (index < 0) return this;
        this._units[index] = unit;
        return this;
    }

    /**
     * Converts values and units to css style string
     * 
     * @returns {string} The css style string value based on values and units of measure of UIElementProperty
     */
    toStyle() {
        let styleText = '';
        for (let i = 0; i < this._values.length; i++) {
            styleText += `${i > 0 ? ' ' : ''}${this._values[i] != undefined ? this._values[i] : ''}${this._units[i] != undefined ? this._units[i] : ''}`
        }
        return styleText;
    }

    /**
     * Gets value and unit of measure by index
     * 
     * @example 
     *
     * new UIElementProperty('width').value(100).unit('%').toValue() // will return [100, '%']
     * 
     * @param {number} index - The index of the value(default value `0`)
     * 
     * @returns {array} The css style value(index `0`) and unit(index `1`)
     */
    toValue(index = 0) {
        return [this._values[index] || '', this._units[index] || ''];
    }

    /**
     * Gets all saved values and units of measure
     * 
     * @example 
     *
     * new UIElementProperty('width').value(100).unit('%').toValues() // will return [[100, '%']]
     * 
     * @returns {array} The array of value arrays containing css style value(index `0`) and unit of measure(index `1`)
     */
    toValues() {
        const values = [];
        for (let i = 0; i < this._values.length; i++) {
            values.push([this._values[i], this._units[i]]);
        }
        return values;
    }
}

export default UIElementProperty