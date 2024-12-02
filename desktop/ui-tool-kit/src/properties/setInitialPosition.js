import setPosition from './setPosition.js'

export const setInitialPosition = (view, uiElement) => {
    if (view._initialPosition) {
        uiElement
            .setPositionRelative()
            .resetLeft()
            .resetTop()
            .resetRight()
            .resetBottom()
    } else {
        uiElement.setPositionAbsolute()
        setPosition(view, uiElement)
    }
}

export default setInitialPosition