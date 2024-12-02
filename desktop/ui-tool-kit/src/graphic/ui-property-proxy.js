export class UIPropertyProxy {
    constructor(property, context, propertyApplyFunc) {
        this.property = property || null;
        this.context = context;
        this.propertyApplyFunc = propertyApplyFunc;
        if (!this.property) return;
        this.property.proxyApply = () => this.apply();
    }

    apply() {
        this.propertyApplyFunc(this.property, this.context);
    }
}

export default UIPropertyProxy