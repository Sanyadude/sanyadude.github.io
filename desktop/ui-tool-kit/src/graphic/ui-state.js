export class UIState {
    constructor(configuration = {}) {
        this._configuration = configuration;
    }

    getConfiguration() {
        return this._configuration;
    }

}

export default UIState;