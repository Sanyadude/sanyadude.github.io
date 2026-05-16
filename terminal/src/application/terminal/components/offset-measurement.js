/**
 * OffsetMeasurement class - for measuring offset between two elements
 */
export class OffsetMeasurement {
    /**
     * Measures the offset between two elements
     * @param {HTMLElement} referenceElement - The reference element
     * @param {HTMLElement} targetElement - The target element
     * @returns {{ left: number, top: number, right: number, bottom: number }} - The offset of the two elements
     */
    static measure(referenceElement, targetElement) {
        const referenceElementRect = referenceElement.getBoundingClientRect();
        const targetElementRect = targetElement.getBoundingClientRect();
        return {
            left: targetElementRect.left - referenceElementRect.left,
            top: targetElementRect.top - referenceElementRect.top,
            right: referenceElementRect.right - targetElementRect.right,
            bottom: referenceElementRect.bottom - targetElementRect.bottom
        };
    }
}

export default OffsetMeasurement