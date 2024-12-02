import UIEdge from './ui-edge.js'

export const UIEdgeSet = Object.freeze({
    top: [UIEdge.top],
    right: [UIEdge.right],
    bottom: [UIEdge.bottom],
    left: [UIEdge.left],
    all: [UIEdge.top, UIEdge.right, UIEdge.bottom, UIEdge.left],
    horizontal: [UIEdge.left, UIEdge.right],
    vertical: [UIEdge.top, UIEdge.bottom],
    topLeft: [UIEdge.top, UIEdge.left],
    topRight: [UIEdge.top, UIEdge.right],
    bottomLeft: [UIEdge.bottom, UIEdge.left],
    bottomRight: [UIEdge.bottom, UIEdge.right],
    leftTopRight: [UIEdge.left, UIEdge.top, UIEdge.right],
    leftBottomRight: [UIEdge.left, UIEdge.bottom, UIEdge.right],
    topLeftBottom: [UIEdge.top, UIEdge.left, UIEdge.bottom],
    topRightBottom: [UIEdge.top, UIEdge.right, UIEdge.bottom]
})

export default UIEdgeSet