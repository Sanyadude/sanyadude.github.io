/**
 * CharacterMeasurement class - for measuring the size of a character
 */
export class CharacterMeasurement {
    /**
     * Measures the size of a character by inserting it into container and measuring the bounding client rect
     * @param {HTMLElement} container - The container of the characters
     * @returns {object} - The size of the character
     */
    static measure(container) {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.textContent = 'A';
        container.appendChild(span);
        const charWidth = span.getBoundingClientRect().width;
        const charHeight = span.getBoundingClientRect().height;
        container.removeChild(span);
        return { width: charWidth, height: charHeight };
    }
}

export default CharacterMeasurement